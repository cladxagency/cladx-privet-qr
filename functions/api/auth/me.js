import {json,authorized} from '../../_lib.js';
export async function onRequestGet({request,env}){return authorized(request,env)?json({ok:true,role:'admin'}):json({error:'Unauthorized'},401)}
