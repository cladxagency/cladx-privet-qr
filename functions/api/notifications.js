import {json,authorized} from '../_lib.js';
export async function onRequestGet({request,env}){
 if(!await authorized(request,env))return json({error:'Unauthorized'},401);
 if(!env.QR_KV)return json({error:'KV binding QR_KV is missing'},503);
 let cursor,notifications=[];
 do{const p=await env.QR_KV.list({prefix:'notice:',cursor,limit:1000});cursor=p.list_complete?undefined:p.cursor;for(const k of p.keys){const n=await env.QR_KV.get(k.name,'json');if(n)notifications.push(n)}}while(cursor);
 notifications.sort((a,b)=>b.createdAt-a.createdAt);
 return json({ok:true,notifications:notifications.slice(0,200)});
}