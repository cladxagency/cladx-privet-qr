import {json,authorized,readJson,safeRecord} from '../_lib.js';

const BACKUP_KEY='backup:latest';

export async function onRequestGet({request,env}){
  if(!await authorized(request,env))return json({error:'Unauthorized'},401);
  if(!env.QR_KV)return json({error:'KV binding QR_KV is missing'},503);
  const backup=await env.QR_KV.get(BACKUP_KEY,'json');
  if(!backup)return json({error:'No cloud backup found'},404);
  return json({ok:true,backup});
}

export async function onRequestPost({request,env}){
  if(!await authorized(request,env))return json({error:'Unauthorized'},401);
  if(!env.QR_KV)return json({error:'KV binding QR_KV is missing'},503);
  const body=await readJson(request);
  if(!body||!Array.isArray(body.items))return json({error:'Backup items are required'},400);
  if(body.items.length>5000)return json({error:'Backup contains too many records'},413);
  const items=[];
  for(const raw of body.items){
    const id=String(raw?.id||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);
    const item=safeRecord(raw,id);
    if(!id||!item)return json({error:'Backup contains an invalid QR record'},400);
    items.push(item);
  }
  for(const item of items)await env.QR_KV.put('qr:'+item.id,JSON.stringify(item));
  const backup={format:'cladx-privet-qr',version:2,createdAt:new Date().toISOString(),count:items.length,items};
  await env.QR_KV.put(BACKUP_KEY,JSON.stringify(backup));
  return json({ok:true,backup:{format:backup.format,version:backup.version,createdAt:backup.createdAt,count:backup.count},items});
}

export async function onRequestPut({request,env}){
  if(!await authorized(request,env))return json({error:'Unauthorized'},401);
  if(!env.QR_KV)return json({error:'KV binding QR_KV is missing'},503);
  const body=await readJson(request);
  if(!body||!Array.isArray(body.items))return json({error:'Restore items are required'},400);
  if(body.items.length>5000)return json({error:'Backup contains too many records'},413);
  const items=[];
  for(const raw of body.items){
    const id=String(raw?.id||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);
    const item=safeRecord(raw,id);
    if(!id||!item)return json({error:'Backup contains an invalid QR record'},400);
    items.push(item);
  }
  for(const item of items)await env.QR_KV.put('qr:'+item.id,JSON.stringify(item));
  const backup={format:'cladx-privet-qr',version:2,createdAt:new Date().toISOString(),count:items.length,items};
  await env.QR_KV.put(BACKUP_KEY,JSON.stringify(backup));
  return json({ok:true,items,count:items.length});
}


export async function onRequestDelete({request,env}){
  if(!await authorized(request,env))return json({error:'Unauthorized'},401);
  if(!env.QR_KV)return json({error:'KV binding QR_KV is missing'},503);
  await env.QR_KV.delete(BACKUP_KEY);
  return json({ok:true,deleted:'backup:latest'});
}
