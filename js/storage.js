(function(){'use strict';
const prefs={get(key,fallback){try{return localStorage.getItem('sweety_splash_'+key)??fallback}catch(e){return fallback}},set(key,value){try{localStorage.setItem('sweety_splash_'+key,String(value))}catch(e){}}};
let connection;function db(){return connection??=new Promise((resolve,reject)=>{const r=indexedDB.open('sweety-splash',1);r.onupgradeneeded=()=>r.result.createObjectStore('works');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function load(){try{const d=await db();return await new Promise((resolve,reject)=>{const r=d.transaction('works').objectStore('works').get('latest');r.onsuccess=()=>resolve(r.result??null);r.onerror=()=>reject(r.error)})}catch(e){return null}}
async function save(blob,meta){const d=await db();await new Promise((resolve,reject)=>{const t=d.transaction('works','readwrite');t.objectStore('works').put({blob,...meta},'latest');t.oncomplete=resolve;t.onerror=()=>reject(t.error)})}
window.SplashStorage={prefs,load,save};
})();
