import {json} from '../../_lib.js';
export async function onRequestGet({env,params}){
 if(!env.QR_KV)return json({error:'Storage is unavailable',state:'storage'},503);
 const id=String(params.id||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);
 const settings=await env.QR_KV.get('settings:public','json')||{theme:'dark',lang:'en'};
 const item=await env.QR_KV.get('qr:'+id,'json');
 if(!item)return json({error:'This QR code was deleted or does not exist',state:'deleted',settings},404);
 if(item.active===false)return json({error:'This QR code is temporarily disabled',state:'inactive',settings},410);
 return json({ok:true,item,settings});
}
