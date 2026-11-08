export async function onRequest({request,env,params}){
 const id=String(params.slug||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);
 if(!env.QR_KV)return new Response('Storage unavailable',{status:503});
 const item=await env.QR_KV.get('qr:'+id,'json');
 if(!item||item.active===false)return new Response('QR link not found',{status:404,headers:{'content-type':'text/plain; charset=utf-8'}});
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