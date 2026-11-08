import {json,authorized} from '../_lib.js';
export async function onRequestGet({request,env}){
 if(!await authorized(request,env))return json({error:'Unauthorized'},401);
 if(!env.QR_KV)return json({error:'KV binding QR_KV is missing'},503);
 let cursor,events=[],counts={};
 do{const p=await env.QR_KV.list({prefix:'scan:',cursor,limit:1000});cursor=p.list_complete?undefined:p.cursor;for(const k of p.keys){const e=await env.QR_KV.get(k.name,'json');if(e){events.push(e);counts[e.id]=(counts[e.id]||0)+1}}}while(cursor);
 const codes=await env.QR_KV.list({prefix:'qr:',limit:1000}),items=[];
 for(const k of codes.keys){const x=await env.QR_KV.get(k.name,'json');if(x)items.push(x)}
 const byType={};events.forEach(e=>byType[e.type]=(byType[e.type]||0)+1);
 const topId=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0],top=items.find(x=>x.id===topId);
 const day=Date.now()-86400000;
 return json({ok:true,totalScans:events.length,scannedCodes:Object.keys(counts).length,top:top?{name:top.name,scans:counts[topId]}:null,recent24h:events.filter(e=>e.createdAt>=day).length,byType,counts});
}