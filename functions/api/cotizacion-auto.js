/**
 * Alejandro CAD/CAM — Cotización automática por email/WA
 * POST /api/cotizacion-auto
 * Body: { nombre, email, whatsapp, servicio, descripcion }
 *
 * Guarda cotización en Supabase + envía resumen por WA
 * Env vars: SUPABASE_SERVICE_KEY, CALLMEBOT_APIKEY
 */

const SURL = 'https://zgihrwqfyvgyapbwzkvw.supabase.co';
const WA_ALEJANDRO = '573219581949';
const CORS_OK = ['https://alejandrocadcam.pages.dev'];

function cors(o){const ok=CORS_OK.includes(o)||(o||'').includes('.pages.dev')||!o;return{'Access-Control-Allow-Origin':ok?o||'*':CORS_OK[0],'Content-Type':'application/json'};}
function escH(s){return String(s||'').replace(/[<>"'&]/g,'');}

export async function onRequestOptions({request}){
  return new Response(null,{status:204,headers:{...cors(request.headers.get('Origin')||''),'Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
}

// Tabla de precios base AC
const PRECIOS = {
  'corona': {base:20, label:'Corona anatómica'},
  'carilla': {base:25, label:'Carilla estética'},
  'puente': {base:15, label:'Puente (por pieza)'},
  'guia_quirurgica': {base:120, label:'Guía quirúrgica 1 implante'},
  'full_arch': {base:150, label:'Full Arch / All-on-4'},
  'alineadores': {base:80, label:'Setup alineadores (por arco)'},
  'provisional': {base:12, label:'Provisional CAD'},
  'waxup': {base:20, label:'Wax-Up / DSD'},
  'ferula': {base:35, label:'Férula oclusal'},
  'endocrown': {base:22, label:'Endocrown'},
  'removible': {base:50, label:'Base removible'},
};

async function _rlCotizacion(request){
  try{
    const ip=request.headers.get('CF-Connecting-IP')||'unknown';
    const rlKey=new Request('https://rl.internal/cotizacion-auto_'+ip);
    const hit=await caches.default.match(rlKey);
    const count=hit?(parseInt(await hit.text(),10)||0):0;
    if(count>=5) return false; // máx 5/min por IP — evita spam de WhatsApp y BD
    await caches.default.put(rlKey,new Response(String(count+1),{headers:{'Cache-Control':'max-age=60'}}));
    return true;
  }catch{return true;}
}

export async function onRequestPost({request,env}){
  const origin=request.headers.get('Origin')||'';
  const h=cors(origin);

  if(!(await _rlCotizacion(request))) return new Response(JSON.stringify({error:'Demasiadas solicitudes.'}),{status:429,headers:h});

  if(!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({error:'config falta'}),{status:503,headers:h});

  let body;
  try{body=await request.json();}catch{return new Response(JSON.stringify({error:'JSON inválido'}),{status:400,headers:h});}

  const {nombre,email,whatsapp,servicio,descripcion,cantidad=1}=body;
  if(!servicio) return new Response(JSON.stringify({error:'Falta servicio'}),{status:400,headers:h});

  const srv=PRECIOS[servicio]||{base:0,label:servicio};
  const total=srv.base*Number(cantidad||1);
  const moneda='USD';

  const sbH={'apikey':env.SUPABASE_SERVICE_KEY,'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}`,'Content-Type':'application/json','Prefer':'return=minimal'};

  // Guardar cotización
  try{
    await fetch(`${SURL}/rest/v1/cotizaciones`,{
      method:'POST',headers:sbH,
      body:JSON.stringify({
        doctor:escH(nombre),doctor_nombre:escH(nombre),
        email:escH(email),doctor_email:escH(email),
        whatsapp:escH(whatsapp),
        tipo:servicio,items:[{servicio,cantidad,precio:srv.base,label:srv.label}],
        subtotal:total,total,moneda,estado:'enviada',
        notas:escH(descripcion),negocio:'alejandrocadcam',
      })
    });
  }catch(_){}

  // CallMeBot responde HTTP 200 incluso en fallos — solo "Message queued"
  // en el texto confirma envio real. Se registra el fallo porque este WA
  // es la unica notificacion que recibe Alejandro de un lead nuevo.
  async function _enviarWA(phone, msg, logTipo){
    try{
      const r=await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(msg)}&apikey=${env.CALLMEBOT_APIKEY}`);
      const t=await r.text();
      if(!r.ok||!/message queued/i.test(t)){
        await fetch(`${SURL}/rest/v1/logs_incidencias`,{
          method:'POST',
          headers:{'apikey':env.SUPABASE_SERVICE_KEY,'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}`,'Content-Type':'application/json'},
          body:JSON.stringify({tipo:logTipo,severidad:'WARN',descripcion:`[cotizacion-auto] Fallo WA a ${phone}: ${t.slice(0,300)}`,resuelta:false}),
        }).catch(()=>{});
      }
    }catch(_){}
  }

  // WA a Alejandro con el lead
  if(env.CALLMEBOT_APIKEY){
    const nombreCorto=(nombre||'Doctor').split(' ')[0];
    const msg=`🦷 *Alejandro CAD — Nueva Cotización*\n\n👤 *Doctor:* ${escH(nombre)}\n📱 *WA:* ${escH(whatsapp||'—')}\n📧 *Email:* ${escH(email||'—')}\n\n🔧 *Servicio:* ${srv.label}\n🔢 *Cantidad:* ${cantidad}\n💰 *Total estimado:* $${total} USD\n\n📋 *Descripción:* ${escH((descripcion||'').slice(0,200))}`;
    await _enviarWA(WA_ALEJANDRO, msg, 'COTIZACION_AUTO_WA_ADMIN_ERROR');
  }

  // WA al doctor
  if(whatsapp&&env.CALLMEBOT_APIKEY){
    const wa=String(whatsapp).replace(/\D/g,'');
    const waFull=wa.length===10?'57'+wa:wa;
    const msg2=`🦷 *Alejandro Carvajal CAD/CAM*\n\nHola ${escH((nombre||'Doctor').split(' ')[0])}, recibimos tu solicitud de cotización.\n\n🔧 *Servicio:* ${srv.label}\n💰 *Estimado:* $${total} USD/unidad\n\nTe contactamos pronto para confirmar los detalles.\n📱 +57 321 958 1949`;
    await _enviarWA(waFull, msg2, 'COTIZACION_AUTO_WA_DOCTOR_ERROR');
  }

  return new Response(JSON.stringify({ok:true,total,moneda,servicio:srv.label}),{status:200,headers:h});
}
