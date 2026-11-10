const htmlEscape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function onRequest({request,env,next}){
 if(!env.QR_KV)return new Response('Storage unavailable',{status:503});
 const item=await env.QR_KV.get('qr:bio','json');
 if(!item||item.active===false)return Response.redirect(new URL('/go/bio',request.url),302);
 const response=await next({request:new Request(new URL('/public.html?id=bio',request.url),request)});
 const html=await response.text();
 const title=htmlEscape((item.data?.companyName||item.name||'Bio links')+' | QRCo');
 const description=htmlEscape(item.data?.description||'Company links and social profiles');
 const updated=html.replace('<title>CLADx QR</title>',`<title>${title}</title>`)
  .replace('<meta name="description" content="CLADx QR destination">',`<meta name="description" content="${description}">`)
  .replace('<meta property="og:image" content="/assets/avatar.webp">',`<meta property="og:title" content="${title}"><meta property="og:image" content="${new URL('/assets/avatar.webp',request.url).href}">`)
  .replace('<meta name="twitter:card" content="summary">',`<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${title}">`);
 const headers=new Headers(response.headers);headers.set('content-type','text/html; charset=utf-8');headers.set('cache-control','no-store');
 return new Response(updated,{status:response.status,headers});
}
