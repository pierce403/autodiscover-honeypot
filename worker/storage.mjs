import pg from 'pg';
export async function query(env,sql,params=[]){
 if(env.STAGING==='true')return (await env.STAGING_DB.prepare(sql.replace(/\$[0-9]+/g,'?')).bind(...params).all()).results;
 if(!env.DATABASE_URL2)throw new Error('unavailable');const uri=new URL(env.DATABASE_URL2);if(!['postgres:','postgresql:'].includes(uri.protocol))throw new Error('unavailable');const client=new pg.Client({host:uri.hostname,port:Number(uri.port||5432),database:decodeURIComponent(uri.pathname.slice(1)),user:decodeURIComponent(uri.username),password:decodeURIComponent(uri.password),ssl:true,connectionTimeoutMillis:8000,query_timeout:8000});client.on('error',()=>{});
 try{await client.connect();return (await client.query(sql,params)).rows;}finally{await client.end().catch(()=>{});}
}
