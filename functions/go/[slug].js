function unavailablePage(state){
 const inactive=state==='inactive';
 const title=inactive?'QR code temporarily disabled':'QR code unavailable';
 const message=inactive?'This QR code has been paused by its owner. Please try again later.':'This QR code may have been deleted or the link is incorrect.';
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#000000"><title>${title} · CLADx</title><link rel="icon" type="image/webp" href="/assets/avatar.webp"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"><style>*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Arial,sans-serif;background:#000;color:#effcff}body{min-height:100dvh;display:flex;flex-direction:column;padding:18px}.head{height:72px;border:1px solid rgba(255,255,255,.18);border-radius:50px;display:flex;align-items:center;justify-content:space-between;padding:10px 22px}.head img{width:150px;height:46px;object-fit:contain;border-radius:0}.lang{border:1px solid rgba(0,229,255,.35);border-radius:30px;padding:9px 15px;background:#10191e;color:#00e5f5;cursor:pointer}.main{flex:1;display:grid;place-items:center;text-align:center;padding:20px}.message{max-width:480px}.mark{width:94px;height:94px;margin:0 auto 22px;border-radius:30px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(0,181,217,.18),rgba(0,255,255,.07));border:1px solid rgba(0,229,255,.3);color:#00e5f5;font-size:42px}.message h1{font-size:clamp(23px,4vw,34px);margin:0 0 12px}.message p{color:#91aab1;line-height:1.7;margin:0}.foot{text-align:center;color:#71868d;font-size:11px;padding:14px}.foot a{color:#9ab9c0;text-decoration:none}.foot a:hover{color:#00dff4}@media(max-height:480px){body{padding:10px}.head{height:54px}.head img{height:36px}.main{padding:8px}.mark{width:62px;height:62px;font-size:28px;margin-bottom:10px}}</style></head><body><header class="head"><img src="/assets/logo.webp" alt="CLADx"><button class="lang" id="lang">العربية</button></header><main class="main"><section class="message"><div class="mark"><i class="fa-solid ${inactive?'fa-pause':'fa-qrcode'}"></i></div><h1 id="title">${title}</h1><p id="message">${message}</p></section></main><footer class="foot"><span id="developed">QRCo Developed by</span> <a href="https://cladxagency.com" target="_blank" rel="noopener">CLADx</a></footer><script>const inactive=${inactive};let ar=false;document.getElementById('lang').onclick=()=>{ar=!ar;document.documentElement.lang=ar?'ar':'en';document.documentElement.dir=ar?'rtl':'ltr';document.getElementById('lang').textContent=ar?'English':'العربية';document.getElementById('title').textContent=inactive?(ar?'رمز QR غير مفعل مؤقتًا':'QR code temporarily disabled'):(ar?'رمز QR غير متاح':'QR code unavailable');document.getElementById('message').textContent=inactive?(ar?'تم إيقاف رمز QR مؤقتًا بواسطة مالكه. يُرجى المحاولة لاحقًا.':'This QR code has been paused by its owner. Please try again later.'):(ar?'ربما تم حذف رمز QR أو أن الرابط غير صحيح.':'This QR code may have been deleted or the link is incorrect.');document.getElementById('developed').textContent=ar?'QRCo تم التطوير بواسطة':'QRCo Developed by'};</script></body></html>`;
 return new Response(html,{status:inactive?410:404,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
}
export async function onRequest({request,env,params}){
 const id=String(params.slug||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);
 if(!env.QR_KV)return new Response('Storage unavailable',{status:503});
 const item=await env.QR_KV.get('qr:'+id,'json');
 if(!item)return unavailablePage('deleted');if(item.active===false)return unavailablePage('inactive');
 try{
 const now=Date.now(),ua=request.headers.get('user-agent')||'',country=request.cf?.country||'Unknown';
 const device=/mobile|android|iphone|ipad/i.test(ua)?'mobile':'desktop';
 const event={id,name:item.name,type:item.type,createdAt:now,country,device,referrer:(()=>{try{return new URL(request.headers.get('referer')||'').hostname}catch{return ''}})()};
 const eventId='scan:'+now+':'+crypto.randomUUID();
 await env.QR_KV.put(eventId,JSON.stringify(event));
 await env.QR_KV.put('scanmeta:'+id,JSON.stringify({id,name:item.name,type:item.type,lastScan:now}),{expirationTtl:60*60*24*365});
 const notice={title:'QR code scanned',message:`${item.name} was scanned from ${device} · ${country}`,createdAt:now,id};
 await env.QR_KV.put('notice:'+String(now).padStart(13,'0')+':'+crypto.randomUUID(),JSON.stringify(notice));
 const thresholds=[50,100,500,1000,5000];
 const countKey='scancount:'+id;
 const current=Number(await env.QR_KV.get(countKey)||0)+1;
 await env.QR_KV.put(countKey,String(current));
 for(const threshold of thresholds){if(current===threshold){await env.QR_KV.put('notice:'+String(now+1).padStart(13,'0')+':'+crypto.randomUUID(),JSON.stringify({title:'QR scan milestone',message:`${item.name} reached ${threshold} scans.`,createdAt:now,id,threshold}));}}
 }catch(error){/* analytics failures must never interrupt the QR destination */}
 const dest=new URL('/public.html?id='+encodeURIComponent(id),request.url);
 if(item.type==='url'&&/^https?:\/\//i.test(item.data?.url||''))return new Response(null,{status:302,headers:{location:item.data.url,'cache-control':'no-store'}});
 if(item.type==='phone'&&item.data?.phone)return new Response(null,{status:302,headers:{location:'tel:'+String(item.data.phone).replace(/[^\d+*#;,]/g,''),'cache-control':'no-store'}});
 return new Response(null,{status:302,headers:{location:dest.href,'cache-control':'no-store'}});
}