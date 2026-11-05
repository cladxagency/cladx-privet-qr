import {json} from '../../_lib.js';
export async function onRequestGet({env,params}){if(!env.QR_KV)return json({error:'Storage is unavailable'},503);const id=String(params.id||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);const item=await env.QR_KV.get('qr:'+id,'json');if(!item||item.active===false)return json({error:'This QR experience is unavailable'},404);return json({ok:true,item})}
