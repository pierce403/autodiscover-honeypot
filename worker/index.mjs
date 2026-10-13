import {Buffer} from 'node:buffer';import {timingSafeEqual} from 'node:crypto';import {home} from '../build/views.mjs';import {commit} from '../build/version.mjs';import {query} from './storage.mjs';
const text=(body,status=200,type='text/plain; charset=utf-8',extra={})=>new Response(body,{status,headers:{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',...extra}});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function authorized(request,secret){if(!secret)return false;const actual=request.headers.get('Authorization')||'',expected='Bearer '+secret;return actual.length===expected.length&&timingSafeEqual(Buffer.from(actual),Buffer.from(expected));}
async function values(request,url){const out=[...url.searchParams];if(request.method==='POST'&&request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded')){const reader=request.body?.getReader();let size=0;const chunks=[];if(reader)while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();throw new Error('too_large');}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}out.push(...new URLSearchParams(new TextDecoder().decode(bytes)));}const encoded=JSON.stringify(out);if(encoded.length>8000)throw new Error('too_large');return encoded;}
export default {async fetch(request,env){
 const url=new URL(request.url),path=url.pathname;if(url.protocol!=='https:'){url.protocol='https:';return Response.redirect(url.toString(),308);}if(request.method==='HEAD'){const r=await this.fetch(new Request(request,{method:'GET'}),{...env,READ_ONLY:'true'});await r.body?.cancel();return new Response(null,{status:r.status,headers:r.headers});}
 try{
  if(path==='/deployment.json')return text(JSON.stringify({repository:'pierce403/autodiscover-honeypot',commit,originalHerokuCommit:'a7955a81843c602143dd73f3259af9af1eb39e65',readOnly:env.READ_ONLY==='true'}),200,'application/json');
  if(path==='/'&&['GET','POST','OPTIONS'].includes(request.method))return text(home.replace('HELLO THERE','HELLO THERE'+(env.STAGING==='true'?'<p role="status">Synthetic staging only. Real credentials are never collected here.</p>':'')+(env.READ_ONLY==='true'?'<p role="status">Historical storage recovery is pending. Collection is disabled.</p>':'')),200,'text/html; charset=utf-8');
  if(path==='/autodiscover/autodiscover.xml'&&['GET','POST'].includes(request.method)){
   if(env.READ_ONLY!=='true'){
    const captured=await values(request,url);if(request.headers.has('Authorization')||captured!=='[]'){
     if(env.STAGING==='true'&&(request.headers.get('Authorization')!=='Basic c3ludGhldGljOmZpeHR1cmU='||!JSON.parse(captured).every(([k,v])=>['synthetic','fixture'].includes(k)&&['<fixture>','<script>','controlled','value','two'].includes(v))))return text('<UNAUTHORIZED>',401,'text/html; charset=utf-8',{'WWW-Authenticate':'Basic realm="Login Required"'});
     const selectedHeaders=env.STAGING==='true'?new Headers({Authorization:'Basic c3ludGhldGljOmZpeHR1cmU='}):request.headers;const headers=[...selectedHeaders].map(([k,v])=>k+': '+v+'\r\n').join('');if(headers.length>8000)return text('Request too large.',413);
     try{await query(env,'INSERT INTO interesting(domain,headers,"values",ctime) VALUES($1,$2,$3,CURRENT_TIMESTAMP)',[url.host,headers,captured]);}catch{return text('Existing collection storage is unavailable; no record was accepted.',503);}
    }
   }
   return text('<UNAUTHORIZED>',401,'text/html; charset=utf-8',{'WWW-Authenticate':'Basic realm="Login Required"'});
  }
  if(path==='/dump'&&request.method==='GET'){
   if(!authorized(request,env.ADMIN_TOKEN))return text('Owner authentication required.',401,undefined,{'WWW-Authenticate':'Bearer'});
   try{const rows=await query(env,'SELECT domain,headers,"values" FROM interesting ORDER BY ctime DESC,id DESC');return text('<pre>\n'+rows.map(r=>[r.domain,r.headers,r.values].map(escape).join('\n')).join('\n\n')+'\n</pre>',200,'text/html; charset=utf-8');}catch{return text('Historical collection storage is currently unavailable.',503);}
  }
  if(path.startsWith('/static/')||path==='/favicon.ico')return env.ASSETS.fetch(request);return text('Page not found.',404);
 }catch(error){return text(error.message==='too_large'?'Request too large.':'Unable to process request.',error.message==='too_large'?413:500);}
}};
