var am=Object.defineProperty;var Bm=(n,e,t)=>e in n?am(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var G=(n,e,t)=>Bm(n,typeof e!="symbol"?e+"":e,t);const um=()=>{};var Pl={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jf=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},cm=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],o=n[t++],B=n[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|B&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const i=n[t++],o=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},jf={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],o=s+1<n.length,B=o?n[s+1]:0,u=s+2<n.length,c=u?n[s+2]:0,h=i>>2,C=(i&3)<<4|B>>4;let p=(B&15)<<2|c>>6,w=c&63;u||(w=64,o||(p=64)),r.push(t[h],t[C],t[p],t[w])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Jf(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):cm(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],B=s<n.length?t[n.charAt(s)]:0;++s;const c=s<n.length?t[n.charAt(s)]:64;++s;const C=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||B==null||c==null||C==null)throw new lm;const p=i<<2|B>>4;if(r.push(p),c!==64){const w=B<<4&240|c>>2;if(r.push(w),C!==64){const A=c<<6&192|C;r.push(A)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class lm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const hm=function(n){const e=Jf(n);return jf.encodeByteArray(e,!0)},vo=function(n){return hm(n).replace(/\./g,"")},Kf=function(n){try{return jf.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cm=()=>fm().__FIREBASE_DEFAULTS__,dm=()=>{if(typeof process>"u"||typeof Pl>"u")return;const n=Pl.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},pm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Kf(n[1]);return e&&JSON.parse(e)},ta=()=>{try{return um()||Cm()||dm()||pm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},zf=n=>{var e,t;return(t=(e=ta())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Qf=n=>{const e=zf(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Wf=()=>{var n;return(n=ta())==null?void 0:n.config},$f=n=>{var e;return(e=ta())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xf(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[vo(JSON.stringify(t)),vo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $e(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function gm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test($e())}function mm(){var e;const n=(e=ta())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Em(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function su(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function _m(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Dm(){const n=$e();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function wm(){return!mm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function iu(){try{return typeof indexedDB=="object"}catch{return!1}}function ou(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}function Zf(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Im="FirebaseError";class Nt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Im,Object.setPrototypeOf(this,Nt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Sr.prototype.create)}}class Sr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?ym(i,r):"Error",B=`${this.serviceName}: ${o} (${s}).`;return new Nt(s,B,r)}}function ym(n,e){try{let t=0,r="";for(;t<n.length;){const s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}const i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}const o=n.substring(s+2,i),B=e[o];r+=n.substring(t,s)+(B!=null?String(B):`<${o}?>`),t=i+1}return r}catch{return n}}function Tm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Hn(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],o=e[s];if(bl(i)&&bl(o)){if(!Hn(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function bl(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ei(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ms(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Gs(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Am(n,e){const t=new Rm(n,e);return t.subscribe.bind(t)}class Rm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");vm(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=rB),s.error===void 0&&(s.error=rB),s.complete===void 0&&(s.complete=rB);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function vm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function rB(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pm=1e3,bm=2,Sm=14400*1e3,Om=.5;function Sl(n,e=Pm,t=bm){const r=e*Math.pow(t,n),s=Math.round(Om*r*(Math.random()-.5)*2);return Math.min(Sm,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function de(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Or(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function au(n){return(await fetch(n,{credentials:"include"})).ok}class bt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Yf;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Lm(e))try{this.getOrInitializeService({instanceIdentifier:cr})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=cr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=cr){return this.instances.has(e)}getOptions(e=cr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,o]of this.instancesDeferred.entries()){const B=this.normalizeInstanceIdentifier(i);r===B&&o.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Fm(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=cr){return this.component?this.component.multipleInstances?e:cr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Fm(n){return n===cr?void 0:n}function Lm(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class km{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Nm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ue;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ue||(ue={}));const xm={debug:ue.DEBUG,verbose:ue.VERBOSE,info:ue.INFO,warn:ue.WARN,error:ue.ERROR,silent:ue.SILENT},Vm=ue.INFO,Mm={[ue.DEBUG]:"log",[ue.VERBOSE]:"log",[ue.INFO]:"info",[ue.WARN]:"warn",[ue.ERROR]:"error"},Gm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Mm[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class na{constructor(e){this.name=e,this._logLevel=Vm,this._logHandler=Gm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ue))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?xm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ue.DEBUG,...e),this._logHandler(this,ue.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ue.VERBOSE,...e),this._logHandler(this,ue.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ue.INFO,...e),this._logHandler(this,ue.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ue.WARN,...e),this._logHandler(this,ue.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ue.ERROR,...e),this._logHandler(this,ue.ERROR,...e)}}const Um=(n,e)=>e.some(t=>n instanceof t);let Ol,Nl;function Hm(){return Ol||(Ol=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function qm(){return Nl||(Nl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const eC=new WeakMap,vB=new WeakMap,tC=new WeakMap,sB=new WeakMap,Bu=new WeakMap;function Jm(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",o)},i=()=>{t(xn(n.result)),s()},o=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&eC.set(t,n)}).catch(()=>{}),Bu.set(e,n),e}function jm(n){if(vB.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",o),n.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",o),n.addEventListener("abort",o)});vB.set(n,e)}let PB={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return vB.get(n);if(e==="objectStoreNames")return n.objectStoreNames||tC.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return xn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Km(n){PB=n(PB)}function zm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(iB(this),e,...t);return tC.set(r,e.sort?e.sort():[e]),xn(r)}:qm().includes(n)?function(...e){return n.apply(iB(this),e),xn(eC.get(this))}:function(...e){return xn(n.apply(iB(this),e))}}function Qm(n){return typeof n=="function"?zm(n):(n instanceof IDBTransaction&&jm(n),Um(n,Hm())?new Proxy(n,PB):n)}function xn(n){if(n instanceof IDBRequest)return Jm(n);if(sB.has(n))return sB.get(n);const e=Qm(n);return e!==n&&(sB.set(n,e),Bu.set(e,n)),e}const iB=n=>Bu.get(n);function nC(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(n,e),B=xn(o);return r&&o.addEventListener("upgradeneeded",u=>{r(xn(o.result),u.oldVersion,u.newVersion,xn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),B.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),B}const Wm=["get","getKey","getAll","getAllKeys","count"],$m=["put","add","delete","clear"],oB=new Map;function Fl(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(oB.get(e))return oB.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=$m.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Wm.includes(t)))return;const i=async function(o,...B){const u=this.transaction(o,s?"readwrite":"readonly");let c=u.store;return r&&(c=c.index(B.shift())),(await Promise.all([c[t](...B),s&&u.done]))[0]};return oB.set(e,i),i}Km(n=>({...n,get:(e,t,r)=>Fl(e,t)||n.get(e,t,r),has:(e,t)=>!!Fl(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ym{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Xm(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Xm(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const bB="@firebase/app",Ll="0.16.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fn=new na("@firebase/app"),Zm="@firebase/app-compat",eE="@firebase/analytics-compat",tE="@firebase/analytics",nE="@firebase/app-check-compat",rE="@firebase/app-check",sE="@firebase/auth",iE="@firebase/auth-compat",oE="@firebase/database",aE="@firebase/data-connect",BE="@firebase/database-compat",uE="@firebase/functions",cE="@firebase/functions-compat",lE="@firebase/installations",hE="@firebase/installations-compat",fE="@firebase/messaging",CE="@firebase/messaging-compat",dE="@firebase/performance",pE="@firebase/performance-compat",gE="@firebase/remote-config",mE="@firebase/remote-config-compat",EE="@firebase/storage",_E="@firebase/storage-compat",DE="@firebase/firestore",wE="@firebase/ai",IE="@firebase/firestore-compat",yE="firebase",TE="12.18.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SB="[DEFAULT]",AE={[bB]:"fire-core",[Zm]:"fire-core-compat",[tE]:"fire-analytics",[eE]:"fire-analytics-compat",[rE]:"fire-app-check",[nE]:"fire-app-check-compat",[sE]:"fire-auth",[iE]:"fire-auth-compat",[oE]:"fire-rtdb",[aE]:"fire-data-connect",[BE]:"fire-rtdb-compat",[uE]:"fire-fn",[cE]:"fire-fn-compat",[lE]:"fire-iid",[hE]:"fire-iid-compat",[fE]:"fire-fcm",[CE]:"fire-fcm-compat",[dE]:"fire-perf",[pE]:"fire-perf-compat",[gE]:"fire-rc",[mE]:"fire-rc-compat",[EE]:"fire-gcs",[_E]:"fire-gcs-compat",[DE]:"fire-fst",[IE]:"fire-fst-compat",[wE]:"fire-vertex","fire-js":"fire-js",[yE]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Po=new Map,RE=new Map,OB=new Map;function kl(n,e){try{n.container.addComponent(e)}catch(t){fn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function kt(n){const e=n.name;if(OB.has(e))return fn.debug(`There were multiple attempts to register component ${e}.`),!1;OB.set(e,n);for(const t of Po.values())kl(t,n);for(const t of RE.values())kl(t,n);return!0}function er(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function ht(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vE={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},rn=new Sr("app","Firebase",vE);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PE{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new bt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw rn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nr=TE;function bE(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:SB,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw rn.create("bad-app-name",{appName:String(s)});if(t||(t=Wf()),!t)throw rn.create("no-options");const i=Po.get(s);if(i)if(Hn(t,i.options)){if(Hn(r,i.config))return i;throw rn.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw rn.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const o=new km(s);for(const u of OB.values())o.addComponent(u);const B=new PE(t,r,o);return Po.set(s,B),B}function ra(n=SB){const e=Po.get(n);if(!e&&n===SB&&Wf())return bE();if(!e)throw rn.create("no-app",{appName:n});return e}function Ct(n,e,t){let r=AE[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${r}" with version "${e}":`];s&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),fn.warn(o.join(" "));return}kt(new bt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SE="firebase-heartbeat-database",OE=1,ti="firebase-heartbeat-store";let aB=null;function rC(){return aB||(aB=nC(SE,OE,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(ti)}catch(t){console.warn(t)}}}}).catch(n=>{throw rn.create("idb-open",{originalErrorMessage:n.message})})),aB}async function NE(n){try{const t=(await rC()).transaction(ti),r=await t.objectStore(ti).get(sC(n));return await t.done,r}catch(e){if(e instanceof Nt)fn.warn(e.message);else{const t=rn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});fn.warn(t.message)}}}async function xl(n,e){try{const r=(await rC()).transaction(ti,"readwrite");await r.objectStore(ti).put(e,sC(n)),await r.done}catch(t){if(t instanceof Nt)fn.warn(t.message);else{const r=rn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});fn.warn(r.message)}}}function sC(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FE=1024,LE=30;class kE{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new VE(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Vl();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>LE){const o=ME(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){fn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Vl(),{heartbeatsToSend:r,unsentEntries:s}=xE(this._heartbeatsCache.heartbeats),i=vo(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return fn.warn(t),""}}}function Vl(){return new Date().toISOString().substring(0,10)}function xE(n,e=FE){const t=[];let r=n.slice();for(const s of n){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Ml(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Ml(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class VE{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return iu()?ou().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await NE(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return xl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return xl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Ml(n){return vo(JSON.stringify({version:2,heartbeats:n})).length}function ME(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GE(n){kt(new bt("platform-logger",e=>new Ym(e),"PRIVATE")),kt(new bt("heartbeat",e=>new kE(e),"PRIVATE")),Ct(bB,Ll,n),Ct(bB,Ll,"esm2020"),Ct("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */GE("");function iC(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const UE=iC,oC=new Sr("auth","Firebase",iC());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bo=new na("@firebase/auth");function aC(n,...e){bo.logLevel<=ue.WARN&&bo.warn(`Auth (${Nr}): ${n}`,...e)}function go(n,...e){bo.logLevel<=ue.ERROR&&bo.error(`Auth (${Nr}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function St(n,...e){throw cu(n,...e)}function Lt(n,...e){return cu(n,...e)}function uu(n,e,t){const r={...UE(),[e]:t};return new Sr("auth","Firebase",r).create(e,{appName:n.name})}function un(n){return uu(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function HE(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&St(n,"argument-error"),uu(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function cu(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return oC.create(n,...e)}function te(n,e,...t){if(!n)throw cu(e,...t)}function sn(n){const e="INTERNAL ASSERTION FAILED: "+n;throw go(e),new Error(e)}function Cn(n,e){n||sn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NB(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function qE(){return Gl()==="http:"||Gl()==="https:"}function Gl(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JE(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(qE()||su()||"connection"in navigator)?navigator.onLine:!0}function jE(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i{constructor(e,t){this.shortDelay=e,this.longDelay=t,Cn(t>e,"Short delay should be less than long delay!"),this.isMobile=gm()||_m()}get(){return JE()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lu(n,e){Cn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BC{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;sn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;sn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;sn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KE={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zE=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],QE=new _i(3e4,6e4);function gn(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function Zt(n,e,t,r,s={}){return uC(n,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});const B=Ei({...o,key:n.config.apiKey}).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);const c={method:e,headers:u,...i};return Em()||(c.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&Or(n.emulatorConfig.host)&&(c.credentials="include"),BC.fetch()(await cC(n,n.config.apiHost,t,B),c)})}async function uC(n,e,t){n._canInitEmulator=!1;const r={...KE,...e};try{const s=new $E(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw no(n,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const B=i.ok?o.errorMessage:o.error.message,[u,c]=B.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw no(n,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw no(n,"email-already-in-use",o);if(u==="USER_DISABLED")throw no(n,"user-disabled",o);const h=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw uu(n,h,c);St(n,h)}}catch(s){if(s instanceof Nt)throw s;St(n,"network-request-failed",{message:String(s)})}}async function Di(n,e,t,r,s={}){const i=await Zt(n,e,t,r,s);return"mfaPendingCredential"in i&&St(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function cC(n,e,t,r){const s=`${e}${t}?${r}`,i=n,o=i.config.emulator?lu(n.config,s):`${n.config.apiScheme}://${s}`;return zE.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function WE(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class $E{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Lt(this.auth,"network-request-failed")),QE.get())})}}function no(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Lt(n,e,r);return s.customData._tokenResponse=t,s}function Ul(n){return n!==void 0&&n.enterprise!==void 0}class YE{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return WE(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function XE(n,e){return Zt(n,"GET","/v2/recaptchaConfig",gn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ZE(n,e){return Zt(n,"POST","/v1/accounts:delete",e)}async function So(n,e){return Zt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function js(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function e_(n,e=!1){const t=de(n),r=await t.getIdToken(e),s=hu(r);te(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:js(BB(s.auth_time)),issuedAtTime:js(BB(s.iat)),expirationTime:js(BB(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function BB(n){return Number(n)*1e3}function hu(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return go("JWT malformed, contained fewer than 3 sections"),null;try{const s=Kf(t);return s?JSON.parse(s):(go("Failed to decode base64 JWT payload"),null)}catch(s){return go("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Hl(n){const e=hu(n);return te(e,"internal-error"),te(typeof e.exp<"u","internal-error"),te(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ts(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Nt&&t_(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function t_({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n_{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FB{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=js(this.lastLoginAt),this.creationTime=js(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oo(n){var C;const e=n.auth,t=await n.getIdToken(),r=await ts(n,So(e,{idToken:t}));te(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const i=(C=s.providerUserInfo)!=null&&C.length?lC(s.providerUserInfo):[],o=s_(n.providerData,i),B=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!(o!=null&&o.length),c=B?u:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new FB(s.createdAt,s.lastLoginAt),isAnonymous:c};Object.assign(n,h)}async function r_(n){const e=de(n);await Oo(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function s_(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function lC(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function i_(n,e){const t=await uC(n,{},async()=>{const r=Ei({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,o=await cC(n,s,"/v1/token",`key=${i}`),B=await n._getAdditionalHeaders();B["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:B,body:r};return n.emulatorConfig&&Or(n.emulatorConfig.host)&&(u.credentials="include"),BC.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function o_(n,e){return Zt(n,"POST","/v2/accounts:revokeToken",gn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){te(e.idToken,"internal-error"),te(typeof e.idToken<"u","internal-error"),te(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Hl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){te(e.length!==0,"internal-error");const t=Hl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(te(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await i_(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,o=new $r;return r&&(te(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(te(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(te(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new $r,this.toJSON())}_performRefresh(){return sn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tn(n,e){te(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Ft{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new n_(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new FB(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await ts(this,this.stsTokenManager.getToken(this.auth,e));return te(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return e_(this,e)}reload(){return r_(this)}_assign(e){this!==e&&(te(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ft({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){te(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Oo(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ht(this.auth.app))return Promise.reject(un(this.auth));const e=await this.getIdToken();return await ts(this,ZE(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,B=t.tenantId??void 0,u=t._redirectEventId??void 0,c=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:C,emailVerified:p,isAnonymous:w,providerData:A,stsTokenManager:L}=t;te(C&&L,e,"internal-error");const M=$r.fromJSON(this.name,L);te(typeof C=="string",e,"internal-error"),Tn(r,e.name),Tn(s,e.name),te(typeof p=="boolean",e,"internal-error"),te(typeof w=="boolean",e,"internal-error"),Tn(i,e.name),Tn(o,e.name),Tn(B,e.name),Tn(u,e.name),Tn(c,e.name),Tn(h,e.name);const j=new Ft({uid:C,auth:e,email:s,emailVerified:p,displayName:r,isAnonymous:w,photoURL:o,phoneNumber:i,tenantId:B,stsTokenManager:M,createdAt:c,lastLoginAt:h});return A&&Array.isArray(A)&&(j.providerData=A.map(ee=>({...ee}))),u&&(j._redirectEventId=u),j}static async _fromIdTokenResponse(e,t,r=!1){const s=new $r;s.updateFromServerResponse(t);const i=new Ft({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Oo(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];te(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?lC(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),B=new $r;B.updateFromIdToken(r);const u=new Ft({uid:s.localId,auth:e,stsTokenManager:B,isAnonymous:o}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new FB(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ql=new Map;function on(n){Cn(n instanceof Function,"Expected a class definition");let e=ql.get(n);return e?(Cn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,ql.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hC{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}hC.type="NONE";const Jl=hC;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mo(n,e,t){return`firebase:${n}:${e}:${t}`}class Yr{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=mo(this.userKey,s.apiKey,i),this.fullPersistenceKey=mo("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await So(this.auth,{idToken:e}).catch(()=>{});return t?Ft._fromGetAccountInfoResponse(this.auth,t,e):null}return Ft._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Yr(on(Jl),e,r);const s=(await Promise.all(t.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let i=s[0]||on(Jl);const o=mo(r,e.config.apiKey,e.name);let B=null;for(const c of t)try{const h=await c._get(o);if(h){let C;if(typeof h=="string"){const p=await So(e,{idToken:h}).catch(()=>{});if(!p)break;C=await Ft._fromGetAccountInfoResponse(e,p,h)}else C=Ft._fromJSON(e,h);c!==i&&(B=C),i=c;break}}catch{}const u=s.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Yr(i,e,r):(i=u[0],B&&await i._set(o,B.toJSON()),await Promise.all(t.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new Yr(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jl(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(pC(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(fC(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(mC(e))return"Blackberry";if(EC(e))return"Webos";if(CC(e))return"Safari";if((e.includes("chrome/")||dC(e))&&!e.includes("edge/"))return"Chrome";if(gC(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function fC(n=$e()){return/firefox\//i.test(n)}function CC(n=$e()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function dC(n=$e()){return/crios\//i.test(n)}function pC(n=$e()){return/iemobile/i.test(n)}function gC(n=$e()){return/android/i.test(n)}function mC(n=$e()){return/blackberry/i.test(n)}function EC(n=$e()){return/webos/i.test(n)}function fu(n=$e()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function a_(n=$e()){var e;return fu(n)&&!!((e=window.navigator)!=null&&e.standalone)}function B_(){return Dm()&&document.documentMode===10}function _C(n=$e()){return fu(n)||gC(n)||EC(n)||mC(n)||/windows phone/i.test(n)||pC(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DC(n,e=[]){let t;switch(n){case"Browser":t=jl($e());break;case"Worker":t=`${jl($e())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Nr}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((o,B)=>{try{const u=e(i);o(u)}catch(u){B(u)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function c_(n,e={}){return Zt(n,"GET","/v2/passwordPolicy",gn(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const l_=6;class h_{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??l_,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Kl(this),this.idTokenSubscription=new Kl(this),this.beforeStateQueue=new u_(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=oC,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=on(t)),this._initializationPromise=this.queue(async()=>{var r,s,i;if(!this._deleted&&(this.persistenceManager=await Yr.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await So(this,{idToken:e}),r=await Ft._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(ht(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(B=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(B,B))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,B=r==null?void 0:r._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===B)&&(u!=null&&u.user)&&(r=u.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return te(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Oo(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=jE()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ht(this.app))return Promise.reject(un(this));const t=e?de(e):null;return t&&te(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&te(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ht(this.app)?Promise.reject(un(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ht(this.app)?Promise.reject(un(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(on(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await c_(this),t=new h_(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Sr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await o_(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&on(e)||this._popupRedirectResolver;te(t,this,"argument-error"),this.redirectPersistenceManager=await Yr.create(this,[on(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const B=this._isInitialized?Promise.resolve():this._initializationPromise;if(te(B,this,"internal-error"),B.then(()=>{o||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,r,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return te(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=DC(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(ht(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&aC(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function mn(n){return de(n)}class Kl{constructor(e){this.auth=e,this.observer=null,this.addObserver=Am(t=>this.observer=t)}get next(){return te(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function C_(n){sa=n}function wC(n){return sa.loadJS(n)}function d_(){return sa.recaptchaEnterpriseScript}function p_(){return sa.gapiScript}function g_(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class m_{constructor(){this.enterprise=new E_}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class E_{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const __="recaptcha-enterprise",IC="NO_RECAPTCHA",zl="onFirebaseAuthREInstanceReady";class Pn{constructor(e){this.type=__,this.auth=mn(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,B)=>{XE(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)B(new Error("recaptcha Enterprise site key undefined"));else{const c=new YE(u);return i.tenantId==null?i._agentRecaptchaConfig=c:i._tenantRecaptchaConfigs[i.tenantId]=c,o(c.siteKey)}}).catch(u=>{B(u)})})}function s(i,o,B){const u=window.grecaptcha;Ul(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(c=>{o(c)}).catch(()=>{o(IC)})}):B(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new m_().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{r(this.auth).then(async B=>{if(!t&&Ul(window.grecaptcha)&&Pn.scriptInjectionDeferred)await Pn.scriptInjectionDeferred.promise,s(B,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=d_();u.length!==0&&(u+=B+`&onload=${zl}`),Pn.scriptInjectionDeferred=new Yf,window[zl]=()=>{var c;(c=Pn.scriptInjectionDeferred)==null||c.resolve()},wC(u).then(()=>{var c;return(c=Pn.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{s(B,i,o)}).catch(c=>{o(c)})}}).catch(B=>{o(B)})})}}Pn.scriptInjectionDeferred=null;async function Ql(n,e,t,r=!1,s=!1){const i=new Pn(n);let o;if(s)o=IC;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}const B={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in B){const u=B.phoneEnrollmentInfo.phoneNumber,c=B.phoneEnrollmentInfo.recaptchaToken;Object.assign(B,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in B){const u=B.phoneSignInInfo.recaptchaToken;Object.assign(B,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return B}return r?Object.assign(B,{captchaResp:o}):Object.assign(B,{captchaResponse:o}),Object.assign(B,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(B,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),B}async function No(n,e,t,r,s){var i;if((i=n._getRecaptchaConfig())!=null&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await Ql(n,e,t,t==="getOobCode");return r(n,o)}else return r(n,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const B=await Ql(n,e,t,t==="getOobCode");return r(n,B)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D_(n,e){const t=er(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Hn(i,e??{}))return s;St(s,"already-initialized")}return t.initialize({options:e})}function w_(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(on);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function I_(n,e,t){const r=mn(n);te(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=yC(e),{host:o,port:B}=y_(e),u=B===null?"":`:${B}`,c={url:`${i}//${o}${u}/`},h=Object.freeze({host:o,port:B,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){te(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),te(Hn(c,r.config.emulator)&&Hn(h,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=h,r.settings.appVerificationDisabledForTesting=!0,Or(o)?au(`${i}//${o}${u}`):T_()}function yC(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function y_(n){const e=yC(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:Wl(r.substr(i.length+1))}}else{const[i,o]=r.split(":");return{host:i,port:Wl(o)}}}function Wl(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function T_(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return sn("not implemented")}_getIdTokenResponse(e){return sn("not implemented")}_linkToIdToken(e,t){return sn("not implemented")}_getReauthenticationResolver(e){return sn("not implemented")}}async function A_(n,e){return Zt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function R_(n,e){return Di(n,"POST","/v1/accounts:signInWithPassword",gn(n,e))}async function v_(n,e){return Zt(n,"POST","/v1/accounts:sendOobCode",gn(n,e))}async function P_(n,e){return v_(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function b_(n,e){return Di(n,"POST","/v1/accounts:signInWithEmailLink",gn(n,e))}async function S_(n,e){return Di(n,"POST","/v1/accounts:signInWithEmailLink",gn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni extends Cu{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new ni(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new ni(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return No(e,t,"signInWithPassword",R_);case"emailLink":return b_(e,{email:this._email,oobCode:this._password});default:St(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return No(e,r,"signUpPassword",A_);case"emailLink":return S_(e,{idToken:t,email:this._email,oobCode:this._password});default:St(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xr(n,e){return Di(n,"POST","/v1/accounts:signInWithIdp",gn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O_="http://localhost";class Ir extends Cu{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ir(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):St("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;const o=new Ir(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Xr(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Xr(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Xr(e,t)}buildRequest(){const e={requestUri:O_,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ei(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N_(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function F_(n){const e=Ms(Gs(n)).link,t=e?Ms(Gs(e)).deep_link_id:null,r=Ms(Gs(n)).deep_link_id;return(r?Ms(Gs(r)).link:null)||r||t||e||n}class du{constructor(e){const t=Ms(Gs(e)),r=t.apiKey??null,s=t.oobCode??null,i=N_(t.mode??null);te(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=F_(e);try{return new du(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us{constructor(){this.providerId=us.PROVIDER_ID}static credential(e,t){return ni._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=du.parseLink(t);return te(r,"argument-error"),ni._fromEmailAndCode(e,r.code,r.tenantId)}}us.PROVIDER_ID="password";us.EMAIL_PASSWORD_SIGN_IN_METHOD="password";us.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pu{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi extends pu{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn extends wi{constructor(){super("facebook.com")}static credential(e){return Ir._fromParams({providerId:bn.PROVIDER_ID,signInMethod:bn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return bn.credentialFromTaggedObject(e)}static credentialFromError(e){return bn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return bn.credential(e.oauthAccessToken)}catch{return null}}}bn.FACEBOOK_SIGN_IN_METHOD="facebook.com";bn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn extends wi{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ir._fromParams({providerId:Sn.PROVIDER_ID,signInMethod:Sn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Sn.credentialFromTaggedObject(e)}static credentialFromError(e){return Sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Sn.credential(t,r)}catch{return null}}}Sn.GOOGLE_SIGN_IN_METHOD="google.com";Sn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On extends wi{constructor(){super("github.com")}static credential(e){return Ir._fromParams({providerId:On.PROVIDER_ID,signInMethod:On.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return On.credentialFromTaggedObject(e)}static credentialFromError(e){return On.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return On.credential(e.oauthAccessToken)}catch{return null}}}On.GITHUB_SIGN_IN_METHOD="github.com";On.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn extends wi{constructor(){super("twitter.com")}static credential(e,t){return Ir._fromParams({providerId:Nn.PROVIDER_ID,signInMethod:Nn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Nn.credentialFromTaggedObject(e)}static credentialFromError(e){return Nn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Nn.credential(t,r)}catch{return null}}}Nn.TWITTER_SIGN_IN_METHOD="twitter.com";Nn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function L_(n,e){return Di(n,"POST","/v1/accounts:signUp",gn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await Ft._fromIdTokenResponse(e,r,s),o=$l(r);return new yr({user:i,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=$l(r);return new yr({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function $l(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo extends Nt{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Fo.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Fo(e,t,r,s)}}function TC(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Fo._fromErrorAndOperation(n,i,e,r):i})}async function k_(n,e,t=!1){const r=await ts(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return yr._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function x_(n,e,t=!1){const{auth:r}=n;if(ht(r.app))return Promise.reject(un(r));const s="reauthenticate";try{const i=await ts(n,TC(r,s,e,n),t);te(i.idToken,r,"internal-error");const o=hu(i.idToken);te(o,r,"internal-error");const{sub:B}=o;return te(n.uid===B,r,"user-mismatch"),yr._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&St(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function AC(n,e,t=!1){if(ht(n.app))return Promise.reject(un(n));const r="signIn",s=await TC(n,r,e),i=await yr._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function V_(n,e){return AC(mn(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function RC(n){const e=mn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function eb(n,e,t){const r=mn(n);await No(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",P_)}async function tb(n,e,t){if(ht(n.app))return Promise.reject(un(n));const r=mn(n),o=await No(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",L_).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&RC(n),u}),B=await yr._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(B.user),B}function nb(n,e,t){return ht(n.app)?Promise.reject(un(n)):V_(de(n),us.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&RC(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function M_(n,e){return Zt(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rb(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=de(n),i={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await ts(r,M_(r.auth,i));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const B=r.providerData.find(({providerId:u})=>u==="password");B&&(B.displayName=r.displayName,B.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function G_(n,e,t,r){return de(n).onIdTokenChanged(e,t,r)}function U_(n,e,t){return de(n).beforeAuthStateChanged(e,t)}function sb(n,e,t,r){return de(n).onAuthStateChanged(e,t,r)}function ib(n){return de(n).signOut()}const Lo="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vC{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Lo,"1"),this.storage.removeItem(Lo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H_=1e3,q_=10;class PC extends vC{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=_C(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,B,u)=>{this.notifyListeners(o,u)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);B_()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,q_):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},H_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}PC.type="LOCAL";const J_=PC;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bC extends vC{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}bC.type="SESSION";const SC=bC;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j_(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new ia(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const B=Array.from(o).map(async c=>c(t.origin,i)),u=await j_(B);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ia.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gu(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((B,u)=>{const c=gu("",20);s.port1.start();const h=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(C){const p=C;if(p.data.eventId===c)switch(p.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),B(p.data.response);break;default:clearTimeout(h),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(){return window}function z_(n){Kt().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OC(){return typeof Kt().WorkerGlobalScope<"u"&&typeof Kt().importScripts=="function"}async function Q_(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function W_(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function $_(){return OC()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NC="firebaseLocalStorageDb",Y_=1,ko="firebaseLocalStorage",FC="fbase_key";class Ii{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function oa(n,e){return n.transaction([ko],e?"readwrite":"readonly").objectStore(ko)}function X_(){const n=indexedDB.deleteDatabase(NC);return new Ii(n).toPromise()}function LC(){const n=indexedDB.open(NC,Y_);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(ko,{keyPath:FC})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(ko)?e(r):(r.close(),await X_(),e(await LC()))})})}async function Yl(n,e,t){const r=oa(n,!0).put({[FC]:e,value:t});return new Ii(r).toPromise()}async function Z_(n,e){const t=oa(n,!1).get(e),r=await new Ii(t).toPromise();return r===void 0?null:r.value}function Xl(n,e){const t=oa(n,!0).delete(e);return new Ii(t).toPromise()}const eD=800,tD=3;class kC{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=LC(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||t++>tD)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return OC()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ia._getInstance($_()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await Q_(),!this.activeServiceWorker)return;this.sender=new K_(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||W_()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Yl(e,Lo,"1"),await Xl(e,Lo)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Yl(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Z_(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Xl(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(s=>{const i=oa(s,!1).getAll();return new Ii(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||aC(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),eD)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}kC.type="LOCAL";const nD=kC;new _i(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xC(n,e){return e?on(e):(te(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mu extends Cu{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Xr(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Xr(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Xr(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function rD(n){return AC(n.auth,new mu(n),n.bypassAuthState)}function sD(n){const{auth:e,user:t}=n;return te(t,e,"internal-error"),x_(t,new mu(n),n.bypassAuthState)}async function iD(n){const{auth:e,user:t}=n;return te(t,e,"internal-error"),k_(t,new mu(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VC{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:o,type:B}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(B)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return rD;case"linkViaPopup":case"linkViaRedirect":return iD;case"reauthViaPopup":case"reauthViaRedirect":return sD;default:St(this.auth,"internal-error")}}resolve(e){Cn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Cn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oD=new _i(2e3,1e4);async function ob(n,e,t){if(ht(n.app))return Promise.reject(Lt(n,"operation-not-supported-in-this-environment"));const r=mn(n);HE(n,e,pu);const s=xC(r,t);return new fr(r,"signInViaPopup",e,s).executeNotNull()}class fr extends VC{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,fr.currentPopupAction&&fr.currentPopupAction.cancel(),fr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return te(e,this.auth,"internal-error"),e}async onExecution(){Cn(this.filter.length===1,"Popup operations only handle one event");const e=gu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Lt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Lt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,fr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Lt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,oD.get())};e()}}fr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aD="pendingRedirect",Eo=new Map;class BD extends VC{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Eo.get(this.auth._key());if(!e){try{const r=await uD(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Eo.set(this.auth._key(),e)}return this.bypassAuthState||Eo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function uD(n,e){const t=hD(e),r=lD(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function cD(n,e){Eo.set(n._key(),e)}function lD(n){return on(n._redirectPersistence)}function hD(n){return mo(aD,n.config.apiKey,n.name)}async function fD(n,e,t=!1){if(ht(n.app))return Promise.reject(un(n));const r=mn(n),s=xC(r,e),o=await new BD(r,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CD=600*1e3;class dD{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!pD(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!MC(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(Lt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=CD&&this.cachedEventUids.clear(),this.cachedEventUids.has(Zl(e))}saveEventToCache(e){this.cachedEventUids.add(Zl(e)),this.lastProcessedEventTime=Date.now()}}function Zl(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function MC({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function pD(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return MC(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gD(n,e={}){return Zt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mD=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ED=/^https?/;async function _D(n){if(n.config.emulator)return;const{authorizedDomains:e}=await gD(n);for(const t of e)try{if(DD(t))return}catch{}St(n,"unauthorized-domain")}function DD(n){const e=NB(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!ED.test(t))return!1;if(mD.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wD=new _i(3e4,6e4);function eh(){const n=Kt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function ID(n){return new Promise((e,t)=>{var s,i,o;function r(){eh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{eh(),t(Lt(n,"network-request-failed"))},timeout:wD.get()})}if((i=(s=Kt().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=Kt().gapi)!=null&&o.load)r();else{const B=g_("iframefcb");return Kt()[B]=()=>{gapi.load?r():t(Lt(n,"network-request-failed"))},wC(`${p_()}?onload=${B}`).catch(u=>t(u))}}).catch(e=>{throw _o=null,e})}let _o=null;function yD(n){return _o=_o||ID(n),_o}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TD=new _i(5e3,15e3),AD="__/auth/iframe",RD="emulator/auth/iframe",vD={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},PD=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function bD(n){const e=n.config;te(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?lu(e,RD):`https://${n.config.authDomain}/${AD}`,r={apiKey:e.apiKey,appName:n.name,v:Nr},s=PD.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${Ei(r).slice(1)}`}async function SD(n){const e=await yD(n),t=Kt().gapi;return te(t,n,"internal-error"),e.open({where:document.body,url:bD(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:vD,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const o=Lt(n,"network-request-failed"),B=Kt().setTimeout(()=>{i(o)},TD.get());function u(){Kt().clearTimeout(B),s(r)}r.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OD={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},ND=500,FD=600,LD="_blank",kD="http://localhost";class th{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function xD(n,e,t,r=ND,s=FD){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let B="";const u={...OD,width:r.toString(),height:s.toString(),top:i,left:o},c=$e().toLowerCase();t&&(B=dC(c)?LD:t),fC(c)&&(e=e||kD,u.scrollbars="yes");const h=Object.entries(u).reduce((p,[w,A])=>`${p}${w}=${A},`,"");if(a_(c)&&B!=="_self")return VD(e||"",B),new th(null);const C=window.open(e||"",B,h);te(C,n,"popup-blocked");try{C.focus()}catch{}return new th(C)}function VD(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MD="__/auth/handler",GD="emulator/auth/handler",UD=encodeURIComponent("fac");async function nh(n,e,t,r,s,i){te(n.config.authDomain,n,"auth-domain-config-required"),te(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Nr,eventId:s};if(e instanceof pu){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Tm(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,C]of Object.entries({}))o[h]=C}if(e instanceof wi){const h=e.getScopes().filter(C=>C!=="");h.length>0&&(o.scopes=h.join(","))}n.tenantId&&(o.tid=n.tenantId);const B=o;for(const h of Object.keys(B))B[h]===void 0&&delete B[h];const u=await n._getAppCheckToken(),c=u?`#${UD}=${encodeURIComponent(u)}`:"";return`${HD(n)}?${Ei(B).slice(1)}${c}`}function HD({config:n}){return n.emulator?lu(n,GD):`https://${n.authDomain}/${MD}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uB="webStorageSupport";class qD{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=SC,this._completeRedirectFn=fD,this._overrideRedirectResult=cD}async _openPopup(e,t,r,s){var o;Cn((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await nh(e,t,r,NB(),s);return xD(e,i,gu())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await nh(e,t,r,NB(),s);return z_(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(Cn(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await SD(e),r=new dD(e);return t.register("authEvent",s=>(te(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(uB,{type:uB},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[uB];i!==void 0&&t(!!i),St(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=_D(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _C()||CC()||fu()}}const JD=qD;var rh="@firebase/auth",sh="1.13.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jD{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){te(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KD(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function zD(n){kt(new bt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:B}=r.options;te(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:B,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:DC(n)},c=new f_(r,s,i,u);return w_(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),kt(new bt("auth-internal",e=>{const t=mn(e.getProvider("auth").getImmediate());return(r=>new jD(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ct(rh,sh,KD(n)),Ct(rh,sh,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QD=300,WD=$f("authIdTokenMaxAge")||QD;let ih=null;const $D=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>WD)return;const s=t==null?void 0:t.token;ih!==s&&(ih=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function ab(n=ra()){const e=er(n,"auth");if(e.isInitialized())return e.getImmediate();const t=D_(n,{popupRedirectResolver:JD,persistence:[nD,J_,SC]}),r=$f("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const o=$D(i.toString());U_(t,o,()=>o(t.currentUser)),G_(t,B=>o(B))}}const s=zf("auth");return s&&I_(t,`http://${s}`),t}function YD(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}C_({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=Lt("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",YD().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});zD("Browser");var XD="firebase",ZD="12.18.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ct(XD,ZD,"app");var oh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Vn,GC;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(R,E){function D(){}D.prototype=E.prototype,R.F=E.prototype,R.prototype=new D,R.prototype.constructor=R,R.D=function(v,T,b){for(var _=Array(arguments.length-2),at=2;at<arguments.length;at++)_[at-2]=arguments[at];return E.prototype[T].apply(v,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(R,E,D){D||(D=0);const v=Array(16);if(typeof E=="string")for(var T=0;T<16;++T)v[T]=E.charCodeAt(D++)|E.charCodeAt(D++)<<8|E.charCodeAt(D++)<<16|E.charCodeAt(D++)<<24;else for(T=0;T<16;++T)v[T]=E[D++]|E[D++]<<8|E[D++]<<16|E[D++]<<24;E=R.g[0],D=R.g[1],T=R.g[2];let b=R.g[3],_;_=E+(b^D&(T^b))+v[0]+3614090360&4294967295,E=D+(_<<7&4294967295|_>>>25),_=b+(T^E&(D^T))+v[1]+3905402710&4294967295,b=E+(_<<12&4294967295|_>>>20),_=T+(D^b&(E^D))+v[2]+606105819&4294967295,T=b+(_<<17&4294967295|_>>>15),_=D+(E^T&(b^E))+v[3]+3250441966&4294967295,D=T+(_<<22&4294967295|_>>>10),_=E+(b^D&(T^b))+v[4]+4118548399&4294967295,E=D+(_<<7&4294967295|_>>>25),_=b+(T^E&(D^T))+v[5]+1200080426&4294967295,b=E+(_<<12&4294967295|_>>>20),_=T+(D^b&(E^D))+v[6]+2821735955&4294967295,T=b+(_<<17&4294967295|_>>>15),_=D+(E^T&(b^E))+v[7]+4249261313&4294967295,D=T+(_<<22&4294967295|_>>>10),_=E+(b^D&(T^b))+v[8]+1770035416&4294967295,E=D+(_<<7&4294967295|_>>>25),_=b+(T^E&(D^T))+v[9]+2336552879&4294967295,b=E+(_<<12&4294967295|_>>>20),_=T+(D^b&(E^D))+v[10]+4294925233&4294967295,T=b+(_<<17&4294967295|_>>>15),_=D+(E^T&(b^E))+v[11]+2304563134&4294967295,D=T+(_<<22&4294967295|_>>>10),_=E+(b^D&(T^b))+v[12]+1804603682&4294967295,E=D+(_<<7&4294967295|_>>>25),_=b+(T^E&(D^T))+v[13]+4254626195&4294967295,b=E+(_<<12&4294967295|_>>>20),_=T+(D^b&(E^D))+v[14]+2792965006&4294967295,T=b+(_<<17&4294967295|_>>>15),_=D+(E^T&(b^E))+v[15]+1236535329&4294967295,D=T+(_<<22&4294967295|_>>>10),_=E+(T^b&(D^T))+v[1]+4129170786&4294967295,E=D+(_<<5&4294967295|_>>>27),_=b+(D^T&(E^D))+v[6]+3225465664&4294967295,b=E+(_<<9&4294967295|_>>>23),_=T+(E^D&(b^E))+v[11]+643717713&4294967295,T=b+(_<<14&4294967295|_>>>18),_=D+(b^E&(T^b))+v[0]+3921069994&4294967295,D=T+(_<<20&4294967295|_>>>12),_=E+(T^b&(D^T))+v[5]+3593408605&4294967295,E=D+(_<<5&4294967295|_>>>27),_=b+(D^T&(E^D))+v[10]+38016083&4294967295,b=E+(_<<9&4294967295|_>>>23),_=T+(E^D&(b^E))+v[15]+3634488961&4294967295,T=b+(_<<14&4294967295|_>>>18),_=D+(b^E&(T^b))+v[4]+3889429448&4294967295,D=T+(_<<20&4294967295|_>>>12),_=E+(T^b&(D^T))+v[9]+568446438&4294967295,E=D+(_<<5&4294967295|_>>>27),_=b+(D^T&(E^D))+v[14]+3275163606&4294967295,b=E+(_<<9&4294967295|_>>>23),_=T+(E^D&(b^E))+v[3]+4107603335&4294967295,T=b+(_<<14&4294967295|_>>>18),_=D+(b^E&(T^b))+v[8]+1163531501&4294967295,D=T+(_<<20&4294967295|_>>>12),_=E+(T^b&(D^T))+v[13]+2850285829&4294967295,E=D+(_<<5&4294967295|_>>>27),_=b+(D^T&(E^D))+v[2]+4243563512&4294967295,b=E+(_<<9&4294967295|_>>>23),_=T+(E^D&(b^E))+v[7]+1735328473&4294967295,T=b+(_<<14&4294967295|_>>>18),_=D+(b^E&(T^b))+v[12]+2368359562&4294967295,D=T+(_<<20&4294967295|_>>>12),_=E+(D^T^b)+v[5]+4294588738&4294967295,E=D+(_<<4&4294967295|_>>>28),_=b+(E^D^T)+v[8]+2272392833&4294967295,b=E+(_<<11&4294967295|_>>>21),_=T+(b^E^D)+v[11]+1839030562&4294967295,T=b+(_<<16&4294967295|_>>>16),_=D+(T^b^E)+v[14]+4259657740&4294967295,D=T+(_<<23&4294967295|_>>>9),_=E+(D^T^b)+v[1]+2763975236&4294967295,E=D+(_<<4&4294967295|_>>>28),_=b+(E^D^T)+v[4]+1272893353&4294967295,b=E+(_<<11&4294967295|_>>>21),_=T+(b^E^D)+v[7]+4139469664&4294967295,T=b+(_<<16&4294967295|_>>>16),_=D+(T^b^E)+v[10]+3200236656&4294967295,D=T+(_<<23&4294967295|_>>>9),_=E+(D^T^b)+v[13]+681279174&4294967295,E=D+(_<<4&4294967295|_>>>28),_=b+(E^D^T)+v[0]+3936430074&4294967295,b=E+(_<<11&4294967295|_>>>21),_=T+(b^E^D)+v[3]+3572445317&4294967295,T=b+(_<<16&4294967295|_>>>16),_=D+(T^b^E)+v[6]+76029189&4294967295,D=T+(_<<23&4294967295|_>>>9),_=E+(D^T^b)+v[9]+3654602809&4294967295,E=D+(_<<4&4294967295|_>>>28),_=b+(E^D^T)+v[12]+3873151461&4294967295,b=E+(_<<11&4294967295|_>>>21),_=T+(b^E^D)+v[15]+530742520&4294967295,T=b+(_<<16&4294967295|_>>>16),_=D+(T^b^E)+v[2]+3299628645&4294967295,D=T+(_<<23&4294967295|_>>>9),_=E+(T^(D|~b))+v[0]+4096336452&4294967295,E=D+(_<<6&4294967295|_>>>26),_=b+(D^(E|~T))+v[7]+1126891415&4294967295,b=E+(_<<10&4294967295|_>>>22),_=T+(E^(b|~D))+v[14]+2878612391&4294967295,T=b+(_<<15&4294967295|_>>>17),_=D+(b^(T|~E))+v[5]+4237533241&4294967295,D=T+(_<<21&4294967295|_>>>11),_=E+(T^(D|~b))+v[12]+1700485571&4294967295,E=D+(_<<6&4294967295|_>>>26),_=b+(D^(E|~T))+v[3]+2399980690&4294967295,b=E+(_<<10&4294967295|_>>>22),_=T+(E^(b|~D))+v[10]+4293915773&4294967295,T=b+(_<<15&4294967295|_>>>17),_=D+(b^(T|~E))+v[1]+2240044497&4294967295,D=T+(_<<21&4294967295|_>>>11),_=E+(T^(D|~b))+v[8]+1873313359&4294967295,E=D+(_<<6&4294967295|_>>>26),_=b+(D^(E|~T))+v[15]+4264355552&4294967295,b=E+(_<<10&4294967295|_>>>22),_=T+(E^(b|~D))+v[6]+2734768916&4294967295,T=b+(_<<15&4294967295|_>>>17),_=D+(b^(T|~E))+v[13]+1309151649&4294967295,D=T+(_<<21&4294967295|_>>>11),_=E+(T^(D|~b))+v[4]+4149444226&4294967295,E=D+(_<<6&4294967295|_>>>26),_=b+(D^(E|~T))+v[11]+3174756917&4294967295,b=E+(_<<10&4294967295|_>>>22),_=T+(E^(b|~D))+v[2]+718787259&4294967295,T=b+(_<<15&4294967295|_>>>17),_=D+(b^(T|~E))+v[9]+3951481745&4294967295,R.g[0]=R.g[0]+E&4294967295,R.g[1]=R.g[1]+(T+(_<<21&4294967295|_>>>11))&4294967295,R.g[2]=R.g[2]+T&4294967295,R.g[3]=R.g[3]+b&4294967295}r.prototype.v=function(R,E){E===void 0&&(E=R.length);const D=E-this.blockSize,v=this.C;let T=this.h,b=0;for(;b<E;){if(T==0)for(;b<=D;)s(this,R,b),b+=this.blockSize;if(typeof R=="string"){for(;b<E;)if(v[T++]=R.charCodeAt(b++),T==this.blockSize){s(this,v),T=0;break}}else for(;b<E;)if(v[T++]=R[b++],T==this.blockSize){s(this,v),T=0;break}}this.h=T,this.o+=E},r.prototype.A=function(){var R=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);R[0]=128;for(var E=1;E<R.length-8;++E)R[E]=0;E=this.o*8;for(var D=R.length-8;D<R.length;++D)R[D]=E&255,E/=256;for(this.v(R),R=Array(16),E=0,D=0;D<4;++D)for(let v=0;v<32;v+=8)R[E++]=this.g[D]>>>v&255;return R};function i(R,E){var D=B;return Object.prototype.hasOwnProperty.call(D,R)?D[R]:D[R]=E(R)}function o(R,E){this.h=E;const D=[];let v=!0;for(let T=R.length-1;T>=0;T--){const b=R[T]|0;v&&b==E||(D[T]=b,v=!1)}this.g=D}var B={};function u(R){return-128<=R&&R<128?i(R,function(E){return new o([E|0],E<0?-1:0)}):new o([R|0],R<0?-1:0)}function c(R){if(isNaN(R)||!isFinite(R))return C;if(R<0)return M(c(-R));const E=[];let D=1;for(let v=0;R>=D;v++)E[v]=R/D|0,D*=4294967296;return new o(E,0)}function h(R,E){if(R.length==0)throw Error("number format error: empty string");if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(R.charAt(0)=="-")return M(h(R.substring(1),E));if(R.indexOf("-")>=0)throw Error('number format error: interior "-" character');const D=c(Math.pow(E,8));let v=C;for(let b=0;b<R.length;b+=8){var T=Math.min(8,R.length-b);const _=parseInt(R.substring(b,b+T),E);T<8?(T=c(Math.pow(E,T)),v=v.j(T).add(c(_))):(v=v.j(D),v=v.add(c(_)))}return v}var C=u(0),p=u(1),w=u(16777216);n=o.prototype,n.m=function(){if(L(this))return-M(this).m();let R=0,E=1;for(let D=0;D<this.g.length;D++){const v=this.i(D);R+=(v>=0?v:4294967296+v)*E,E*=4294967296}return R},n.toString=function(R){if(R=R||10,R<2||36<R)throw Error("radix out of range: "+R);if(A(this))return"0";if(L(this))return"-"+M(this).toString(R);const E=c(Math.pow(R,6));var D=this;let v="";for(;;){const T=Be(D,E).g;D=j(D,T.j(E));let b=((D.g.length>0?D.g[0]:D.h)>>>0).toString(R);if(D=T,A(D))return b+v;for(;b.length<6;)b="0"+b;v=b+v}},n.i=function(R){return R<0?0:R<this.g.length?this.g[R]:this.h};function A(R){if(R.h!=0)return!1;for(let E=0;E<R.g.length;E++)if(R.g[E]!=0)return!1;return!0}function L(R){return R.h==-1}n.l=function(R){return R=j(this,R),L(R)?-1:A(R)?0:1};function M(R){const E=R.g.length,D=[];for(let v=0;v<E;v++)D[v]=~R.g[v];return new o(D,~R.h).add(p)}n.abs=function(){return L(this)?M(this):this},n.add=function(R){const E=Math.max(this.g.length,R.g.length),D=[];let v=0;for(let T=0;T<=E;T++){let b=v+(this.i(T)&65535)+(R.i(T)&65535),_=(b>>>16)+(this.i(T)>>>16)+(R.i(T)>>>16);v=_>>>16,b&=65535,_&=65535,D[T]=_<<16|b}return new o(D,D[D.length-1]&-2147483648?-1:0)};function j(R,E){return R.add(M(E))}n.j=function(R){if(A(this)||A(R))return C;if(L(this))return L(R)?M(this).j(M(R)):M(M(this).j(R));if(L(R))return M(this.j(M(R)));if(this.l(w)<0&&R.l(w)<0)return c(this.m()*R.m());const E=this.g.length+R.g.length,D=[];for(var v=0;v<2*E;v++)D[v]=0;for(v=0;v<this.g.length;v++)for(let T=0;T<R.g.length;T++){const b=this.i(v)>>>16,_=this.i(v)&65535,at=R.i(T)>>>16,sr=R.i(T)&65535;D[2*v+2*T]+=_*sr,ee(D,2*v+2*T),D[2*v+2*T+1]+=b*sr,ee(D,2*v+2*T+1),D[2*v+2*T+1]+=_*at,ee(D,2*v+2*T+1),D[2*v+2*T+2]+=b*at,ee(D,2*v+2*T+2)}for(R=0;R<E;R++)D[R]=D[2*R+1]<<16|D[2*R];for(R=E;R<2*E;R++)D[R]=0;return new o(D,0)};function ee(R,E){for(;(R[E]&65535)!=R[E];)R[E+1]+=R[E]>>>16,R[E]&=65535,E++}function se(R,E){this.g=R,this.h=E}function Be(R,E){if(A(E))throw Error("division by zero");if(A(R))return new se(C,C);if(L(R))return E=Be(M(R),E),new se(M(E.g),M(E.h));if(L(E))return E=Be(R,M(E)),new se(M(E.g),E.h);if(R.g.length>30){if(L(R)||L(E))throw Error("slowDivide_ only works with positive integers.");for(var D=p,v=E;v.l(R)<=0;)D=De(D),v=De(v);var T=pe(D,1),b=pe(v,1);for(v=pe(v,2),D=pe(D,2);!A(v);){var _=b.add(v);_.l(R)<=0&&(T=T.add(D),b=_),v=pe(v,1),D=pe(D,1)}return E=j(R,T.j(E)),new se(T,E)}for(T=C;R.l(E)>=0;){for(D=Math.max(1,Math.floor(R.m()/E.m())),v=Math.ceil(Math.log(D)/Math.LN2),v=v<=48?1:Math.pow(2,v-48),b=c(D),_=b.j(E);L(_)||_.l(R)>0;)D-=v,b=c(D),_=b.j(E);A(b)&&(b=p),T=T.add(b),R=j(R,_)}return new se(T,R)}n.B=function(R){return Be(this,R).h},n.and=function(R){const E=Math.max(this.g.length,R.g.length),D=[];for(let v=0;v<E;v++)D[v]=this.i(v)&R.i(v);return new o(D,this.h&R.h)},n.or=function(R){const E=Math.max(this.g.length,R.g.length),D=[];for(let v=0;v<E;v++)D[v]=this.i(v)|R.i(v);return new o(D,this.h|R.h)},n.xor=function(R){const E=Math.max(this.g.length,R.g.length),D=[];for(let v=0;v<E;v++)D[v]=this.i(v)^R.i(v);return new o(D,this.h^R.h)};function De(R){const E=R.g.length+1,D=[];for(let v=0;v<E;v++)D[v]=R.i(v)<<1|R.i(v-1)>>>31;return new o(D,R.h)}function pe(R,E){const D=E>>5;E%=32;const v=R.g.length-D,T=[];for(let b=0;b<v;b++)T[b]=E>0?R.i(b+D)>>>E|R.i(b+D+1)<<32-E:R.i(b+D);return new o(T,R.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,GC=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=h,Vn=o}).apply(typeof oh<"u"?oh:typeof self<"u"?self:typeof window<"u"?window:{});var ro=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var UC,Us,HC,Do,LB,qC,JC,jC;(function(){var n,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof ro=="object"&&ro];for(var l=0;l<a.length;++l){var f=a[l];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=t(this);function s(a,l){if(l)e:{var f=r;a=a.split(".");for(var d=0;d<a.length-1;d++){var P=a[d];if(!(P in f))break e;f=f[P]}a=a[a.length-1],d=f[a],l=l(d),l!=d&&l!=null&&e(f,a,{configurable:!0,writable:!0,value:l})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(l){var f=[],d;for(d in l)Object.prototype.hasOwnProperty.call(l,d)&&f.push([d,l[d]]);return f}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function B(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function u(a,l,f){return a.call.apply(a.bind,arguments)}function c(a,l,f){return c=u,c.apply(null,arguments)}function h(a,l){var f=Array.prototype.slice.call(arguments,1);return function(){var d=f.slice();return d.push.apply(d,arguments),a.apply(this,d)}}function C(a,l){function f(){}f.prototype=l.prototype,a.Z=l.prototype,a.prototype=new f,a.prototype.constructor=a,a.Ob=function(d,P,S){for(var J=Array(arguments.length-2),ie=2;ie<arguments.length;ie++)J[ie-2]=arguments[ie];return l.prototype[P].apply(d,J)}}var p=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function w(a){const l=a.length;if(l>0){const f=Array(l);for(let d=0;d<l;d++)f[d]=a[d];return f}return[]}function A(a,l){for(let d=1;d<arguments.length;d++){const P=arguments[d];var f=typeof P;if(f=f!="object"?f:P?Array.isArray(P)?"array":f:"null",f=="array"||f=="object"&&typeof P.length=="number"){f=a.length||0;const S=P.length||0;a.length=f+S;for(let J=0;J<S;J++)a[f+J]=P[J]}else a.push(P)}}class L{constructor(l,f){this.i=l,this.j=f,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function M(a){o.setTimeout(()=>{throw a},0)}function j(){var a=R;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class ee{constructor(){this.h=this.g=null}add(l,f){const d=se.get();d.set(l,f),this.h?this.h.next=d:this.g=d,this.h=d}}var se=new L(()=>new Be,a=>a.reset());class Be{constructor(){this.next=this.g=this.h=null}set(l,f){this.h=l,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let De,pe=!1,R=new ee,E=()=>{const a=Promise.resolve(void 0);De=()=>{a.then(D)}};function D(){for(var a;a=j();){try{a.h.call(a.g)}catch(f){M(f)}var l=se;l.j(a),l.h<100&&(l.h++,a.next=l.g,l.g=a)}pe=!1}function v(){this.u=this.u,this.C=this.C}v.prototype.u=!1,v.prototype.dispose=function(){this.u||(this.u=!0,this.N())},v.prototype[Symbol.dispose]=function(){this.dispose()},v.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var b=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};o.addEventListener("test",f,l),o.removeEventListener("test",f,l)}catch{}return a})();function _(a){return/^[\s\xa0]*$/.test(a)}function at(a,l){T.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,l)}C(at,T),at.prototype.init=function(a,l){const f=this.type=a.type,d=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget,l||(f=="mouseover"?l=a.fromElement:f=="mouseout"&&(l=a.toElement)),this.relatedTarget=l,d?(this.clientX=d.clientX!==void 0?d.clientX:d.pageX,this.clientY=d.clientY!==void 0?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&at.Z.h.call(this)},at.prototype.h=function(){at.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var sr="closure_listenable_"+(Math.random()*1e6|0),Pg=0;function bg(a,l,f,d,P){this.listener=a,this.proxy=null,this.src=l,this.type=f,this.capture=!!d,this.ha=P,this.key=++Pg,this.da=this.fa=!1}function Ui(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Hi(a,l,f){for(const d in a)l.call(f,a[d],d,a)}function Sg(a,l){for(const f in a)l.call(void 0,a[f],f,a)}function vc(a){const l={};for(const f in a)l[f]=a[f];return l}const Pc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function bc(a,l){let f,d;for(let P=1;P<arguments.length;P++){d=arguments[P];for(f in d)a[f]=d[f];for(let S=0;S<Pc.length;S++)f=Pc[S],Object.prototype.hasOwnProperty.call(d,f)&&(a[f]=d[f])}}function qi(a){this.src=a,this.g={},this.h=0}qi.prototype.add=function(a,l,f,d,P){const S=a.toString();a=this.g[S],a||(a=this.g[S]=[],this.h++);const J=Fa(a,l,d,P);return J>-1?(l=a[J],f||(l.fa=!1)):(l=new bg(l,this.src,S,!!d,P),l.fa=f,a.push(l)),l};function Na(a,l){const f=l.type;if(f in a.g){var d=a.g[f],P=Array.prototype.indexOf.call(d,l,void 0),S;(S=P>=0)&&Array.prototype.splice.call(d,P,1),S&&(Ui(l),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Fa(a,l,f,d){for(let P=0;P<a.length;++P){const S=a[P];if(!S.da&&S.listener==l&&S.capture==!!f&&S.ha==d)return P}return-1}var La="closure_lm_"+(Math.random()*1e6|0),ka={};function Sc(a,l,f,d,P){if(Array.isArray(l)){for(let S=0;S<l.length;S++)Sc(a,l[S],f,d,P);return null}return f=Fc(f),a&&a[sr]?a.J(l,f,B(d)?!!d.capture:!1,P):Og(a,l,f,!1,d,P)}function Og(a,l,f,d,P,S){if(!l)throw Error("Invalid event type");const J=B(P)?!!P.capture:!!P;let ie=Va(a);if(ie||(a[La]=ie=new qi(a)),f=ie.add(l,f,d,J,S),f.proxy)return f;if(d=Ng(),f.proxy=d,d.src=a,d.listener=f,a.addEventListener)b||(P=J),P===void 0&&(P=!1),a.addEventListener(l.toString(),d,P);else if(a.attachEvent)a.attachEvent(Nc(l.toString()),d);else if(a.addListener&&a.removeListener)a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");return f}function Ng(){function a(f){return l.call(a.src,a.listener,f)}const l=Fg;return a}function Oc(a,l,f,d,P){if(Array.isArray(l))for(var S=0;S<l.length;S++)Oc(a,l[S],f,d,P);else d=B(d)?!!d.capture:!!d,f=Fc(f),a&&a[sr]?(a=a.i,S=String(l).toString(),S in a.g&&(l=a.g[S],f=Fa(l,f,d,P),f>-1&&(Ui(l[f]),Array.prototype.splice.call(l,f,1),l.length==0&&(delete a.g[S],a.h--)))):a&&(a=Va(a))&&(l=a.g[l.toString()],a=-1,l&&(a=Fa(l,f,d,P)),(f=a>-1?l[a]:null)&&xa(f))}function xa(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[sr])Na(l.i,a);else{var f=a.type,d=a.proxy;l.removeEventListener?l.removeEventListener(f,d,a.capture):l.detachEvent?l.detachEvent(Nc(f),d):l.addListener&&l.removeListener&&l.removeListener(d),(f=Va(l))?(Na(f,a),f.h==0&&(f.src=null,l[La]=null)):Ui(a)}}}function Nc(a){return a in ka?ka[a]:ka[a]="on"+a}function Fg(a,l){if(a.da)a=!0;else{l=new at(l,this);const f=a.listener,d=a.ha||a.src;a.fa&&xa(a),a=f.call(d,l)}return a}function Va(a){return a=a[La],a instanceof qi?a:null}var Ma="__closure_events_fn_"+(Math.random()*1e9>>>0);function Fc(a){return typeof a=="function"?a:(a[Ma]||(a[Ma]=function(l){return a.handleEvent(l)}),a[Ma])}function Ke(){v.call(this),this.i=new qi(this),this.M=this,this.G=null}C(Ke,v),Ke.prototype[sr]=!0,Ke.prototype.removeEventListener=function(a,l,f,d){Oc(this,a,l,f,d)};function Xe(a,l){var f,d=a.G;if(d)for(f=[];d;d=d.G)f.push(d);if(a=a.M,d=l.type||l,typeof l=="string")l=new T(l,a);else if(l instanceof T)l.target=l.target||a;else{var P=l;l=new T(d,a),bc(l,P)}P=!0;let S,J;if(f)for(J=f.length-1;J>=0;J--)S=l.g=f[J],P=Ji(S,d,!0,l)&&P;if(S=l.g=a,P=Ji(S,d,!0,l)&&P,P=Ji(S,d,!1,l)&&P,f)for(J=0;J<f.length;J++)S=l.g=f[J],P=Ji(S,d,!1,l)&&P}Ke.prototype.N=function(){if(Ke.Z.N.call(this),this.i){var a=this.i;for(const l in a.g){const f=a.g[l];for(let d=0;d<f.length;d++)Ui(f[d]);delete a.g[l],a.h--}}this.G=null},Ke.prototype.J=function(a,l,f,d){return this.i.add(String(a),l,!1,f,d)},Ke.prototype.K=function(a,l,f,d){return this.i.add(String(a),l,!0,f,d)};function Ji(a,l,f,d){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();let P=!0;for(let S=0;S<l.length;++S){const J=l[S];if(J&&!J.da&&J.capture==f){const ie=J.listener,Me=J.ha||J.src;J.fa&&Na(a.i,J),P=ie.call(Me,d)!==!1&&P}}return P&&!d.defaultPrevented}function Lg(a,l){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=c(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:o.setTimeout(a,l||0)}function Lc(a){a.g=Lg(()=>{a.g=null,a.i&&(a.i=!1,Lc(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class kg extends v{constructor(l,f){super(),this.m=l,this.l=f,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Lc(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function _s(a){v.call(this),this.h=a,this.g={}}C(_s,v);var kc=[];function xc(a){Hi(a.g,function(l,f){this.g.hasOwnProperty(f)&&xa(l)},a),a.g={}}_s.prototype.N=function(){_s.Z.N.call(this),xc(this)},_s.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ga=o.JSON.stringify,xg=o.JSON.parse,Vg=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Vc(){}function Mc(){}var Ds={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Ua(){T.call(this,"d")}C(Ua,T);function Ha(){T.call(this,"c")}C(Ha,T);var ir={},Gc=null;function ji(){return Gc=Gc||new Ke}ir.Ia="serverreachability";function Uc(a){T.call(this,ir.Ia,a)}C(Uc,T);function ws(a){const l=ji();Xe(l,new Uc(l))}ir.STAT_EVENT="statevent";function Hc(a,l){T.call(this,ir.STAT_EVENT,a),this.stat=l}C(Hc,T);function Ze(a){const l=ji();Xe(l,new Hc(l,a))}ir.Ja="timingevent";function qc(a,l){T.call(this,ir.Ja,a),this.size=l}C(qc,T);function Is(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},l)}function ys(){this.g=!0}ys.prototype.ua=function(){this.g=!1};function Mg(a,l,f,d,P,S){a.info(function(){if(a.g)if(S){var J="",ie=S.split("&");for(let ge=0;ge<ie.length;ge++){var Me=ie[ge].split("=");if(Me.length>1){const Ue=Me[0];Me=Me[1];const Gt=Ue.split("_");J=Gt.length>=2&&Gt[1]=="type"?J+(Ue+"="+Me+"&"):J+(Ue+"=redacted&")}}}else J=null;else J=S;return"XMLHTTP REQ ("+d+") [attempt "+P+"]: "+l+`
`+f+`
`+J})}function Gg(a,l,f,d,P,S,J){a.info(function(){return"XMLHTTP RESP ("+d+") [ attempt "+P+"]: "+l+`
`+f+`
`+S+" "+J})}function Vr(a,l,f,d){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+Hg(a,f)+(d?" "+d:"")})}function Ug(a,l){a.info(function(){return"TIMEOUT: "+l})}ys.prototype.info=function(){};function Hg(a,l){if(!a.g)return l;if(!l)return null;try{const S=JSON.parse(l);if(S){for(a=0;a<S.length;a++)if(Array.isArray(S[a])){var f=S[a];if(!(f.length<2)){var d=f[1];if(Array.isArray(d)&&!(d.length<1)){var P=d[0];if(P!="noop"&&P!="stop"&&P!="close")for(let J=1;J<d.length;J++)d[J]=""}}}}return Ga(S)}catch{return l}}var Ki={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Jc={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},jc;function qa(){}C(qa,Vc),qa.prototype.g=function(){return new XMLHttpRequest},jc=new qa;function Ts(a){return encodeURIComponent(String(a))}function qg(a){var l=1;a=a.split(":");const f=[];for(;l>0&&a.length;)f.push(a.shift()),l--;return a.length&&f.push(a.join(":")),f}function En(a,l,f,d){this.j=a,this.i=l,this.l=f,this.S=d||1,this.V=new _s(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Kc}function Kc(){this.i=null,this.g="",this.h=!1}var zc={},Ja={};function ja(a,l,f){a.M=1,a.A=Qi(Mt(l)),a.u=f,a.R=!0,Qc(a,null)}function Qc(a,l){a.F=Date.now(),zi(a),a.B=Mt(a.A);var f=a.B,d=a.S;Array.isArray(d)||(d=[String(d)]),al(f.i,"t",d),a.C=0,f=a.j.L,a.h=new Kc,a.g=Tl(a.j,f?l:null,!a.u),a.P>0&&(a.O=new kg(c(a.Y,a,a.g),a.P)),l=a.V,f=a.g,d=a.ba;var P="readystatechange";Array.isArray(P)||(P&&(kc[0]=P.toString()),P=kc);for(let S=0;S<P.length;S++){const J=Sc(f,P[S],d||l.handleEvent,!1,l.h||l);if(!J)break;l.g[J.key]=J}l=a.J?vc(a.J):{},a.u?(a.v||(a.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,l)):(a.v="GET",a.g.ea(a.B,a.v,null,l)),ws(),Mg(a.i,a.v,a.B,a.l,a.S,a.u)}En.prototype.ba=function(a){a=a.target;const l=this.O;l&&wn(a)==3?l.j():this.Y(a)},En.prototype.Y=function(a){try{if(a==this.g)e:{const ie=wn(this.g),Me=this.g.ya(),ge=this.g.ca();if(!(ie<3)&&(ie!=3||this.g&&(this.h.h||this.g.la()||Cl(this.g)))){this.K||ie!=4||Me==7||(Me==8||ge<=0?ws(3):ws(2)),Ka(this);var l=this.g.ca();this.X=l;var f=Jg(this);if(this.o=l==200,Gg(this.i,this.v,this.B,this.l,this.S,ie,l),this.o){if(this.U&&!this.L){t:{if(this.g){var d,P=this.g;if((d=P.g?P.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(d)){var S=d;break t}}S=null}if(a=S)Vr(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,za(this,a);else{this.o=!1,this.m=3,Ze(12),or(this),As(this);break e}}if(this.R){a=!0;let Ue;for(;!this.K&&this.C<f.length;)if(Ue=jg(this,f),Ue==Ja){ie==4&&(this.m=4,Ze(14),a=!1),Vr(this.i,this.l,null,"[Incomplete Response]");break}else if(Ue==zc){this.m=4,Ze(15),Vr(this.i,this.l,f,"[Invalid Chunk]"),a=!1;break}else Vr(this.i,this.l,Ue,null),za(this,Ue);if(Wc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ie!=4||f.length!=0||this.h.h||(this.m=1,Ze(16),a=!1),this.o=this.o&&a,!a)Vr(this.i,this.l,f,"[Invalid Chunked Response]"),or(this),As(this);else if(f.length>0&&!this.W){this.W=!0;var J=this.j;J.g==this&&J.aa&&!J.P&&(J.j.info("Great, no buffering proxy detected. Bytes received: "+f.length),tB(J),J.P=!0,Ze(11))}}else Vr(this.i,this.l,f,null),za(this,f);ie==4&&or(this),this.o&&!this.K&&(ie==4?Dl(this.j,this):(this.o=!1,zi(this)))}else im(this.g),l==400&&f.indexOf("Unknown SID")>0?(this.m=3,Ze(12)):(this.m=0,Ze(13)),or(this),As(this)}}}catch{}finally{}};function Jg(a){if(!Wc(a))return a.g.la();const l=Cl(a.g);if(l==="")return"";let f="";const d=l.length,P=wn(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return or(a),As(a),"";a.h.i=new o.TextDecoder}for(let S=0;S<d;S++)a.h.h=!0,f+=a.h.i.decode(l[S],{stream:!(P&&S==d-1)});return l.length=0,a.h.g+=f,a.C=0,a.h.g}function Wc(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function jg(a,l){var f=a.C,d=l.indexOf(`
`,f);return d==-1?Ja:(f=Number(l.substring(f,d)),isNaN(f)?zc:(d+=1,d+f>l.length?Ja:(l=l.slice(d,d+f),a.C=d+f,l)))}En.prototype.cancel=function(){this.K=!0,or(this)};function zi(a){a.T=Date.now()+a.H,$c(a,a.H)}function $c(a,l){if(a.D!=null)throw Error("WatchDog timer not null");a.D=Is(c(a.aa,a),l)}function Ka(a){a.D&&(o.clearTimeout(a.D),a.D=null)}En.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(Ug(this.i,this.B),this.M!=2&&(ws(),Ze(17)),or(this),this.m=2,As(this)):$c(this,this.T-a)};function As(a){a.j.I==0||a.K||Dl(a.j,a)}function or(a){Ka(a);var l=a.O;l&&typeof l.dispose=="function"&&l.dispose(),a.O=null,xc(a.V),a.g&&(l=a.g,a.g=null,l.abort(),l.dispose())}function za(a,l){try{var f=a.j;if(f.I!=0&&(f.g==a||Qa(f.h,a))){if(!a.L&&Qa(f.h,a)&&f.I==3){try{var d=f.Ba.g.parse(l)}catch{d=null}if(Array.isArray(d)&&d.length==3){var P=d;if(P[0]==0){e:if(!f.v){if(f.g)if(f.g.F+3e3<a.F)Zi(f),Yi(f);else break e;eB(f),Ze(18)}}else f.xa=P[1],0<f.xa-f.K&&P[2]<37500&&f.F&&f.A==0&&!f.C&&(f.C=Is(c(f.Va,f),6e3));Zc(f.h)<=1&&f.ta&&(f.ta=void 0)}else Br(f,11)}else if((a.L||f.g==a)&&Zi(f),!_(l))for(P=f.Ba.g.parse(l),l=0;l<P.length;l++){let ge=P[l];const Ue=ge[0];if(!(Ue<=f.K))if(f.K=Ue,ge=ge[1],f.I==2)if(ge[0]=="c"){f.M=ge[1],f.ba=ge[2];const Gt=ge[3];Gt!=null&&(f.ka=Gt,f.j.info("VER="+f.ka));const ur=ge[4];ur!=null&&(f.za=ur,f.j.info("SVER="+f.za));const In=ge[5];In!=null&&typeof In=="number"&&In>0&&(d=1.5*In,f.O=d,f.j.info("backChannelRequestTimeoutMs_="+d)),d=f;const yn=a.g;if(yn){const to=yn.g?yn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(to){var S=d.h;S.g||to.indexOf("spdy")==-1&&to.indexOf("quic")==-1&&to.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(Wa(S,S.h),S.h=null))}if(d.G){const nB=yn.g?yn.g.getResponseHeader("X-HTTP-Session-Id"):null;nB&&(d.wa=nB,we(d.J,d.G,nB))}}f.I=3,f.l&&f.l.ra(),f.aa&&(f.T=Date.now()-a.F,f.j.info("Handshake RTT: "+f.T+"ms")),d=f;var J=a;if(d.na=yl(d,d.L?d.ba:null,d.W),J.L){el(d.h,J);var ie=J,Me=d.O;Me&&(ie.H=Me),ie.D&&(Ka(ie),zi(ie)),d.g=J}else El(d);f.i.length>0&&Xi(f)}else ge[0]!="stop"&&ge[0]!="close"||Br(f,7);else f.I==3&&(ge[0]=="stop"||ge[0]=="close"?ge[0]=="stop"?Br(f,7):Za(f):ge[0]!="noop"&&f.l&&f.l.qa(ge),f.A=0)}}ws(4)}catch{}}var Kg=class{constructor(a,l){this.g=a,this.map=l}};function Yc(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Xc(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Zc(a){return a.h?1:a.g?a.g.size:0}function Qa(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function Wa(a,l){a.g?a.g.add(l):a.h=l}function el(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}Yc.prototype.cancel=function(){if(this.i=tl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function tl(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const f of a.g.values())l=l.concat(f.G);return l}return w(a.i)}var nl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function zg(a,l){if(a){a=a.split("&");for(let f=0;f<a.length;f++){const d=a[f].indexOf("=");let P,S=null;d>=0?(P=a[f].substring(0,d),S=a[f].substring(d+1)):P=a[f],l(P,S?decodeURIComponent(S.replace(/\+/g," ")):"")}}}function _n(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;a instanceof _n?(this.l=a.l,Rs(this,a.j),this.o=a.o,this.g=a.g,vs(this,a.u),this.h=a.h,$a(this,Bl(a.i)),this.m=a.m):a&&(l=String(a).match(nl))?(this.l=!1,Rs(this,l[1]||"",!0),this.o=Ps(l[2]||""),this.g=Ps(l[3]||"",!0),vs(this,l[4]),this.h=Ps(l[5]||"",!0),$a(this,l[6]||"",!0),this.m=Ps(l[7]||"")):(this.l=!1,this.i=new Ss(null,this.l))}_n.prototype.toString=function(){const a=[];var l=this.j;l&&a.push(bs(l,rl,!0),":");var f=this.g;return(f||l=="file")&&(a.push("//"),(l=this.o)&&a.push(bs(l,rl,!0),"@"),a.push(Ts(f).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.u,f!=null&&a.push(":",String(f))),(f=this.h)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(bs(f,f.charAt(0)=="/"?$g:Wg,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",bs(f,Xg)),a.join("")},_n.prototype.resolve=function(a){const l=Mt(this);let f=!!a.j;f?Rs(l,a.j):f=!!a.o,f?l.o=a.o:f=!!a.g,f?l.g=a.g:f=a.u!=null;var d=a.h;if(f)vs(l,a.u);else if(f=!!a.h){if(d.charAt(0)!="/")if(this.g&&!this.h)d="/"+d;else{var P=l.h.lastIndexOf("/");P!=-1&&(d=l.h.slice(0,P+1)+d)}if(P=d,P==".."||P==".")d="";else if(P.indexOf("./")!=-1||P.indexOf("/.")!=-1){d=P.lastIndexOf("/",0)==0,P=P.split("/");const S=[];for(let J=0;J<P.length;){const ie=P[J++];ie=="."?d&&J==P.length&&S.push(""):ie==".."?((S.length>1||S.length==1&&S[0]!="")&&S.pop(),d&&J==P.length&&S.push("")):(S.push(ie),d=!0)}d=S.join("/")}else d=P}return f?l.h=d:f=a.i.toString()!=="",f?$a(l,Bl(a.i)):f=!!a.m,f&&(l.m=a.m),l};function Mt(a){return new _n(a)}function Rs(a,l,f){a.j=f?Ps(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function vs(a,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);a.u=l}else a.u=null}function $a(a,l,f){l instanceof Ss?(a.i=l,Zg(a.i,a.l)):(f||(l=bs(l,Yg)),a.i=new Ss(l,a.l))}function we(a,l,f){a.i.set(l,f)}function Qi(a){return we(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Ps(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function bs(a,l,f){return typeof a=="string"?(a=encodeURI(a).replace(l,Qg),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Qg(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var rl=/[#\/\?@]/g,Wg=/[#\?:]/g,$g=/[#\?]/g,Yg=/[#\?@]/g,Xg=/#/g;function Ss(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function ar(a){a.g||(a.g=new Map,a.h=0,a.i&&zg(a.i,function(l,f){a.add(decodeURIComponent(l.replace(/\+/g," ")),f)}))}n=Ss.prototype,n.add=function(a,l){ar(this),this.i=null,a=Mr(this,a);let f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(l),this.h+=1,this};function sl(a,l){ar(a),l=Mr(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function il(a,l){return ar(a),l=Mr(a,l),a.g.has(l)}n.forEach=function(a,l){ar(this),this.g.forEach(function(f,d){f.forEach(function(P){a.call(l,P,d,this)},this)},this)};function ol(a,l){ar(a);let f=[];if(typeof l=="string")il(a,l)&&(f=f.concat(a.g.get(Mr(a,l))));else for(a=Array.from(a.g.values()),l=0;l<a.length;l++)f=f.concat(a[l]);return f}n.set=function(a,l){return ar(this),this.i=null,a=Mr(this,a),il(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},n.get=function(a,l){return a?(a=ol(this,a),a.length>0?String(a[0]):l):l};function al(a,l,f){sl(a,l),f.length>0&&(a.i=null,a.g.set(Mr(a,l),w(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(let d=0;d<l.length;d++){var f=l[d];const P=Ts(f);f=ol(this,f);for(let S=0;S<f.length;S++){let J=P;f[S]!==""&&(J+="="+Ts(f[S])),a.push(J)}}return this.i=a.join("&")};function Bl(a){const l=new Ss;return l.i=a.i,a.g&&(l.g=new Map(a.g),l.h=a.h),l}function Mr(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function Zg(a,l){l&&!a.j&&(ar(a),a.i=null,a.g.forEach(function(f,d){const P=d.toLowerCase();d!=P&&(sl(this,d),al(this,P,f))},a)),a.j=l}function em(a,l){const f=new ys;if(o.Image){const d=new Image;d.onload=h(Dn,f,"TestLoadImage: loaded",!0,l,d),d.onerror=h(Dn,f,"TestLoadImage: error",!1,l,d),d.onabort=h(Dn,f,"TestLoadImage: abort",!1,l,d),d.ontimeout=h(Dn,f,"TestLoadImage: timeout",!1,l,d),o.setTimeout(function(){d.ontimeout&&d.ontimeout()},1e4),d.src=a}else l(!1)}function tm(a,l){const f=new ys,d=new AbortController,P=setTimeout(()=>{d.abort(),Dn(f,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:d.signal}).then(S=>{clearTimeout(P),S.ok?Dn(f,"TestPingServer: ok",!0,l):Dn(f,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(P),Dn(f,"TestPingServer: error",!1,l)})}function Dn(a,l,f,d,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),d(f)}catch{}}function nm(){this.g=new Vg}function Ya(a){this.i=a.Sb||null,this.h=a.ab||!1}C(Ya,Vc),Ya.prototype.g=function(){return new Wi(this.i,this.h)};function Wi(a,l){Ke.call(this),this.H=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}C(Wi,Ke),n=Wi.prototype,n.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=l,this.readyState=1,Ns(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(l.body=a),(this.H||o).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Os(this)),this.readyState=0},n.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ns(this)),this.g&&(this.readyState=3,Ns(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;ul(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function ul(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}n.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?Os(this):Ns(this),this.readyState==3&&ul(this)}},n.Oa=function(a){this.g&&(this.response=this.responseText=a,Os(this))},n.Na=function(a){this.g&&(this.response=a,Os(this))},n.ga=function(){this.g&&Os(this)};function Os(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Ns(a)}n.setRequestHeader=function(a,l){this.A.append(a,l)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var f=l.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=l.next();return a.join(`\r
`)};function Ns(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Wi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function cl(a){let l="";return Hi(a,function(f,d){l+=d,l+=":",l+=f,l+=`\r
`}),l}function Xa(a,l,f){e:{for(d in f){var d=!1;break e}d=!0}d||(f=cl(f),typeof a=="string"?f!=null&&Ts(f):we(a,l,f))}function Se(a){Ke.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}C(Se,Ke);var rm=/^https?$/i,sm=["POST","PUT"];n=Se.prototype,n.Fa=function(a){this.H=a},n.ea=function(a,l,f,d){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():jc.g(),this.g.onreadystatechange=p(c(this.Ca,this));try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(S){ll(this,S);return}if(a=f||"",f=new Map(this.headers),d)if(Object.getPrototypeOf(d)===Object.prototype)for(var P in d)f.set(P,d[P]);else if(typeof d.keys=="function"&&typeof d.get=="function")for(const S of d.keys())f.set(S,d.get(S));else throw Error("Unknown input type for opt_headers: "+String(d));d=Array.from(f.keys()).find(S=>S.toLowerCase()=="content-type"),P=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(sm,l,void 0)>=0)||d||P||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,J]of f)this.g.setRequestHeader(S,J);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(S){ll(this,S)}};function ll(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.o=5,hl(a),$i(a)}function hl(a){a.A||(a.A=!0,Xe(a,"complete"),Xe(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,Xe(this,"complete"),Xe(this,"abort"),$i(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),$i(this,!0)),Se.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?fl(this):this.Xa())},n.Xa=function(){fl(this)};function fl(a){if(a.h&&typeof i<"u"){if(a.v&&wn(a)==4)setTimeout(a.Ca.bind(a),0);else if(Xe(a,"readystatechange"),wn(a)==4){a.h=!1;try{const S=a.ca();e:switch(S){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var f;if(!(f=l)){var d;if(d=S===0){let J=String(a.D).match(nl)[1]||null;!J&&o.self&&o.self.location&&(J=o.self.location.protocol.slice(0,-1)),d=!rm.test(J?J.toLowerCase():"")}f=d}if(f)Xe(a,"complete"),Xe(a,"success");else{a.o=6;try{var P=wn(a)>2?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.ca()+"]",hl(a)}}finally{$i(a)}}}}function $i(a,l){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const f=a.g;a.g=null,l||Xe(a,"ready");try{f.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function wn(a){return a.g?a.g.readyState:0}n.ca=function(){try{return wn(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),xg(l)}};function Cl(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function im(a){const l={};a=(a.g&&wn(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let d=0;d<a.length;d++){if(_(a[d]))continue;var f=qg(a[d]);const P=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const S=l[P]||[];l[P]=S,S.push(f)}Sg(l,function(d){return d.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Fs(a,l,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||l}function dl(a){this.za=0,this.i=[],this.j=new ys,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Fs("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Fs("baseRetryDelayMs",5e3,a),this.Za=Fs("retryDelaySeedMs",1e4,a),this.Ta=Fs("forwardChannelMaxRetries",2,a),this.va=Fs("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new Yc(a&&a.concurrentRequestLimit),this.Ba=new nm,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=dl.prototype,n.ka=8,n.I=1,n.connect=function(a,l,f,d){Ze(0),this.W=a,this.H=l||{},f&&d!==void 0&&(this.H.OSID=f,this.H.OAID=d),this.F=this.X,this.J=yl(this,null,this.W),Xi(this)};function Za(a){if(pl(a),a.I==3){var l=a.V++,f=Mt(a.J);if(we(f,"SID",a.M),we(f,"RID",l),we(f,"TYPE","terminate"),Ls(a,f),l=new En(a,a.j,l),l.M=2,l.A=Qi(Mt(f)),f=!1,o.navigator&&o.navigator.sendBeacon)try{f=o.navigator.sendBeacon(l.A.toString(),"")}catch{}!f&&o.Image&&(new Image().src=l.A,f=!0),f||(l.g=Tl(l.j,null),l.g.ea(l.A)),l.F=Date.now(),zi(l)}Il(a)}function Yi(a){a.g&&(tB(a),a.g.cancel(),a.g=null)}function pl(a){Yi(a),a.v&&(o.clearTimeout(a.v),a.v=null),Zi(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function Xi(a){if(!Xc(a.h)&&!a.m){a.m=!0;var l=a.Ea;De||E(),pe||(De(),pe=!0),R.add(l,a),a.D=0}}function om(a,l){return Zc(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=l.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=Is(c(a.Ea,a,l),wl(a,a.D)),a.D++,!0)}n.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const P=new En(this,this.j,a);let S=this.o;if(this.U&&(S?(S=vc(S),bc(S,this.U)):S=this.U),this.u!==null||this.R||(P.J=S,S=null),this.S)e:{for(var l=0,f=0;f<this.i.length;f++){t:{var d=this.i[f];if("__data__"in d.map&&(d=d.map.__data__,typeof d=="string")){d=d.length;break t}d=void 0}if(d===void 0)break;if(l+=d,l>4096){l=f;break e}if(l===4096||f===this.i.length-1){l=f+1;break e}}l=1e3}else l=1e3;l=ml(this,P,l),f=Mt(this.J),we(f,"RID",a),we(f,"CVER",22),this.G&&we(f,"X-HTTP-Session-Id",this.G),Ls(this,f),S&&(this.R?l="headers="+Ts(cl(S))+"&"+l:this.u&&Xa(f,this.u,S)),Wa(this.h,P),this.Ra&&we(f,"TYPE","init"),this.S?(we(f,"$req",l),we(f,"SID","null"),P.U=!0,ja(P,f,null)):ja(P,f,l),this.I=2}}else this.I==3&&(a?gl(this,a):this.i.length==0||Xc(this.h)||gl(this))};function gl(a,l){var f;l?f=l.l:f=a.V++;const d=Mt(a.J);we(d,"SID",a.M),we(d,"RID",f),we(d,"AID",a.K),Ls(a,d),a.u&&a.o&&Xa(d,a.u,a.o),f=new En(a,a.j,f,a.D+1),a.u===null&&(f.J=a.o),l&&(a.i=l.G.concat(a.i)),l=ml(a,f,1e3),f.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Wa(a.h,f),ja(f,d,l)}function Ls(a,l){a.H&&Hi(a.H,function(f,d){we(l,d,f)}),a.l&&Hi({},function(f,d){we(l,d,f)})}function ml(a,l,f){f=Math.min(a.i.length,f);const d=a.l?c(a.l.Ka,a.l,a):null;e:{var P=a.i;let ie=-1;for(;;){const Me=["count="+f];ie==-1?f>0?(ie=P[0].g,Me.push("ofs="+ie)):ie=0:Me.push("ofs="+ie);let ge=!0;for(let Ue=0;Ue<f;Ue++){var S=P[Ue].g;const Gt=P[Ue].map;if(S-=ie,S<0)ie=Math.max(0,P[Ue].g-100),ge=!1;else try{S="req"+S+"_"||"";try{var J=Gt instanceof Map?Gt:Object.entries(Gt);for(const[ur,In]of J){let yn=In;B(In)&&(yn=Ga(In)),Me.push(S+ur+"="+encodeURIComponent(yn))}}catch(ur){throw Me.push(S+"type="+encodeURIComponent("_badmap")),ur}}catch{d&&d(Gt)}}if(ge){J=Me.join("&");break e}}J=void 0}return a=a.i.splice(0,f),l.G=a,J}function El(a){if(!a.g&&!a.v){a.Y=1;var l=a.Da;De||E(),pe||(De(),pe=!0),R.add(l,a),a.A=0}}function eB(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=Is(c(a.Da,a),wl(a,a.A)),a.A++,!0)}n.Da=function(){if(this.v=null,_l(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=Is(c(this.Wa,this),a)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Ze(10),Yi(this),_l(this))};function tB(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function _l(a){a.g=new En(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var l=Mt(a.na);we(l,"RID","rpc"),we(l,"SID",a.M),we(l,"AID",a.K),we(l,"CI",a.F?"0":"1"),!a.F&&a.ia&&we(l,"TO",a.ia),we(l,"TYPE","xmlhttp"),Ls(a,l),a.u&&a.o&&Xa(l,a.u,a.o),a.O&&(a.g.H=a.O);var f=a.g;a=a.ba,f.M=1,f.A=Qi(Mt(l)),f.u=null,f.R=!0,Qc(f,a)}n.Va=function(){this.C!=null&&(this.C=null,Yi(this),eB(this),Ze(19))};function Zi(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Dl(a,l){var f=null;if(a.g==l){Zi(a),tB(a),a.g=null;var d=2}else if(Qa(a.h,l))f=l.G,el(a.h,l),d=1;else return;if(a.I!=0){if(l.o)if(d==1){f=l.u?l.u.length:0,l=Date.now()-l.F;var P=a.D;d=ji(),Xe(d,new qc(d,f)),Xi(a)}else El(a);else if(P=l.m,P==3||P==0&&l.X>0||!(d==1&&om(a,l)||d==2&&eB(a)))switch(f&&f.length>0&&(l=a.h,l.i=l.i.concat(f)),P){case 1:Br(a,5);break;case 4:Br(a,10);break;case 3:Br(a,6);break;default:Br(a,2)}}}function wl(a,l){let f=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(f*=2),f*l}function Br(a,l){if(a.j.info("Error code "+l),l==2){var f=c(a.bb,a),d=a.Ua;const P=!d;d=new _n(d||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||Rs(d,"https"),Qi(d),P?em(d.toString(),f):tm(d.toString(),f)}else Ze(2);a.I=0,a.l&&a.l.pa(l),Il(a),pl(a)}n.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Ze(2)):(this.j.info("Failed to ping google.com"),Ze(1))};function Il(a){if(a.I=0,a.ja=[],a.l){const l=tl(a.h);(l.length!=0||a.i.length!=0)&&(A(a.ja,l),A(a.ja,a.i),a.h.i.length=0,w(a.i),a.i.length=0),a.l.oa()}}function yl(a,l,f){var d=f instanceof _n?Mt(f):new _n(f);if(d.g!="")l&&(d.g=l+"."+d.g),vs(d,d.u);else{var P=o.location;d=P.protocol,l=l?l+"."+P.hostname:P.hostname,P=+P.port;const S=new _n(null);d&&Rs(S,d),l&&(S.g=l),P&&vs(S,P),f&&(S.h=f),d=S}return f=a.G,l=a.wa,f&&l&&we(d,f,l),we(d,"VER",a.ka),Ls(a,d),d}function Tl(a,l,f){if(l&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Aa&&!a.ma?new Se(new Ya({ab:f})):new Se(a.ma),l.Fa(a.L),l}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Al(){}n=Al.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function eo(){}eo.prototype.g=function(a,l){return new Et(a,l)};function Et(a,l){Ke.call(this),this.g=new dl(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(a?a["X-WebChannel-Client-Profile"]=l.sa:a={"X-WebChannel-Client-Profile":l.sa}),this.g.U=a,(a=l&&l.Qb)&&!_(a)&&(this.g.u=a),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!_(l)&&(this.g.G=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new Gr(this)}C(Et,Ke),Et.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Et.prototype.close=function(){Za(this.g)},Et.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.v&&(f={},f.__data__=Ga(a),a=f);l.i.push(new Kg(l.Ya++,a)),l.I==3&&Xi(l)},Et.prototype.N=function(){this.g.l=null,delete this.j,Za(this.g),delete this.g,Et.Z.N.call(this)};function Rl(a){Ua.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const f in l){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}C(Rl,Ua);function vl(){Ha.call(this),this.status=1}C(vl,Ha);function Gr(a){this.g=a}C(Gr,Al),Gr.prototype.ra=function(){Xe(this.g,"a")},Gr.prototype.qa=function(a){Xe(this.g,new Rl(a))},Gr.prototype.pa=function(a){Xe(this.g,new vl)},Gr.prototype.oa=function(){Xe(this.g,"b")},eo.prototype.createWebChannel=eo.prototype.g,Et.prototype.send=Et.prototype.o,Et.prototype.open=Et.prototype.m,Et.prototype.close=Et.prototype.close,jC=function(){return new eo},JC=function(){return ji()},qC=ir,LB={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Ki.NO_ERROR=0,Ki.TIMEOUT=8,Ki.HTTP_ERROR=6,Do=Ki,Jc.COMPLETE="complete",HC=Jc,Mc.EventType=Ds,Ds.OPEN="a",Ds.CLOSE="b",Ds.ERROR="c",Ds.MESSAGE="d",Ke.prototype.listen=Ke.prototype.J,Us=Mc,Se.prototype.listenOnce=Se.prototype.K,Se.prototype.getLastError=Se.prototype.Ha,Se.prototype.getLastErrorCode=Se.prototype.ya,Se.prototype.getStatus=Se.prototype.ca,Se.prototype.getResponseJson=Se.prototype.La,Se.prototype.getResponseText=Se.prototype.la,Se.prototype.send=Se.prototype.ea,Se.prototype.setWithCredentials=Se.prototype.Fa,UC=Se}).apply(typeof ro<"u"?ro:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.8.6
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository github:le0pard/re2js
* @license MIT
*/var me,V=(me=class{},G(me,"FOLD_CASE",1),G(me,"LITERAL",2),G(me,"CLASS_NL",4),G(me,"DOT_NL",8),G(me,"ONE_LINE",16),G(me,"NON_GREEDY",32),G(me,"PERL_X",64),G(me,"UNICODE_GROUPS",128),G(me,"WAS_DOLLAR",256),G(me,"LOOKBEHIND",512),G(me,"MATCH_NL",me.CLASS_NL|me.DOT_NL),G(me,"PERL",me.CLASS_NL|me.ONE_LINE|me.PERL_X|me.UNICODE_GROUPS),G(me,"POSIX",0),G(me,"UNANCHORED",0),G(me,"ANCHOR_START",1),G(me,"ANCHOR_BOTH",2),me);const Ur={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},ri=128,kB=new Int32Array(ri),xB=new Int32Array(ri),so=65535;for(let n=0;n<ri;n++)n>=97&&n<=122?kB[n]=n-32:kB[n]=n,n>=65&&n<=90?xB[n]=n+32:xB[n]=n;var RB,O=(RB=class{static toUpperCase(n){if(n<ri)return kB[n];const e=String.fromCodePoint(n).toUpperCase(),t=e.codePointAt(0)>so?2:1;if(e.length>t)return n;const r=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=r.codePointAt(0)>so?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}static toLowerCase(n){if(n<ri)return xB[n];const e=String.fromCodePoint(n).toLowerCase(),t=e.codePointAt(0)>so?2:1;if(e.length>t)return n;const r=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=r.codePointAt(0)>so?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}},G(RB,"CODES",new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["'",39],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["`",96],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]])),RB),g=class{constructor(n,e=!1){this.data=n,this.isStride1=e,this.SIZE=e?2:3}getLo(n){return this.data[n*this.SIZE]}getHi(n){return this.data[n*this.SIZE+1]}getStride(n){return this.isStride1?1:this.data[n*this.SIZE+2]}get length(){return this.data.length/this.SIZE}};const KC=new Uint8Array(256);for(let n=0,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";n<64;n++)KC[e.charCodeAt(n)]=n;const zC=n=>{const e=[];let t=0,r=0;for(let s=0;s<n.length;s++){let i=KC[n.charCodeAt(s)];t|=(i&31)<<r,(i&32)===0?(e.push(t),t=0,r=0):r+=5}return e},m=(n,e)=>{const t=zC(n),r=e?t.length/2:t.length/3,s=new Uint32Array(r*3);let i=0,o=0;for(let B=0;B<r;B++)i+=t[o++],s[B*3]=i,i+=t[o++],s[B*3+1]=i,s[B*3+2]=e?1:t[o++];return s},ew=n=>{const e=zC(n),t=new Map;let r=0;for(let s=0;s<e.length;s+=2){r+=e[s];const i=e[s+1],o=i>>>1^-(i&1);t.set(r,r+o)}return t};var io=class{constructor(n){this.initializer=n,this.cache=new Map}has(n){return n in this.initializer}get(n){if(this.cache.has(n))return this.cache.get(n);const e=this.initializer[n],t=e?e():null;return this.cache.set(n,t),t}},Rn,ut=(Rn=class{static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=ew("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static get Print(){return this._Print||(this._Print=new g(m("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}static get Upper(){return this.CATEGORIES.get("Lu")}},G(Rn,"_CASE_ORBIT",null),G(Rn,"_Print",null),G(Rn,"CATEGORIES",new io({C:()=>new g(m("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new g(m("AfgDgB",!0)),Cf:()=>new g(m("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new g(m("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new g(m("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new g(m("gg2B--B",!0)),L:()=>new g(m("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new g(m("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new g(m("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new g(m("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new g(m("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new g(m("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new g(m("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new g(m("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new g(m("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new g(m("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new g(m("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new g(m("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new g(m("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new g(m("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new g(m("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new g(m("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new g(m("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new g(m("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new g(m("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new g(m("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new g(m("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new g(m("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new g(m("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new g(m("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new g(m("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new g(m("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new g(m("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new g(m("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new g(m("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new g(m("ohIA",!0)),Zp:()=>new g(m("phIA",!0)),Zs:()=>new g(m("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new g(m("wBJIFbF",!0)),Alphabetic:()=>new g(m("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new g(m("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new g(m("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new g(m("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new g(m("7-8DE",!0)),Emoji_Modifier_Base:()=>new g(m("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new g(m("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new g(m("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new g(m("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new g(m("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new g(m("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new g(m("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new g(m("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new g(m("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new g(m("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))})),G(Rn,"SCRIPTS",new io({Adlam:()=>new g(m("go6DrCFJFB",!0)),Ahom:()=>new g(m("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new g(m("ggxCmS",!0)),Arabic:()=>new g(m("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new g(m("xpBlBDxBDCks9BE",!0)),Avestan:()=>new g(m("g4iC1BEG",!0)),Balinese:()=>new g(m("g4GsCCxB",!0)),Bamum:()=>new g(m("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new g(m("w26CdDF",!0)),Batak:()=>new g(m("g+GzBJD",!0)),Bengali:()=>new g(m("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new g(m("g17CYDY",!0)),Bhaiksuki:()=>new g(m("ggnCICsBCNLc",!0)),Bopomofo:()=>new g(m("qXB6wLqBxDf",!0)),Brahmi:()=>new g(m("ggkCtCFjBKA",!0)),Braille:()=>new g(m("ggK-H",!0)),Buginese:()=>new g(m("gwGbDB",!0)),Buhid:()=>new g(m("g6FT",!0)),Canadian_Aboriginal:()=>new g(m("ggF-TxRlC7tgCP",!0)),Carian:()=>new g(m("g1gCwB",!0)),Caucasian_Albanian:()=>new g(m("wphCzBMA",!0)),Chakma:()=>new g(m("gokC0BCR",!0)),Cham:()=>new g(m("gwqB2BKNDJDD",!0)),Cherokee:()=>new g(m("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new g(m("w9jCb",!0)),Common:()=>new g(m("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new g(m("ifNxkKzDGG",!0)),Cuneiform:()=>new g(m("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new g(m("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new g(m("w8rCiD",!0)),Cyrillic:()=>new g(m("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new g(m("gghCvC",!0)),Devanagari:()=>new g(m("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new g(m("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new g(m("ggmC7B",!0)),Duployan:()=>new g(m("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new g(m("ggsC1iBL68D",!0)),Elbasan:()=>new g(m("gohCnB",!0)),Elymaic:()=>new g(m("g-jCW",!0)),Ethiopic:()=>new g(m("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new g(m("gqjClBEcJB",!0)),Georgian:()=>new g(m("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new g(m("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new g(m("w5gCa",!0)),Grantha:()=>new g(m("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new g(m("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new g(m("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new g(m("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new g(m("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new g(m("go4C5B",!0)),Han:()=>new g(m("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new g(m("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new g(m("gojCnBJJ",!0)),Hanunoo:()=>new g(m("g5FU",!0)),Hatran:()=>new g(m("gniCSCBGE",!0)),Hebrew:()=>new g(m("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new g(m("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new g(m("giiCVCI",!0)),Inherited:()=>new g(m("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new g(m("g7iCSGH",!0)),Inscriptional_Parthian:()=>new g(m("g6iCVDH",!0)),Javanese:()=>new g(m("gsqBtCDJFB",!0)),Kaithi:()=>new g(m("gkkCiCLA",!0)),Kannada:()=>new g(m("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new g(m("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new g(m("g4nCQCoBEc",!0)),Kayah_Li:()=>new g(m("goqBtBCA",!0)),Kharoshthi:()=>new g(m("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new g(m("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new g(m("g8F9CDJHJnPf",!0)),Khojki:()=>new g(m("gwkCRCuB",!0)),Khudawadi:()=>new g(m("w1kC6BGJ",!0)),Kirat_Rai:()=>new g(m("gq7C5B",!0)),Lao:()=>new g(m("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new g(m("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new g(m("ggH3BEOEC",!0)),Limbu:()=>new g(m("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new g(m("gwhC2JKVLH",!0)),Linear_B:()=>new g(m("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new g(m("wmpBvBx1eA",!0)),Lycian:()=>new g(m("g0gCc",!0)),Lydian:()=>new g(m("gpiCZGA",!0)),Mahajani:()=>new g(m("wqkCmB",!0)),Makasar:()=>new g(m("g3nCY",!0)),Malayalam:()=>new g(m("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new g(m("giCbDA",!0)),Manichaean:()=>new g(m("g2iCmBFL",!0)),Marchen:()=>new g(m("wjnCfDVCN",!0)),Masaram_Gondi:()=>new g(m("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new g(m("gy7C6C",!0)),Meetei_Mayek:()=>new g(m("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new g(m("gg6DkGDP",!0)),Meroitic_Cursive:()=>new g(m("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new g(m("gsiCf",!0)),Miao:()=>new g(m("g47CqCF4BIQ",!0)),Modi:()=>new g(m("gwlCkCMJ",!0)),Mongolian:()=>new g(m("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new g(m("gy6CeCJFB",!0)),Multani:()=>new g(m("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new g(m("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new g(m("gkiCeJI",!0)),Nag_Mundari:()=>new g(m("wm5DpB",!0)),Nandinagari:()=>new g(m("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new g(m("gsGrBFZHKEB",!0)),Newa:()=>new g(m("gglC7CCE",!0)),Nko:()=>new g(m("g+B6BDC",!0)),Nushu:()=>new g(m("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new g(m("go4DsBENDJFB",!0)),Ogham:()=>new g(m("g0Fc",!0)),Ol_Chiki:()=>new g(m("wiHvB",!0)),Ol_Onal:()=>new g(m("wu5DqBFA",!0)),Old_Hungarian:()=>new g(m("gkjCyBOyBIF",!0)),Old_Italic:()=>new g(m("g4gCjBKC",!0)),Old_North_Arabian:()=>new g(m("g0iCf",!0)),Old_Permic:()=>new g(m("w6gCqB",!0)),Old_Persian:()=>new g(m("g9gCjBFN",!0)),Old_Sogdian:()=>new g(m("g4jCnB",!0)),Old_South_Arabian:()=>new g(m("gziCf",!0)),Old_Turkic:()=>new g(m("ggjCoC",!0)),Old_Uyghur:()=>new g(m("w7jCZ",!0)),Oriya:()=>new g(m("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new g(m("wlhCjBFjB",!0)),Osmanya:()=>new g(m("gkhCdDJ",!0)),Pahawh_Hmong:()=>new g(m("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new g(m("gjiCf",!0)),Pau_Cin_Hau:()=>new g(m("g2mC4B",!0)),Phags_Pa:()=>new g(m("giqB3B",!0)),Phoenician:()=>new g(m("goiCbEA",!0)),Psalter_Pahlavi:()=>new g(m("g8iCRIDNG",!0)),Rejang:()=>new g(m("wpqBjBMA",!0)),Runic:()=>new g(m("g1FqCEK",!0)),Samaritan:()=>new g(m("ggCtBDO",!0)),Saurashtra:()=>new g(m("gkqBlCJL",!0)),Sharada:()=>new g(m("gskC-ChsCH",!0)),Shavian:()=>new g(m("wihCvB",!0)),Siddham:()=>new g(m("gslC1BDlB",!0)),Sidetic:()=>new g(m("gqiCZ",!0)),SignWriting:()=>new g(m("gg2DrUQECO",!0)),Sinhala:()=>new g(m("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new g(m("w5jCpB",!0)),Sora_Sompeng:()=>new g(m("wmkCYIJ",!0)),Soyombo:()=>new g(m("wymCyC",!0)),Sundanese:()=>new g(m("g8G-BhIH",!0)),Sunuwar:()=>new g(m("g+mChBPJ",!0)),Syloti_Nagri:()=>new g(m("ggqBsB",!0)),Syriac:()=>new g(m("g4BNC7BDCxIK",!0)),Tagalog:()=>new g(m("g4FVKA",!0)),Tagbanwa:()=>new g(m("g7FMCCCB",!0)),Tai_Le:()=>new g(m("wqGdDE",!0)),Tai_Tham:()=>new g(m("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new g(m("g0qBiCZE",!0)),Tai_Yo:()=>new g(m("g25DeCVJB",!0)),Takri:()=>new g(m("g0lC5BHJ",!0)),Tamil:()=>new g(m("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new g(m("wz6CuCCJ",!0)),Tangut:()=>new g(m("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new g(m("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new g(m("g8BxB",!0)),Thai:()=>new g(m("hwD5BGb",!0)),Tibetan:()=>new g(m("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new g(m("wpL3BIBPA",!0)),Tirhuta:()=>new g(m("gklCnCJJ",!0)),Todhri:()=>new g(m("guhCzB",!0)),Tolong_Siki:()=>new g(m("wtnCrBFJ",!0)),Toto:()=>new g(m("w04De",!0)),Tulu_Tigalari:()=>new g(m("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new g(m("g8gCdCA",!0)),Unknown:()=>new g(m("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new g(m("gopBrJ",!0)),Vithkuqi:()=>new g(m("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new g(m("g24D5BGA",!0)),Warang_Citi:()=>new g(m("glmCyCNA",!0)),Yezidi:()=>new g(m("g0jCpBCCDB",!0)),Yi:()=>new g(m("ggoBskBE2B",!0)),Zanabazar_Square:()=>new g(m("gwmCnC",!0))})),G(Rn,"FOLD_CATEGORIES",new io({L:()=>new g(m("laA",!0)),LC:()=>new g(m("laA",!0)),Ll:()=>new g(m("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new g(m("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new g(m("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new g(m("5cgBgBlgHAB",!1)),Mn:()=>new g(m("5cgBgBlgHAB",!1)),Emoji:()=>new g(m("8mJA",!0)),Extended_Pictographic:()=>new g(m("8mJA",!0)),Lowercase:()=>new g(m("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new g(m("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new g(m("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))})),G(Rn,"FOLD_SCRIPT",new io({Common:()=>new g(m("8cgBgB",!1)),Greek:()=>new g(m("1FwUwU",!1)),Inherited:()=>new g(m("5cgBgBlgHAB",!1))})),Rn),Ee,z=(Ee=class{static is32(e,t){let r=0,s=e.length;for(;r<s;){const i=r+Math.floor((s-r)/2),o=e.getLo(i),B=e.getHi(i);if(o<=t&&t<=B){const u=e.getStride(i);return(t-o)%u===0}t<o?s=i:r=i+1}return!1}static is(e,t){if(t<=Ee.MAX_LATIN1){for(let r=0;r<e.length;r++){if(t>e.getHi(r))continue;const s=e.getLo(r);if(t<s)return!1;const i=e.getStride(r);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&Ee.is32(e,t)}static isUpper(e){if(e<=Ee.MAX_LATIN1){const t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return Ee.is(ut.Upper,e)}static isPrint(e){return e<=Ee.MAX_LATIN1?e>=32&&e<Ee.MAX_ASCII||e>=161&&e!==173:Ee.is(ut.Print,e)}static simpleFold(e){if(ut.CASE_ORBIT.has(e))return ut.CASE_ORBIT.get(e);const t=O.toLowerCase(e);return t!==e?t:O.toUpperCase(e)}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=Ee.MAX_ASCII&&t<=Ee.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let r=Ee.simpleFold(e);r!==e;r=Ee.simpleFold(r))if(r===t)return!0;return!1}},G(Ee,"MAX_RUNE",1114111),G(Ee,"MAX_ASCII",127),G(Ee,"MAX_LATIN1",255),G(Ee,"MAX_BMP",65535),G(Ee,"MIN_FOLD",65),G(Ee,"MAX_FOLD",125251),G(Ee,"MIN_HIGH_SURROGATE",55296),G(Ee,"MAX_HIGH_SURROGATE",56319),G(Ee,"MIN_LOW_SURROGATE",56320),G(Ee,"MAX_LOW_SURROGATE",57343),G(Ee,"MIN_SUPPLEMENTARY_CODE_POINT",65536),Ee);const Eu=256,QC=new Uint8Array(Eu);for(let n=0;n<Eu;n++)QC[n]=97<=n&&n<=122||65<=n&&n<=90||48<=n&&n<=57||n===95?1:0;let cB=null,lB=null;var ye,W=(ye=class{static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||e instanceof Uint8Array}static isalnum(e){return O.CODES.get("0")<=e&&e<=O.CODES.get("9")||O.CODES.get("a")<=e&&e<=O.CODES.get("z")||O.CODES.get("A")<=e&&e<=O.CODES.get("Z")}static unhex(e){return O.CODES.get("0")<=e&&e<=O.CODES.get("9")?e-O.CODES.get("0"):O.CODES.get("a")<=e&&e<=O.CODES.get("f")?e-O.CODES.get("a")+10:O.CODES.get("A")<=e&&e<=O.CODES.get("F")?e-O.CODES.get("A")+10:-1}static escapeRune(e){let t="";if(z.isPrint(e))ye.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case O.CODES.get('"'):t+='\\"';break;case O.CODES.get("\\"):t+="\\\\";break;case O.CODES.get("	"):t+="\\t";break;case O.CODES.get(`
`):t+="\\n";break;case O.CODES.get("\r"):t+="\\r";break;case O.CODES.get("\b"):t+="\\b";break;case O.CODES.get("\f"):t+="\\f";break;default:{let r=e.toString(16);e<256?(t+="\\x",r.length===1&&(t+="0"),t+=r):t+=`\\x{${r}}`;break}}return t}static stringToRunes(e){const t=String(e),r=[];let s=0;for(;s<t.length;){const i=t.codePointAt(s);r.push(i),s+=i>z.MAX_BMP?2:1}return r}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<Eu?QC[e]===1:!1}static emptyOpContext(e,t){let r=0;return e<0&&(r|=ye.EMPTY_BEGIN_TEXT|ye.EMPTY_BEGIN_LINE),e===10&&(r|=ye.EMPTY_BEGIN_LINE),t<0&&(r|=ye.EMPTY_END_TEXT|ye.EMPTY_END_LINE),t===10&&(r|=ye.EMPTY_END_LINE),ye.isWordRune(e)!==ye.isWordRune(t)?r|=ye.EMPTY_WORD_BOUNDARY:r|=ye.EMPTY_NO_WORD_BOUNDARY,r}static quoteMeta(e){return e.split("").map(t=>ye.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>z.MAX_BMP?2:1}static toArray(e){const t=e.length,r=new Array(t);for(let s=0;s<t;s++)r[s]=e[s];return r}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return cB||(cB=new TextEncoder),cB.encode(e);{let t=[],r=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===z.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===z.MIN_LOW_SURROGATE?(i=z.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){lB||(lB=new TextDecoder("utf-8"));const t=e instanceof Uint8Array?e:new Uint8Array(e);return lB.decode(t)}else{let t=[],r=0,s=0;for(;r<e.length;){let i=e[r++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[r++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[r++],B=e[r++],u=e[r++],c=((i&7)<<18|(o&63)<<12|(B&63)<<6|u&63)-z.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode(z.MIN_HIGH_SURROGATE+(c>>10)),t[s++]=String.fromCharCode(z.MIN_LOW_SURROGATE+(c&1023))}else{let o=e[r++],B=e[r++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|B&63)}}return t.join("")}}},G(ye,"METACHARACTERS","\\.+*?()|[]{}^$"),G(ye,"EMPTY_BEGIN_LINE",1),G(ye,"EMPTY_END_LINE",2),G(ye,"EMPTY_BEGIN_TEXT",4),G(ye,"EMPTY_END_TEXT",8),G(ye,"EMPTY_WORD_BOUNDARY",16),G(ye,"EMPTY_NO_WORD_BOUNDARY",32),G(ye,"EMPTY_ALL",-1),ye);const WC=(n=[],e=0)=>{const t=Object.create(null);for(let r=0;r<n.length;r++){const s=n[r],i=e+r;t[s]=i,t[i]=s}return Object.freeze(t)};var kn,Tr=(kn=class{getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===kn.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===kn.Encoding.UTF_16}},G(kn,"Encoding",WC(["UTF_16","UTF_8"])),kn),ah=class extends Tr{constructor(n=null){super(),this.bytes=n}getEncoding(){return Tr.Encoding.UTF_8}asCharSequence(){return W.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},tw=class extends Tr{constructor(n=null){super(),this.charSequence=n}getEncoding(){return Tr.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return W.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},Cr=class{static utf16(n){return new tw(n)}static utf8(n){return W.isByteArray(n)?new ah(n):new ah(W.stringToUtf8ByteArray(n))}},rt=class{static EOF(){return-8}constructor(){this.end=0}canCheckPrefix(){return!0}endPos(){return this.end}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},nw=class extends rt{constructor(n,e=0,t=n.length){super(),this.bytes=n,this.start=e,this.end=t}hasString(n,e){const t=n.bytes;if(t.length===0)return!0;const r=this.indexOf(this.bytes,t,this.start+e);return r!==-1&&r<=this.end-t.length}hasAnyString(n,e){return n.ac8?n.ac8.searchUTF8(this.bytes,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return rt.EOF();const e=this.bytes[n]&255;if(e<128)return e<<3|1;if(e>=194&&e<=223&&n+1<this.end){const t=this.bytes[n+1]&255;return(t&192)!==128?e<<3|1:((e&31)<<6|t&63)<<3|2}else if(e>=224&&e<=239&&n+2<this.end){const t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;const r=this.bytes[n+2]&255;return(r&192)!==128?e<<3|1:((e&15)<<12|(t&63)<<6|r&63)<<3|3}else if(e>=240&&e<=244&&n+3<this.end){const t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;const r=this.bytes[n+2]&255;if((r&192)!==128)return e<<3|1;const s=this.bytes[n+3]&255;return(s&192)!==128?e<<3|1:((e&7)<<18|(t&63)<<12|(r&63)<<6|s&63)<<3|4}else return e<<3|1}index(n,e){e+=this.start;const t=this.indexOf(this.bytes,n.prefixUTF8,e);return t<0?t:t-e}context(n){n+=this.start;let e=-1;if(n>this.start&&n<=this.end){let r=n-1;if(e=this.bytes[r--],e>=128){let s=n-4;for(s<this.start&&(s=this.start);r>=s&&(this.bytes[r]&192)===128;)r--;r<this.start&&(r=this.start),e=this.step(r-this.start)>>3}}const t=n<this.end?this.step(n-this.start)>>3:-1;return W.emptyOpContext(e,t)}indexOf(n,e,t=0){let r=e.length;if(r===0)return t<=this.end?t:-1;const s=e[0];let i=this.end-r;const o=typeof n.indexOf=="function";let B=t;for(;B<=i;){if(o){if(B=n.indexOf(s,B),B===-1||B>i)return-1}else{for(;B<=i&&n[B]!==s;)B++;if(B>i)return-1}let u=!0;for(let c=1;c<r;c++)if(n[B+c]!==e[c]){u=!1;break}if(u)return B;B++}return-1}prefixLength(n){return n.prefixUTF8.length}},rw=class extends rt{constructor(n,e=0,t=n.length){super(),this.charSequence=n,this.start=e,this.end=t}hasString(n,e){const t=this.charSequence.indexOf(n.str,this.start+e);return t!==-1&&t<=this.end-n.str.length}hasAnyString(n,e){return n.ac16?n.ac16.searchUTF16(this.charSequence,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return rt.EOF();const e=this.charSequence.charCodeAt(n);if(e<z.MIN_HIGH_SURROGATE||e>z.MAX_HIGH_SURROGATE||n+1>=this.end)return e<<3|1;const t=this.charSequence.charCodeAt(n+1);return t>=z.MIN_LOW_SURROGATE&&t<=z.MAX_LOW_SURROGATE?(e-z.MIN_HIGH_SURROGATE)*1024+(t-z.MIN_LOW_SURROGATE)+z.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(n,e){e+=this.start;const t=this.charSequence.indexOf(n.prefix,e);return t<0||t>this.end-n.prefix.length?-1:t-e}context(n){n+=this.start;const e=n>this.start&&n<=this.end?this.charSequence.charCodeAt(n-1):-1,t=n<this.end?this.charSequence.charCodeAt(n):-1;return W.emptyOpContext(e,t)}prefixLength(n){return n.prefix.length}},Ie=class{static fromUTF8(n,e=0,t=n.length){return new nw(n,e,t)}static fromUTF16(n,e=0,t=n.length){return new rw(n,e,t)}},yi=class extends Error{constructor(n){super(n),this.name="RE2JSException"}},_e=class extends yi{constructor(n,e=null){let t=`error parsing regexp: ${n}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=n,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},sw=class extends yi{constructor(n){super(n),this.name="RE2JSCompileException"}},Bt=class extends yi{constructor(n){super(n),this.name="RE2JSGroupException"}},iw=class extends yi{constructor(n){super(n),this.name="RE2JSFlagsException"}},Ks=class extends yi{constructor(n){super(n),this.name="RE2JSInternalException"}},gr,Bh=(gr=class{static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(r=>{const s=r.codePointAt(0);return s===O.CODES.get("\\")||s===O.CODES.get("$")?`\\${r}`:r}).join(""):e.indexOf("$")<0?e:e.split("").map(r=>r.codePointAt(0)===O.CODES.get("$")?"$$":r).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;const r=this.patternInput.re2();this.patternGroupCount=r.numberOfCapturingGroups(),this.groups=[],this.namedGroups=r.namedGroups,this.numberOfInstructions=r.numberOfInstructions(),t instanceof Tr?this.resetMatcherInput(t):W.isByteArray(t)?this.resetMatcherInput(Cr.utf8(t)):this.resetMatcherInput(Cr.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof Tr||(W.isByteArray(e)?e=Cr.utf8(e):e=Cr.utf16(e)),this.matcherInput=e,this.reset(),this}start(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new Bt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new Bt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){const s=this.namedGroups[e];if(!Number.isFinite(s))throw new Bt(`group '${e}' not found`);e=s}const t=this.start(e),r=this.end(e);return t<0&&r<0?null:this.substring(t,r)}getNamedGroups(){if(!this.hasMatch)throw new Bt("perhaps no match attempted");const e=Object.create(null);for(const t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(e<0||e>this.patternGroupCount)throw new Bt(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new Bt("perhaps no match attempted");if(e===0||this.hasGroups)return;const t=this.matcherInputLength,r=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount);if(!r[0])throw new Bt("inconsistency in matching group data");this.groups=r[1],this.hasGroups=!0}matches(){return this.genMatch(0,V.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,V.ANCHOR_START)}find(e=null){if(e!==null){if(e<0||e>this.matcherInputLength)throw new Bt(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){const t=(this.matcherInput.isUTF16Encoding()?Ie.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):Ie.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,V.UNANCHORED)}genMatch(e,t){const r=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1);return r[0]?(this.groups=r[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?W.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let r="";const s=this.start(),i=this.end();return this.appendPos<s&&(r+=this.substring(this.appendPos,s)),this.appendPos=i,r+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),r}appendReplacementInternalJava(e){let t="",r=0;const s=e.length;let i=0;for(;i<s;){const o=e.codePointAt(i);if(o===O.CODES.get("\\")){if(r<i&&(t+=e.substring(r,i)),i++,i>=s)throw new Bt("character to be escaped is missing");r=i,i++;continue}if(o===O.CODES.get("$")){if(r<i&&(t+=e.substring(r,i)),i+1>=s)throw new Bt("Illegal group reference: group index is missing");const B=e.codePointAt(i+1);if(O.CODES.get("0")<=B&&B<=O.CODES.get("9")){let u=B-O.CODES.get("0"),c=i+2;for(;c<s;c++){const C=e.codePointAt(c);if(C<O.CODES.get("0")||C>O.CODES.get("9")||u*10+C-O.CODES.get("0")>this.patternGroupCount)break;u=u*10+C-O.CODES.get("0")}if(u>this.patternGroupCount)throw new Bt(`n > number of groups: ${u}`);const h=this.group(u);h!==null&&(t+=h),i=c,r=i}else if(B===O.CODES.get("{")){let u=i+2;for(;u<s&&e.codePointAt(u)!==O.CODES.get("}");)u++;if(u>=s)throw new Bt("named capture group is missing trailing '}'");const c=e.substring(i+2,u),h=this.group(c);h!==null&&(t+=h),i=u+1,r=i}else throw new Bt("Illegal group reference");continue}i++}return r<s&&(t+=e.substring(r,s)),t}appendReplacementInternalJs(e){let t="",r=0;const s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===O.CODES.get("$")){let o=e.codePointAt(i+1);if(O.CODES.get("$")===o){r<i&&(t+=e.substring(r,i)),t+="$",i++,r=i+1;continue}else if(O.CODES.get("&")===o){r<i&&(t+=e.substring(r,i));const B=this.group(0);B!==null?t+=B:t+="$&",i++,r=i+1;continue}else if(O.CODES.get("`")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(0,this.start(0)),i++,r=i+1;continue}else if(O.CODES.get("'")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(this.end(0),this.matcherInputLength),i++,r=i+1;continue}else if(O.CODES.get("1")<=o&&o<=O.CODES.get("9")){let B=o-O.CODES.get("0");for(r<i&&(t+=e.substring(r,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<O.CODES.get("0")||o>O.CODES.get("9")||B*10+o-O.CODES.get("0")>this.patternGroupCount));i++)B=B*10+o-O.CODES.get("0");if(B>this.patternGroupCount){t+=`$${B}`,r=i,i--;continue}const u=this.group(B);u!==null&&(t+=u),r=i,i--;continue}else if(o===O.CODES.get("<")){r<i&&(t+=e.substring(r,i)),i++;let B=i+1;for(;B<e.length&&e.codePointAt(B)!==O.CODES.get(">")&&e.codePointAt(B)!==O.CODES.get(" ");)B++;if(B===e.length||e.codePointAt(B)!==O.CODES.get(">")){t+=e.substring(i-1,B+1),r=B+1,i=B;continue}const u=e.substring(i+1,B);if(Object.prototype.hasOwnProperty.call(this.namedGroups,u)){const c=this.group(u);c!==null&&(t+=c)}else t+=`$<${u}>`;r=B+1,i=B;continue}}return r<s&&(t+=e.substring(r,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,r=!1){let s="";this.reset();const i=typeof e=="function",o=Object.keys(this.namedGroups).length>0;let B=null;if(i){if(this.groupCount()>=gr.MAX_REPLACER_ARGS)throw new Bt("Too many capture groups to safely invoke replacer function");B=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o,B):this.appendReplacement(e,r),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t,r){let s="";const i=this.start(),o=this.end();this.appendPos<i&&(s+=this.substring(this.appendPos,i)),this.appendPos=o;const B=this.buildReplacerArgs(i,t,r);return s+=String(e(...B)),s}buildReplacerArgs(e,t,r){const s=[this.group(0)],i=this.groupCount();for(let o=1;o<=i;o++){const B=this.start(o);B<0?s.push(void 0):s.push(this.substring(B,this.end(o)))}if(s.push(e),s.push(r),t){const o=this.getNamedGroups();for(const B in o)o[B]===null&&(o[B]=void 0);s.push(o)}return s}},G(gr,"MAX_REPLACER_ARGS",65535),gr),ce,N=(ce=class{static isRuneOp(e){return ce.RUNE<=e&&e<=ce.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let r of e)t+=W.escapeRune(r);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=[],this.next=null}matchRune(e){if(this.runes.length===1){const o=this.runes[0];return(this.arg&V.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e):e===o}const t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let r=0,s=t>>1;for(;s>1;){const o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;const i=r-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){const o=this.runes[0];return(this.arg&V.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}const t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let r=0,s=t>>1;for(;s>1;){const o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;const i=r-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case ce.ALT:return`alt -> ${this.out}, ${this.arg}`;case ce.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case ce.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case ce.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case ce.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case ce.FAIL:return"fail";case ce.NOP:return`nop -> ${this.out}`;case ce.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case ce.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case ce.RUNE:return this.runes===null?"rune <null>":["rune ",ce.escapeRunes(this.runes),(this.arg&V.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case ce.RUNE1:return`rune1 ${ce.escapeRunes(this.runes)} -> ${this.out}`;case ce.RUNE_ANY:return`any -> ${this.out}`;case ce.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},G(ce,"ALT",1),G(ce,"ALT_MATCH",2),G(ce,"CAPTURE",3),G(ce,"EMPTY_WIDTH",4),G(ce,"FAIL",5),G(ce,"MATCH",6),G(ce,"NOP",7),G(ce,"RUNE",8),G(ce,"RUNE1",9),G(ce,"RUNE_ANY",10),G(ce,"RUNE_ANY_NOT_NL",11),G(ce,"LB_WRITE",12),G(ce,"LB_CHECK",13),ce),uh=class{constructor(n){this.sparse=new Int32Array(n),this.densePcs=new Int32Array(n),this.denseCaps=null,this.size=0,this.ncap=0}init(n){this.ncap=n;const e=this.densePcs.length*n;(!this.denseCaps||this.denseCaps.length<e)&&(this.denseCaps=new Int32Array(e))}contains(n){const e=this.sparse[n];return e<this.size&&this.densePcs[e]===n}isEmpty(){return this.size===0}add(n){const e=this.size++;return this.sparse[n]=e,this.densePcs[e]=n,e}clear(){this.size=0}toString(){let n="{";for(let e=0;e<this.size;e++)e!==0&&(n+=", "),n+=this.densePcs[e];return n+="}",n}},ow=class VB{static fromRE2(e){const t=new VB;return t.prog=e.prog,t.re2=e,t.q0=new uh(t.prog.numInst()),t.q1=new uh(t.prog.numInst()),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}static fromMachine(e){return VB.fromRE2(e.re2)}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?W.emptyInts():W.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,r){const s=this.re2.cond;if(s===W.EMPTY_ALL||(r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);let i=this.prog.numLb>0?0:t,o=t,B=this.q0,u=this.q1,c=e.step(i),h=c>>3,C=c&7,p=-1,w=0;c!==rt.EOF()&&(c=e.step(i+C),p=c>>3,w=c&7);let A;for(i===0?A=W.emptyOpContext(-1,h):A=e.context(i);;){if(B.isEmpty()){if((s&W.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&i!==0||this.matched)break;if(this.prog.numLb===0&&this.re2.prefix.length!==0&&p!==this.re2.prefixRune&&e.canCheckPrefix()){const j=e.index(this.re2,i);if(j<0)break;i+=j,c=e.step(i),h=c>>3,C=c&7,c=e.step(i+C),p=c>>3,w=c&7,A=e.context(i)}}if(i===0&&this.prog.numLb>0)for(let j=0;j<this.prog.lbStarts.length;j++)this.add(B,this.prog.lbStarts[j],i,this.matchcap,0,A);!this.matched&&(i===0||r===V.UNANCHORED)&&i>=o&&(this.ncap>0&&(this.matchcap[0]=i),this.add(B,this.prog.start,i,this.matchcap,0,A));const L=i+C;if(A=e.context(L),this.step(B,u,i,L,h,A,r,i===e.endPos()),C===0||this.ncap===0&&this.matched)break;i+=C,h=p,C=w,h!==-1&&(c=e.step(i+C),p=c>>3,w=c&7);const M=B;B=u,u=M}return u.clear(),this.matched}matchSet(e,t,r){const s=this.re2.cond;if(s===W.EMPTY_ALL)return[];if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,B=this.q0,u=this.q1,c=e.step(i),h=c>>3,C=c&7,p=-1,w=0;c!==rt.EOF()&&(c=e.step(i+C),p=c>>3,w=c&7);let A=i===0?W.emptyOpContext(-1,h):e.context(i);const L=new Set;for(;!(B.isEmpty()&&((s&W.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&i!==0));){if(i===0&&this.prog.numLb>0)for(let ee=0;ee<this.prog.lbStarts.length;ee++)this.add(B,this.prog.lbStarts[ee],i,this.matchcap,0,A);(i===0||r===V.UNANCHORED)&&i>=o&&this.add(B,this.prog.start,i,this.matchcap,0,A);const M=i+C;A=e.context(M);for(let ee=0;ee<B.size;ee++){const se=B.densePcs[ee],Be=this.prog.inst[se],De=ee*this.ncap;let pe=!1;switch(Be.op){case N.MATCH:if(r===V.ANCHOR_BOTH&&i!==e.endPos())break;L.add(Be.arg);break;case N.RUNE:pe=Be.matchRune(h);break;case N.RUNE1:pe=h===Be.runes[0];break;case N.RUNE_ANY:pe=!0;break;case N.RUNE_ANY_NOT_NL:pe=h!==10;break;default:continue}pe&&this.add(u,Be.out,M,B.denseCaps,De,A)}if(B.clear(),C===0)break;i+=C,h=p,C=w,h!==-1&&(c=e.step(i+C),p=c>>3,w=c&7);const j=B;B=u,u=j}return u.clear(),Array.from(L).sort((M,j)=>M-j)}step(e,t,r,s,i,o,B,u){const c=this.re2.longest;for(let h=0;h<e.size;h++){const C=e.densePcs[h],p=h*this.ncap;if(c&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[p])continue;const w=this.prog.inst[C];let A=!1;switch(w.op){case N.MATCH:if(B===V.ANCHOR_BOTH&&!u)break;if(this.ncap>0&&(!c||!this.matched||this.matchcap[1]<r)){e.denseCaps[p+1]=r;for(let L=0;L<this.ncap;L++)this.matchcap[L]=e.denseCaps[p+L]}c||(e.size=0),this.matched=!0;break;case N.RUNE:A=w.matchRune(i);break;case N.RUNE1:A=i===w.runes[0];break;case N.RUNE_ANY:A=!0;break;case N.RUNE_ANY_NOT_NL:A=i!==10;break;default:continue}A&&this.add(t,w.out,s,e.denseCaps,p,o)}e.clear()}add(e,t,r,s,i,o){for(;;){if(t===0||e.contains(t))return;const B=e.add(t),u=this.prog.inst[t];switch(u.op){case N.FAIL:return;case N.ALT:case N.ALT_MATCH:this.add(e,u.out,r,s,i,o),t=u.arg;continue;case N.EMPTY_WIDTH:if((u.arg&~o)===0){t=u.out;continue}return;case N.NOP:t=u.out;continue;case N.CAPTURE:if(u.arg<this.ncap){const c=s[i+u.arg];s[i+u.arg]=r,this.add(e,u.out,r,s,i,o),s[i+u.arg]=c;return}else{t=u.out;continue}case N.LB_WRITE:this.lbTable[Math.abs(u.arg)]=r,t=u.out;continue;case N.LB_CHECK:if(u.arg>0){if(this.lbTable[u.arg]===r){t=u.out;continue}}else if(this.lbTable[-u.arg]!==r){t=u.out;continue}return;case N.MATCH:case N.RUNE:case N.RUNE1:case N.RUNE_ANY:case N.RUNE_ANY_NOT_NL:if(this.ncap>0){const c=B*this.ncap;for(let h=0;h<this.ncap;h++)e.denseCaps[c+h]=s[i+h]}return;default:throw new Ks("unhandled")}}}};const ch=n=>{let e=-2128831035;for(let t=0;t<n.length;t++)e^=n[t],e=Math.imul(e,16777619);return e},aw=(n,e)=>{if(n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t]!==e[t])return!1;return!0};var Bw=class{constructor(n,e,t=[]){this.nfaStates=n,this.isMatch=e,this.matchIDs=t,this.nextLatin1=new Array(z.MAX_LATIN1+1).fill(null),this.nextLatin1Anchored=new Array(z.MAX_LATIN1+1).fill(null),this.transKeys=[],this.transVals=[],this.lastSeen=0}},nn,uw=(nn=class{constructor(e,t=8388608){this.prog=e,this.stateCache=new Map,this.stateCount=0,this.startState=null,this.stateLimit=Math.max(1,Math.floor(t/nn.STATE_MEMORY_ESTIMATE)),this.cacheClears=0,this.failed=!1,this.clock=0}computeClosure(e){const t=new Set,r=[...e];let s=!1;const i=[];for(;r.length>0;){const B=r.pop();if(t.has(B))continue;t.add(B);const u=this.prog.getInst(B);switch(u.op){case N.MATCH:s=!0,i.includes(u.arg)||i.push(u.arg);break;case N.ALT:case N.ALT_MATCH:r.push(u.out),r.push(u.arg);break;case N.NOP:case N.CAPTURE:r.push(u.out);break;case N.EMPTY_WIDTH:case N.LB_WRITE:case N.LB_CHECK:return null}}const o=Int32Array.from(t).sort();return i.sort((B,u)=>B-u),{pcs:o,isMatch:s,matchIDs:i}}getState(e){const t=this.computeClosure(e);if(!t)return null;const r=t.pcs,s=ch(r);let i=this.stateCache.get(s);if(i)for(let B=0;B<i.length;B++){const u=i[B];if(aw(u.nfaStates,r))return u.lastSeen=++this.clock,u}else i=[],this.stateCache.set(s,i);if(this.failed)return null;if(this.stateCount>=this.stateLimit){if(this.cacheClears++,this.cacheClears>=nn.MAX_CACHE_CLEARS)return this.failed=!0,this.stateCache.clear(),this.stateCount=0,this.startState=null,null;this.evictCache(),i=this.stateCache.get(s),i||(i=[],this.stateCache.set(s,i))}const o=new Bw(r,t.isMatch,t.matchIDs);return o.lastSeen=++this.clock,i.push(o),this.stateCount++,o}evictCache(){const e=[];for(const o of this.stateCache.values())for(let B=0;B<o.length;B++)e.push(o[B]);e.sort((o,B)=>o.lastSeen-B.lastSeen);const t=Math.max(1,Math.floor(this.stateLimit/2)),r=e.length-t,s=e.slice(r),i=new Set(s);this.stateCache.clear(),this.stateCount=0;for(let o=0;o<s.length;o++){const B=s[o];B.nextLatin1.fill(null),B.nextLatin1Anchored.fill(null),B.transKeys.length=0,B.transVals.length=0;const u=ch(B.nfaStates);let c=this.stateCache.get(u);c||(c=[],this.stateCache.set(u,c)),c.push(B),this.stateCount++}this.startState&&!i.has(this.startState)&&(this.startState=null)}step(e,t,r){if(t<=z.MAX_LATIN1)if(r===V.UNANCHORED){const o=e.nextLatin1[t];if(o!==null)return o}else{const o=e.nextLatin1Anchored[t];if(o!==null)return o}else{const o=t+(r===V.UNANCHORED?0:z.MAX_RUNE+1),B=e.transKeys,u=B.length;for(let c=0;c<u;c++)if(B[c]===o)return e.transVals[c]}const s=[];for(let o=0;o<e.nfaStates.length;o++){const B=e.nfaStates[o],u=this.prog.getInst(B);N.isRuneOp(u.op)&&u.matchRune(t)&&s.push(u.out)}r===V.UNANCHORED&&s.push(this.prog.start);const i=this.getState(s);if(t<=z.MAX_LATIN1)r===V.UNANCHORED?e.nextLatin1[t]=i:e.nextLatin1Anchored[t]=i;else{const o=t+(r===V.UNANCHORED?0:z.MAX_RUNE+1);e.transKeys.push(o),e.transVals.push(i)}return i}match(e,t,r){if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return!1;if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;if(i.isMatch)if(r===V.ANCHOR_BOTH){if(t===s)return!0}else return!0;let o=t;for(;o<s;){const B=e.step(o),u=B>>3,c=B&7;if(c===0)break;if(i=r===V.UNANCHORED&&u<=z.MAX_LATIN1&&i.nextLatin1[u]||this.step(i,u,r),i===null)return null;if(i.lastSeen=++this.clock,i.isMatch)if(r===V.ANCHOR_BOTH){if(o+c===s)return!0}else return!0;if(i.nfaStates.length===0&&r!==V.UNANCHORED)return!1;o+=c}return!1}matchSet(e,t,r){if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return[];if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;const o=new Set,B=(c,h)=>{c.isMatch&&(r===V.ANCHOR_BOTH?h===s&&c.matchIDs.forEach(C=>o.add(C)):c.matchIDs.forEach(C=>o.add(C)))};B(i,t);let u=t;for(;u<s;){const c=e.step(u),h=c>>3,C=c&7;if(C===0)break;if(i=r===V.UNANCHORED&&h<=z.MAX_LATIN1&&i.nextLatin1[h]||this.step(i,h,r),i===null)return null;if(i.lastSeen=++this.clock,u+=C,B(i,u),i.nfaStates.length===0&&r!==V.UNANCHORED)break}return Array.from(o).sort((c,h)=>c-h)}},G(nn,"MAX_CACHE_CLEARS",5),G(nn,"STATE_MEMORY_ESTIMATE",838),nn);const cw=32,lw=500,hB=256,hw=256*1024;var fw=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array(hB),this.jobArg=new Uint8Array(hB),this.jobPos=new Int32Array(hB),this.jobLen=0,this.visited=new Uint32Array(0)}reset(n,e,t){this.end=e,this.jobLen=0,this.ncap=t;const r=n.numInst()*(e+1)+cw-1>>>5;this.visited.length<r?this.visited=new Uint32Array(r):this.visited.fill(0,0,r),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(n,e){const t=n*(this.end+1)+e,r=t>>>5,s=1<<(t&31);return(this.visited[r]&s)!==0?!1:(this.visited[r]|=s,!0)}push(n,e,t,r){if(n.prog.getInst(e).op!==N.FAIL&&(r||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){const s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;const o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;const B=new Int32Array(s);B.set(this.jobPos),this.jobPos=B}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=r?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(n,e,t,r,s){const i=n.longest;for(this.push(n,t,r,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],B=this.jobArg[this.jobLen]===1,u=this.jobPos[this.jobLen],c=!0;for(;!(!c&&!this.shouldVisit(o,u));){c=!1;const h=n.prog.getInst(o);switch(h.op){case N.FAIL:throw new Ks("unexpected InstFail");case N.ALT:if(B){B=!1,o=h.arg;continue}else{this.push(n,o,u,!0),o=h.out;continue}case N.ALT_MATCH:{const C=n.prog.getInst(h.out);if(N.isRuneOp(C.op)){this.push(n,h.arg,u,!1),o=h.arg,u=this.end;continue}this.push(n,h.out,this.end,!1),o=h.out;continue}case N.RUNE:{const C=e.step(u);if(C===rt.EOF()||!h.matchRune(C>>3))break;u+=C&7,o=h.out;continue}case N.RUNE1:{const C=e.step(u);if(C===rt.EOF()||C>>3!==h.runes[0])break;u+=C&7,o=h.out;continue}case N.RUNE_ANY_NOT_NL:{const C=e.step(u);if(C===rt.EOF()||C>>3===10)break;u+=C&7,o=h.out;continue}case N.RUNE_ANY:{const C=e.step(u);if(C===rt.EOF())break;u+=C&7,o=h.out;continue}case N.CAPTURE:if(B){this.cap[h.arg]=u;break}else{h.arg<this.ncap&&(this.push(n,o,this.cap[h.arg],!0),this.cap[h.arg]=u),o=h.out;continue}case N.EMPTY_WIDTH:{const C=e.context(u);if((h.arg&~C)!==0)break;o=h.out;continue}case N.NOP:o=h.out;continue;case N.MATCH:{if(s===V.ANCHOR_BOTH&&u!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=u);const C=this.matchcap[1];if((C===-1||i&&u>0&&u>C)&&this.matchcap.set(this.cap),!i||u===this.end)return!0;break}case N.LB_WRITE:case N.LB_CHECK:throw new Ks("Backtracker cannot evaluate Lookbehind instructions");default:throw new Ks("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}};const oo=[];var ao=class $C{static shouldBacktrack(e){return e.numInst()<=lw}static maxBitStateLen(e){return $C.shouldBacktrack(e)?Math.floor(hw/e.numInst()):0}static execute(e,t,r,s,i){const o=e.cond;if(o===W.EMPTY_ALL||(s===V.ANCHOR_START||s===V.ANCHOR_BOTH)&&r!==0||(o&W.EMPTY_BEGIN_TEXT)!==0&&r!==0)return null;const B=oo.length>0?oo.pop():new fw,u=t.endPos();B.reset(e.prog,u,i);let c=!1;if((o&W.EMPTY_BEGIN_TEXT)!==0||s===V.ANCHOR_START||s===V.ANCHOR_BOTH)B.ncap>0&&(B.cap[0]=r),B.tryBacktrack(e,t,e.prog.start,r,s)&&(c=!0);else{let C=-1;for(;r<=u&&C!==0;r+=C){if(e.prefix.length>0){const w=t.index(e,r);if(w<0)break;r+=w}if(B.ncap>0&&(B.cap[0]=r),B.tryBacktrack(e,t,e.prog.start,r,s)){c=!0;break}const p=t.step(r);C=p===rt.EOF()?0:p&7}}if(!c)return oo.push(B),null;const h=i===0?[]:W.toArray(B.matchcap.subarray(0,i));return oo.push(B),h}},lh=class{constructor(n){this.sparse=new Uint32Array(n),this.dense=new Uint32Array(n),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(n){return n<this.sparse.length&&this.sparse[n]<this.size&&this.dense[this.sparse[n]]===n}insert(n){this.contains(n)||this.insertNew(n)}insertNew(n){n>=this.sparse.length||(this.sparse[n]=this.size,this.dense[this.size]=n,this.size++)}};const Cw=(n,e,t,r)=>{const s=n.length,i=e.length;let o=0,B=0;const u=[],c=[];let h=!0,C=-1;const p=w=>{const A=w?n:e,L=w?o:B,M=w?t:r;return C>0&&A[L]<=u[C]?!1:(u.push(A[L],A[L+1]),w?o+=2:B+=2,C+=2,c.push(M),!0)};for(;o<s||B<i;)if(B>=i?h=p(!0):o>=s||e[B]<n[o]?h=p(!1):h=p(!0),!h)return null;return{merged:u,next:c}};var dw=class{constructor(n){this.start=n.start,this.numCap=n.numCap,this.inst=new Array(n.inst.length);for(let e=0;e<n.inst.length;e++){const t=n.inst[e],r=new N(t.op);r.out=t.out,r.arg=t.arg,r.runes=t.runes?t.runes.slice():[],r.next=null,this.inst[e]=r}}};const pw=n=>{const e=new dw(n);for(let t=0;t<e.inst.length;t++){const r=e.inst[t];if(r.op!==N.ALT&&r.op!==N.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[r[i]];if(o.op!==N.ALT&&o.op!==N.ALT_MATCH&&(s="arg",i="out",o=e.inst[r[i]],o.op!==N.ALT&&o.op!==N.ALT_MATCH))continue;const B=e.inst[r[s]];if(B.op===N.ALT||B.op===N.ALT_MATCH)continue;let u="out",c="arg",h=!1;o.out===t?h=!0:o.arg===t&&(h=!0,u="arg",c="out"),h&&(o[u]=r[s]),r[s]===o[u]&&(r[i]=o[c])}return e},gw=n=>{if(n.inst.length>=1e3)return null;const e=new lh(n.inst.length),t=new lh(n.inst.length),r=new Array(n.inst.length),s=new Array(n.inst.length).fill(!1),i=o=>{let B=!0;const u=n.inst[o];if(t.contains(o))return!0;switch(t.insert(o),u.op){case N.ALT:case N.ALT_MATCH:{B=i(u.out)&&i(u.arg);let c=s[u.out],h=s[u.arg];if(c&&h)return!1;if(h){const A=u.out;u.out=u.arg,u.arg=A;const L=c;c=h,h=L}c&&(s[o]=!0,u.op=N.ALT_MATCH);const C=r[u.out]||[],p=r[u.arg]||[],w=Cw(C,p,u.out,u.arg);if(!w)return!1;r[o]=w.merged,u.next=new Uint32Array(w.next);break}case N.CAPTURE:case N.EMPTY_WIDTH:case N.NOP:B=i(u.out),s[o]=s[u.out],r[o]=r[u.out]?r[u.out].slice():[],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break;case N.MATCH:case N.FAIL:s[o]=u.op===N.MATCH;break;case N.RUNE:{if(s[o]=!1,u.next&&u.next.length>0)break;if(e.insert(u.out),!u.runes||u.runes.length===0){r[o]=[],u.next=new Uint32Array([u.out]);break}let c=[];if(u.runes.length===1&&(u.arg&V.FOLD_CASE)!==0){const h=u.runes[0];c.push(h,h);for(let C=z.simpleFold(h);C!==h;C=z.simpleFold(C))c.push(C,C);c.sort((C,p)=>C-p)}else for(let h=0;h<u.runes.length;h++)c.push(u.runes[h]);r[o]=c,u.next=new Uint32Array(Math.floor(c.length/2)+1).fill(u.out),u.op=N.RUNE;break}case N.RUNE1:{if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out);let c=[];if((u.arg&V.FOLD_CASE)!==0){const h=u.runes[0];c.push(h,h);for(let C=z.simpleFold(h);C!==h;C=z.simpleFold(C))c.push(C,C);c.sort((C,p)=>C-p)}else c.push(u.runes[0],u.runes[0]);r[o]=c,u.next=new Uint32Array(Math.floor(c.length/2)+1).fill(u.out),u.op=N.RUNE;break}case N.RUNE_ANY:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,z.MAX_RUNE],u.next=new Uint32Array([u.out]);break;case N.RUNE_ANY_NOT_NL:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,9,11,z.MAX_RUNE],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break}return B};for(e.clear(),e.insert(n.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<n.inst.length;o++)r[o]&&(n.inst[o].runes=r[o]);return n},mw=(n,e)=>{for(let t=0;t<e.inst.length;t++){const r=e.inst[t];switch(r.op){case N.ALT:case N.ALT_MATCH:case N.RUNE:break;case N.CAPTURE:case N.EMPTY_WIDTH:case N.NOP:case N.MATCH:case N.FAIL:n.inst[t].next=null;break;case N.RUNE1:case N.RUNE_ANY:case N.RUNE_ANY_NOT_NL:n.inst[t].next=null,n.inst[t].op=r.op,n.inst[t].runes=r.runes?r.runes.slice():[];break}}};var hh=class YC{static compile(e){if(e.start===0||e.numLb>0)return null;const t=e.inst[e.start];if(t.op!==N.EMPTY_WIDTH||(t.arg&W.EMPTY_BEGIN_TEXT)===0)return null;let r=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===N.ALT||e.inst[i].op===N.ALT_MATCH){r=!0;break}for(let i=0;i<e.inst.length;i++){const o=e.inst[i],B=e.inst[o.out].op;switch(o.op){case N.ALT:case N.ALT_MATCH:if(B===N.MATCH||e.inst[o.arg].op===N.MATCH)return null;break;case N.EMPTY_WIDTH:if(B===N.MATCH){if((o.arg&W.EMPTY_END_TEXT)===W.EMPTY_END_TEXT)continue;return null}break;default:if(B===N.MATCH&&r)return null;break}}let s=pw(e);return s=gw(s),s!==null&&mw(s,e),s}static next(e,t){const r=e.matchRunePos(t);return r>=0?e.next[r]:e.op===N.ALT_MATCH?e.out:0}static execute(e,t,r,s,i){const o=e.onepass;if(!o)return null;const B=new Int32Array(i).fill(-1);let u=!1,c=t.step(r),h=c>>3,C=c&7,p=rt.EOF(),w=-1,A=0;c!==rt.EOF()&&(p=t.step(r+C),p!==rt.EOF()&&(w=p>>3,A=p&7));let L=r===0?W.emptyOpContext(-1,h):t.context(r),M=o.start,j;for(;;){switch(j=o.inst[M],M=j.out,j.op){case N.MATCH:return s===V.ANCHOR_BOTH&&r!==t.endPos()?null:(u=!0,B.length>0&&(B[0]=0,B[1]=r),i===0?[]:W.toArray(B));case N.RUNE:if(!j.matchRune(h))return null;break;case N.RUNE1:if(h!==j.runes[0])return null;break;case N.RUNE_ANY:break;case N.RUNE_ANY_NOT_NL:if(h===10)return null;break;case N.ALT:case N.ALT_MATCH:M=YC.next(j,h);continue;case N.FAIL:return null;case N.NOP:continue;case N.EMPTY_WIDTH:if((j.arg&~L)!==0)return null;continue;case N.CAPTURE:j.arg<B.length&&(B[j.arg]=r);continue;default:throw new Ks("bad inst")}if(C===0)break;L=W.emptyOpContext(h,w),r+=C,h=w,C=A,h!==-1&&(p=t.step(r+C),p!==rt.EOF()?(w=p>>3,A=p&7):(w=-1,A=0))}return u?i===0?[]:W.toArray(B):null}},Y,y=(Y=class{static isPseudoOp(e){return e>=Y.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===O.CODES.get("-")?"\\":""}static fromRegexp(e){const t=new Y(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=Y.emptySubs(),this.runes=[],this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=Y.emptySubs(),this.runes=[],this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case Y.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case Y.Op.EMPTY_MATCH:e+="(?:)";break;case Y.Op.STAR:case Y.Op.PLUS:case Y.Op.QUEST:case Y.Op.REPEAT:{const t=this.subs[0];switch(t.op>Y.Op.CAPTURE||t.op===Y.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case Y.Op.STAR:e+="*";break;case Y.Op.PLUS:e+="+";break;case Y.Op.QUEST:e+="?";break;case Y.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}";break}(this.flags&V.NON_GREEDY)!==0&&(e+="?");break}case Y.Op.CONCAT:for(let t of this.subs)t.op===Y.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case Y.Op.ALTERNATE:{let t="";for(let r of this.subs)e+=t,t="|",e+=r.appendTo();break}case Y.Op.LITERAL:(this.flags&V.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=W.escapeRune(t);(this.flags&V.FOLD_CASE)!==0&&(e+=")");break;case Y.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case Y.Op.ANY_CHAR:e+="(?s:.)";break;case Y.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case Y.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case Y.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==Y.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case Y.Op.BEGIN_TEXT:e+="\\A";break;case Y.Op.END_TEXT:(this.flags&V.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case Y.Op.BEGIN_LINE:e+="^";break;case Y.Op.END_LINE:e+="$";break;case Y.Op.WORD_BOUNDARY:e+="\\b";break;case Y.Op.NO_WORD_BOUNDARY:e+="\\B";break;case Y.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===z.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){const r=this.runes[t]+1,s=this.runes[t+1]-1;e+=Y.quoteIfHyphen(r),e+=W.escapeRune(r),r!==s&&(e+="-",e+=Y.quoteIfHyphen(s),e+=W.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){const r=this.runes[t],s=this.runes[t+1];e+=Y.quoteIfHyphen(r),e+=W.escapeRune(r),r!==s&&(e+="-",e+=Y.quoteIfHyphen(s),e+=W.escapeRune(s))}e+="]";break;default:e+=this.op;break}return e}maxCap(){let e=0;if(this.op===Y.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){const r=t.maxCap();e<r&&(e=r)}return e}equals(e){if(!(e!==null&&e instanceof Y)||this.op!==e.op)return!1;switch(this.op){case Y.Op.END_TEXT:if((this.flags&V.WAS_DOLLAR)!==(e.flags&V.WAS_DOLLAR))return!1;break;case Y.Op.LITERAL:case Y.Op.CHAR_CLASS:if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case Y.Op.ALTERNATE:case Y.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case Y.Op.STAR:case Y.Op.PLUS:case Y.Op.QUEST:if((this.flags&V.NON_GREEDY)!==(e.flags&V.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case Y.Op.REPEAT:if((this.flags&V.NON_GREEDY)!==(e.flags&V.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case Y.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case Y.Op.PLB:case Y.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1;break}return!0}},G(Y,"Op",WC(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"])),Y),fh=class{constructor(n){this.next=[Object.create(null)],this.fail=[0],this.match=[!1];for(const t of n){let r=0;for(let s=0;s<t.length;s++){const i=t[s];i in this.next[r]||(this.next.push(Object.create(null)),this.fail.push(0),this.match.push(!1),this.next[r][i]=this.next.length-1),r=this.next[r][i]}this.match[r]=!0}const e=[];for(const t in this.next[0])if(Object.prototype.hasOwnProperty.call(this.next[0],t)){const r=this.next[0][t];this.fail[r]=0,e.push(r)}for(;e.length>0;){const t=e.shift();for(const r in this.next[t])if(Object.prototype.hasOwnProperty.call(this.next[t],r)){const s=this.next[t][r];let i=this.fail[t];for(;i!==0&&!(r in this.next[i]);)i=this.fail[i];r in this.next[i]?this.fail[s]=this.next[i][r]:this.fail[s]=0,this.match[s]=this.match[s]||this.match[this.fail[s]],e.push(s)}}}searchUTF16(n,e,t){let r=0;for(let s=e;s<t;s++){const i=n.charCodeAt(s);for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}searchUTF8(n,e,t){let r=0;for(let s=e;s<t;s++){const i=n[s];for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}},jt,fe=(jt=class{constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.ac16=null,this.ac8=null}eval(e,t){switch(this.type){case jt.Type.NONE:return!0;case jt.Type.EXACT:return e.hasString(this,t);case jt.Type.AND:for(let r=0;r<this.subs.length;r++)if(!this.subs[r].eval(e,t))return!1;return!0;case jt.Type.OR:if(this.ac16&&this.ac8)return e.hasAnyString(this,t);for(let r=0;r<this.subs.length;r++)if(this.subs[r].eval(e,t))return!0;return!1;default:return!0}}},G(jt,"Type",{NONE:0,EXACT:1,AND:2,OR:3}),jt),Ew=class en{static build(e){const t=en.fromRegexp(e);return en.simplify(t)}static fromRegexp(e){if(!e)return new fe(fe.Type.NONE);switch(e.op){case y.Op.PLB:case y.Op.NLB:case y.Op.NO_MATCH:case y.Op.EMPTY_MATCH:case y.Op.BEGIN_LINE:case y.Op.END_LINE:case y.Op.BEGIN_TEXT:case y.Op.END_TEXT:case y.Op.WORD_BOUNDARY:case y.Op.NO_WORD_BOUNDARY:case y.Op.CHAR_CLASS:case y.Op.ANY_CHAR_NOT_NL:case y.Op.ANY_CHAR:return new fe(fe.Type.NONE);case y.Op.LITERAL:{if(e.runes.length===0||(e.flags&V.FOLD_CASE)!==0)return new fe(fe.Type.NONE);const t=new fe(fe.Type.EXACT);let r="";for(let s=0;s<e.runes.length;s++)r+=String.fromCodePoint(e.runes[s]);return t.str=r,t.bytes=W.stringToUtf8ByteArray(t.str),t}case y.Op.CAPTURE:case y.Op.PLUS:return en.fromRegexp(e.subs[0]);case y.Op.REPEAT:return e.min>=1?en.fromRegexp(e.subs[0]):new fe(fe.Type.NONE);case y.Op.CONCAT:{const t=new fe(fe.Type.AND);for(const r of e.subs)t.subs.push(en.fromRegexp(r));return t}case y.Op.ALTERNATE:{const t=new fe(fe.Type.OR);for(const r of e.subs)t.subs.push(en.fromRegexp(r));return t}default:return new fe(fe.Type.NONE)}}static simplify(e){if(e.type===fe.Type.EXACT||e.type===fe.Type.NONE)return e;if(e.type===fe.Type.AND){const t=[];for(const r of e.subs){const s=en.simplify(r);if(s.type!==fe.Type.NONE)if(s.type===fe.Type.AND)for(let i=0;i<s.subs.length;i++)t.push(s.subs[i]);else t.push(s)}return t.length===0?new fe(fe.Type.NONE):t.length===1?t[0]:(e.subs=t,e)}if(e.type===fe.Type.OR){const t=[];for(const o of e.subs){const B=en.simplify(o);if(B.type===fe.Type.NONE)return new fe(fe.Type.NONE);if(B.type===fe.Type.OR)for(let u=0;u<B.subs.length;u++)t.push(B.subs[u]);else t.push(B)}if(t.length===0)return new fe(fe.Type.NONE);if(t.length===1)return t[0];const r=new Set,s=[];for(const o of t)o.type===fe.Type.EXACT?r.has(o.str)||(r.add(o.str),s.push(o)):s.push(o);e.subs=s;let i=!0;for(const o of s)if(o.type!==fe.Type.EXACT){i=!1;break}return i&&s.length>1&&(e.ac16=new fh(s.map(o=>{const B=[];for(let u=0;u<o.str.length;u++)B.push(o.str.charCodeAt(u));return B})),e.ac8=new fh(s.map(o=>o.bytes))),e}return e}},vt=class{constructor(n=0,e=0){this.head=n,this.tail=e}},_w=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0}getInst(n){return this.inst[n]}numInst(){return this.inst.length}addInst(n){this.inst.push(new N(n))}skipNop(n){let e=this.inst[n];for(;e.op===N.NOP||e.op===N.CAPTURE;)e=this.inst[n],n=e.out;return e}prefix(){let n="",e=this.skipNop(this.start);if(!N.isRuneOp(e.op)||e.runes.length!==1)return[e.op===N.MATCH,n];for(;N.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&V.FOLD_CASE)===0;)n+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===N.MATCH,n]}startCond(){let n=0,e=this.start;e:for(;;){const t=this.inst[e];switch(t.op){case N.EMPTY_WIDTH:n|=t.arg;break;case N.FAIL:return-1;case N.CAPTURE:case N.NOP:break;default:break e}e=t.out}return n}patch(n,e){let t=n.head;for(;t!==0;){const r=this.inst[t>>1];(t&1)===0?(t=r.out,r.out=e):(t=r.arg,r.arg=e)}}append(n,e){if(n.head===0)return e;if(e.head===0)return n;const t=this.inst[n.tail>>1];return(n.tail&1)===0?t.out=e.head:t.arg=e.head,new vt(n.head,e.tail)}toString(){let n="";for(let e=0;e<this.inst.length;e++){const t=n.length;n+=e,e===this.start&&(n+="*"),n+="        ".substring(n.length-t),n+=this.inst[e],n+=`
`}return n}},Bo=class{constructor(n=0,e=new vt,t=!1){this.i=n,this.out=e,this.nullable=t}},Dw=class qr{static ANY_RUNE_NOT_NL(){return[0,O.CODES.get(`
`)-1,O.CODES.get(`
`)+1,z.MAX_RUNE]}static ANY_RUNE(){return[0,z.MAX_RUNE]}static compileRegexp(e){const t=new qr,r=t.compile(e);return t.prog.patch(r.out,t.newInst(N.MATCH).i),t.prog.start=r.i,t.prog}static compileSet(e){const t=new qr;if(e.length===0)return t.prog.start=t.newInst(N.FAIL).i,t.prog;let r=[];for(let i=0;i<e.length;i++){const o=t.compile(e[i]),B=t.newInst(N.MATCH);t.prog.getInst(B.i).arg=i,t.prog.patch(o.out,B.i),r.push(o.i)}let s=r[0];for(let i=1;i<r.length;i++){const o=t.newInst(N.ALT),B=t.prog.getInst(o.i);B.out=s,B.arg=r[i],s=o.i}return t.prog.start=s,t.prog}constructor(){this.prog=new _w,this.newInst(N.FAIL)}newInst(e){return this.prog.addInst(e),new Bo(this.prog.numInst()-1,new vt,!0)}nop(){const e=this.newInst(N.NOP);return e.out=new vt(e.i<<1,e.i<<1),e}fail(){return new Bo}cap(e){const t=this.newInst(N.CAPTURE);return t.out=new vt(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new Bo(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;const r=this.newInst(N.ALT),s=this.prog.getInst(r.i);return s.out=e.i,s.arg=t.i,r.out=this.prog.append(e.out,t.out),r.nullable=e.nullable||t.nullable,r}loop(e,t){const r=this.newInst(N.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new vt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new vt(r.i<<1|1,r.i<<1|1)),this.prog.patch(e.out,r.i),r}quest(e,t){const r=this.newInst(N.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new vt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new vt(r.i<<1|1,r.i<<1|1)),r.out=this.prog.append(r.out,e.out),r}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new Bo(e.i,this.loop(e,t).out,e.nullable)}empty(e){const t=this.newInst(N.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new vt(t.i<<1,t.i<<1),t}rune(e,t){const r=this.newInst(N.RUNE);r.nullable=!1;const s=this.prog.getInst(r.i);return s.runes=e,t&=V.FOLD_CASE,(e.length!==1||z.simpleFold(e[0])===e[0])&&(t&=-2),s.arg=t,r.out=new vt(r.i<<1,r.i<<1),(t&V.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=N.RUNE1:e.length===2&&e[0]===0&&e[1]===z.MAX_RUNE?s.op=N.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===O.CODES.get(`
`)-1&&e[2]===O.CODES.get(`
`)+1&&e[3]===z.MAX_RUNE&&(s.op=N.RUNE_ANY_NOT_NL),r}lookBehind(e,t){const r=this.newInst(N.LB_WRITE);this.prog.getInst(r.i).arg=t;const s=this.rune(qr.ANY_RUNE(),0),i=this.star(s,!0),o=this.cat(i,e);this.prog.patch(o.out,r.i);const B=this.newInst(N.LB_CHECK);return this.prog.getInst(B.i).arg=t,this.prog.lbStarts.push(o.i),Math.abs(t)>this.prog.numLb&&(this.prog.numLb=Math.abs(t)),B.out=new vt(B.i<<1,B.i<<1),B}compile(e){switch(e.op){case y.Op.NO_MATCH:return this.fail();case y.Op.EMPTY_MATCH:return this.nop();case y.Op.LITERAL:if(e.runes.length===0)return this.nop();{let t=null;for(let r of e.runes){const s=this.rune([r],e.flags);t=t===null?s:this.cat(t,s)}return t}case y.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case y.Op.ANY_CHAR_NOT_NL:return this.rune(qr.ANY_RUNE_NOT_NL(),0);case y.Op.ANY_CHAR:return this.rune(qr.ANY_RUNE(),0);case y.Op.BEGIN_LINE:return this.empty(W.EMPTY_BEGIN_LINE);case y.Op.END_LINE:return this.empty(W.EMPTY_END_LINE);case y.Op.BEGIN_TEXT:return this.empty(W.EMPTY_BEGIN_TEXT);case y.Op.END_TEXT:return this.empty(W.EMPTY_END_TEXT);case y.Op.WORD_BOUNDARY:return this.empty(W.EMPTY_WORD_BOUNDARY);case y.Op.NO_WORD_BOUNDARY:return this.empty(W.EMPTY_NO_WORD_BOUNDARY);case y.Op.PLB:case y.Op.NLB:return this.lookBehind(this.compile(e.subs[0]),e.lb);case y.Op.CAPTURE:{const t=this.cap(e.cap<<1),r=this.compile(e.subs[0]),s=this.cap(e.cap<<1|1);return this.cat(this.cat(t,r),s)}case y.Op.STAR:return this.star(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case y.Op.PLUS:return this.plus(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case y.Op.QUEST:return this.quest(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case y.Op.CONCAT:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){const s=this.compile(r);t=t===null?s:this.cat(t,s)}return t}case y.Op.ALTERNATE:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){const s=this.compile(r);t=t===null?s:this.alt(t,s)}return t}default:throw new sw("regexp: unhandled case in compile")}}},ww=class _t{static simplify(e){if(e===null)return null;switch(e.op){case y.Op.PLB:case y.Op.NLB:case y.Op.CAPTURE:{const t=_t.simplify(e.subs[0]);if(t!==e.subs[0]){const r=y.fromRegexp(e);return r.runes=[],r.subs=[t],r}return e}case y.Op.CONCAT:case y.Op.ALTERNATE:{const t=[];let r=!1;for(let s=0;s<e.subs.length;s++){const i=e.subs[s],o=_t.simplify(i);if(o!==i&&(r=!0),e.op===y.Op.CONCAT){if(o.op===y.Op.NO_MATCH)return new y(y.Op.NO_MATCH);if(o.op===y.Op.EMPTY_MATCH){r=!0;continue}if(o.op===y.Op.CONCAT){r=!0;for(let B=0;B<o.subs.length;B++)t.push(o.subs[B]);continue}}else if(e.op===y.Op.ALTERNATE){if(o.op===y.Op.NO_MATCH){r=!0;continue}if(o.op===y.Op.ALTERNATE){r=!0;for(let B=0;B<o.subs.length;B++)t.push(o.subs[B]);continue}}t.push(o)}if(r){if(t.length===0)return new y(e.op===y.Op.CONCAT?y.Op.EMPTY_MATCH:y.Op.NO_MATCH);if(t.length===1)return t[0];const s=y.fromRegexp(e);return s.runes=[],s.subs=t,s}return e}case y.Op.CHAR_CLASS:return e.runes===null?e:e.runes.length===0?new y(y.Op.NO_MATCH):e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE?new y(y.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===O.CODES.get(`
`)-1&&e.runes[2]===O.CODES.get(`
`)+1&&e.runes[3]===z.MAX_RUNE?new y(y.Op.ANY_CHAR_NOT_NL):e;case y.Op.STAR:case y.Op.PLUS:case y.Op.QUEST:{const t=_t.simplify(e.subs[0]);return _t.simplify1(e.op,e.flags,t,e)}case y.Op.REPEAT:{if(e.min===0&&e.max===0)return new y(y.Op.EMPTY_MATCH);const t=_t.simplify(e.subs[0]);if(e.max===-1){if(e.min===0)return _t.simplify1(y.Op.STAR,e.flags,t,null);if(e.min===1)return _t.simplify1(y.Op.PLUS,e.flags,t,null);const s=new y(y.Op.CONCAT),i=[];for(let o=0;o<e.min-1;o++)i.push(t);return i.push(_t.simplify1(y.Op.PLUS,e.flags,t,null)),s.subs=i.slice(0),_t.simplify(s)}if(e.min===1&&e.max===1)return t;let r=null;if(e.min>0){r=[];for(let s=0;s<e.min;s++)r.push(t)}if(e.max>e.min){let s=_t.simplify1(y.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++){const o=new y(y.Op.CONCAT);o.subs=[t,s],s=_t.simplify1(y.Op.QUEST,e.flags,o,null)}if(r===null)return s;r.push(s)}if(r!==null){const s=new y(y.Op.CONCAT);return s.subs=r.slice(0),_t.simplify(s)}return new y(y.Op.NO_MATCH)}}return e}static simplify1(e,t,r,s){if(r.op===y.Op.EMPTY_MATCH)return r;if(r.op===y.Op.NO_MATCH)return e===y.Op.PLUS?r:new y(y.Op.EMPTY_MATCH);if(e===r.op&&(t&V.NON_GREEDY)===(r.flags&V.NON_GREEDY))return r;if(s!==null&&s.op===e&&(s.flags&V.NON_GREEDY)===(t&V.NON_GREEDY)&&r===s.subs[0])return s;const i=new y(e);return i.flags=t,i.subs=[r],i}},he=class{constructor(n,e){this.sign=n,this.cls=e}};const Ch=[48,57],dh=[9,10,12,13,32,32],ph=[48,57,65,90,95,95,97,122],gh=new Map([["\\d",new he(1,Ch)],["\\D",new he(-1,Ch)],["\\s",new he(1,dh)],["\\S",new he(-1,dh)],["\\w",new he(1,ph)],["\\W",new he(-1,ph)]]),mh=[48,57,65,90,97,122],Eh=[65,90,97,122],_h=[0,127],Dh=[9,9,32,32],wh=[0,31,127,127],Ih=[48,57],yh=[33,126],Th=[97,122],Ah=[32,126],Rh=[33,47,58,64,91,96,123,126],vh=[9,13,32,32],Ph=[65,90],bh=[48,57,65,90,95,95,97,122],Sh=[48,57,65,70,97,102],Oh=new Map([["[:alnum:]",new he(1,mh)],["[:^alnum:]",new he(-1,mh)],["[:alpha:]",new he(1,Eh)],["[:^alpha:]",new he(-1,Eh)],["[:ascii:]",new he(1,_h)],["[:^ascii:]",new he(-1,_h)],["[:blank:]",new he(1,Dh)],["[:^blank:]",new he(-1,Dh)],["[:cntrl:]",new he(1,wh)],["[:^cntrl:]",new he(-1,wh)],["[:digit:]",new he(1,Ih)],["[:^digit:]",new he(-1,Ih)],["[:graph:]",new he(1,yh)],["[:^graph:]",new he(-1,yh)],["[:lower:]",new he(1,Th)],["[:^lower:]",new he(-1,Th)],["[:print:]",new he(1,Ah)],["[:^print:]",new he(-1,Ah)],["[:punct:]",new he(1,Rh)],["[:^punct:]",new he(-1,Rh)],["[:space:]",new he(1,vh)],["[:^space:]",new he(-1,vh)],["[:upper:]",new he(1,Ph)],["[:^upper:]",new he(-1,Ph)],["[:word:]",new he(1,bh)],["[:^word:]",new he(-1,bh)],["[:xdigit:]",new he(1,Sh)],["[:^xdigit:]",new he(-1,Sh)]]);var An=class vn{static charClassToString(e,t){let r="[";for(let s=0;s<t;s+=2){s>0&&(r+=" ");const i=e[s],o=e[s+1];i===o?r+=`0x${i.toString(16)}`:r+=`0x${i.toString(16)}-0x${o.toString(16)}`}return r+="]",r}static cmp(e,t,r,s){const i=e[t]-r;return i!==0?i:s-e[t+1]}static qsortIntPair(e,t,r){const s=((t+r)/2|0)&-2,i=e[s],o=e[s+1];let B=t,u=r;for(;B<=u;){for(;B<r&&vn.cmp(e,B,i,o)<0;)B+=2;for(;u>t&&vn.cmp(e,u,i,o)>0;)u-=2;if(B<=u){if(B!==u){let c=e[B];e[B]=e[u],e[u]=c,c=e[B+1],e[B+1]=e[u+1],e[u+1]=c}B+=2,u-=2}}t<u&&vn.qsortIntPair(e,t,u),B<r&&vn.qsortIntPair(e,B,r)}constructor(e=W.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;vn.qsortIntPair(this.r,0,this.len-2);let e=2;for(let t=2;t<this.len;t+=2){const r=this.r[t],s=this.r[t+1];if(r<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=r,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&V.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let r=2;r<=4;r+=2)if(this.len>=r){const s=this.r[this.len-r],i=this.r[this.len-r+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-r]=e),t>i&&(this.r[this.len-r+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=z.MIN_FOLD&&t>=z.MAX_FOLD)return this.appendRange(e,t);if(t<z.MIN_FOLD||e>z.MAX_FOLD)return this.appendRange(e,t);e<z.MIN_FOLD&&(this.appendRange(e,z.MIN_FOLD-1),e=z.MIN_FOLD),t>z.MAX_FOLD&&(this.appendRange(z.MAX_FOLD+1,t),t=z.MAX_FOLD);for(let r=e;r<=t;r++){this.appendRange(r,r);for(let s=z.simpleFold(r);s!==r;s=z.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let r=0;r<e.length;r+=2){const s=e[r],i=e[r+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){const r=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(r,s);continue}for(let o=r;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let r=0;r<e.length;++r){const s=e.getLo(r),i=e.getHi(r),o=e.getStride(r);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let B=s;B<=i;B+=o)t<=B-1&&this.appendRange(t,B-1),t=B+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let r=0;r<this.len;r+=2){const s=this.r[r],i=this.r[r+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=z.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=z.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let r=e.cls;return t&&(r=new vn().appendFoldedClass(r).cleanClass().toArray()),this.appendClassWithSign(r,e.sign)}toString(){return vn.charClassToString(this.r,this.len)}},Iw=class{constructor(n){this.str=n,this.position=0}pos(){return this.position}rewindTo(n){this.position=n}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(n){this.position+=n}skipString(n){this.position+=n.length}pop(){const n=this.str.codePointAt(this.position);return this.position+=W.charCount(n),n}lookingAt(n){return this.str.startsWith(n,this.position)}rest(){return this.str.substring(this.position)}from(n){return this.str.substring(n,this.position)}toString(){return this.rest()}},U,yw=(U=class{static unicodeTable(e){return e==="Any"?{tab:U.ANY_TABLE,fold:U.ANY_TABLE,sign:1}:e==="Ascii"?{tab:U.ASCII_TABLE,fold:U.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:ut.CATEGORIES.get("Cn"),fold:ut.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:ut.CATEGORIES.get("LC"),fold:ut.FOLD_CATEGORIES.get("LC"),sign:1}:ut.CATEGORIES.has(e)?{tab:ut.CATEGORIES.get(e),fold:ut.FOLD_CATEGORIES.get(e),sign:1}:ut.SCRIPTS.has(e)?{tab:ut.SCRIPTS.get(e),fold:ut.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<z.MIN_FOLD||e>z.MAX_FOLD)return e;let t=e;const r=e;for(e=z.simpleFold(e);e!==r;e=z.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===y.Op.EMPTY_MATCH)return null;if(e.op===y.Op.CONCAT&&e.subs.length>0){const t=e.subs[0];return t.op===y.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){const r=new y(y.Op.LITERAL);return r.flags=t,r.runes=W.stringToRunes(e),r}static parse(e,t){return new U(e,t).parseInternal()}static parseRepeat(e){const t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);const r=U.parseInt(e);if(r===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=r;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=U.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),r<0||r>1e3||s===-2||s>1e3||s>=0&&r>s)throw new _e(U.ERR_INVALID_REPEAT_SIZE,e.from(t));return r<<16|s&z.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){const r=e.codePointAt(t);if(r!==O.CODES.get("_")&&!W.isalnum(r))return!1}return!0}static parseInt(e){const t=e.pos();for(;e.more()&&e.peek()>=O.CODES.get("0")&&e.peek()<=O.CODES.get("9");)e.skip(1);const r=e.from(t);return r.length===0||r.length>1&&r.codePointAt(0)===O.CODES.get("0")?-1:r.length>8?-2:parseInt(r,10)}static isCharClass(e){return e.op===y.Op.LITERAL&&e.runes.length===1||e.op===y.Op.CHAR_CLASS||e.op===y.Op.ANY_CHAR_NOT_NL||e.op===y.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case y.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case y.Op.CHAR_CLASS:for(let r=0;r<e.runes.length;r+=2)if(e.runes[r]<=t&&t<=e.runes[r+1])return!0;return!1;case y.Op.ANY_CHAR_NOT_NL:return t!==O.CODES.get(`
`);case y.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case y.Op.ANY_CHAR:break;case y.Op.ANY_CHAR_NOT_NL:U.matchRune(t,O.CODES.get(`
`))&&(e.op=y.Op.ANY_CHAR);break;case y.Op.CHAR_CLASS:t.op===y.Op.LITERAL?e.runes=new An(e.runes).appendLiteral(t.runes[0],t.flags).toArray():e.runes=new An(e.runes).appendClass(t.runes).toArray();break;case y.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=y.Op.CHAR_CLASS,e.runes=new An().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toArray();break}}static parseEscape(e){const t=e.pos();if(e.skip(1),!e.more())throw new _e(U.ERR_TRAILING_BACKSLASH);let r=e.pop();e:switch(r){case O.CODES.get("1"):case O.CODES.get("2"):case O.CODES.get("3"):case O.CODES.get("4"):case O.CODES.get("5"):case O.CODES.get("6"):case O.CODES.get("7"):if(!e.more()||e.peek()<O.CODES.get("0")||e.peek()>O.CODES.get("7"))break;case O.CODES.get("0"):{let s=r-O.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<O.CODES.get("0")||e.peek()>O.CODES.get("7"));i++)s=s*8+e.peek()-O.CODES.get("0"),e.skip(1);return s}case O.CODES.get("x"):{if(!e.more())break;if(r=e.pop(),r===O.CODES.get("{")){let o=0,B=0;for(;;){if(!e.more())break e;if(r=e.pop(),r===O.CODES.get("}"))break;const u=W.unhex(r);if(u<0||(B=B*16+u,B>z.MAX_RUNE))break e;o++}if(o===0)break e;return B}const s=W.unhex(r);if(!e.more())break;r=e.pop();const i=W.unhex(r);if(s<0||i<0)break;return s*16+i}case O.CODES.get("a"):return O.CODES.get("\x07");case O.CODES.get("f"):return O.CODES.get("\f");case O.CODES.get("n"):return O.CODES.get(`
`);case O.CODES.get("r"):return O.CODES.get("\r");case O.CODES.get("t"):return O.CODES.get("	");case O.CODES.get("v"):return O.CODES.get("\v");default:if(r<=z.MAX_ASCII&&!W.isalnum(r))return r;break}throw new _e(U.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new _e(U.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?U.parseEscape(e):e.pop()}static concatRunes(e,t){for(let r=0;r<t.length;r++)e.push(t[r]);return e}static hasCapture(e){if(e===null)return!1;if(e.op===y.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if(U.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new y(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>U.MAX_RUNES)throw new _e(U.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===y.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor(U.MAX_SIZE/this.repeats)?this.repeats=U.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor(U.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>U.MAX_SIZE)throw new _e(U.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let r=0;switch(e.op){case y.Op.LITERAL:r=e.runes.length;break;case y.Op.PLB:case y.Op.NLB:case y.Op.CAPTURE:case y.Op.STAR:r=2+this.calcSize(e.subs[0]);break;case y.Op.PLUS:case y.Op.QUEST:r=1+this.calcSize(e.subs[0]);break;case y.Op.CONCAT:for(let s of e.subs)r=r+this.calcSize(s);break;case y.Op.ALTERNATE:for(let s of e.subs)r=r+this.calcSize(s);e.subs.length>1&&(r=r+e.subs.length-1);break;case y.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?r=2+s:r=1+e.min*s;break}r=e.max*s+(e.max-e.min);break}}return r=Math.max(1,r),this.size===null&&(this.size=new Map),this.size.set(e,r),r}checkHeight(e){if(!(this.numRegexp<U.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>U.MAX_HEIGHT)throw new _e(U.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let r=1;for(let s of e.subs){const i=this.calcHeight(s);r<1+i&&(r=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,r),r}pop(){return this.stack.pop()}popToPseudo(){const e=this.stack.length;let t=e;for(;t>0&&!y.isPseudoOp(this.stack[t-1].op);)t--;const r=this.stack.slice(t,e);return this.stack=this.stack.slice(0,t),r}push(e){if(this.numRunes+=e.runes.length,e.op===y.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&-2))return null;e.op=y.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&-2}else if(e.op===y.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&z.simpleFold(e.runes[0])===e.runes[2]&&z.simpleFold(e.runes[2])===e.runes[0]||e.op===y.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&z.simpleFold(e.runes[0])===e.runes[1]&&z.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|V.FOLD_CASE))return null;e.op=y.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|V.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){const r=this.stack.length;if(r<2)return!1;const s=this.stack[r-1],i=this.stack[r-2];return s.op!==y.Op.LITERAL||i.op!==y.Op.LITERAL||(s.flags&V.FOLD_CASE)!==(i.flags&V.FOLD_CASE)?!1:(i.runes=U.concatRunes(i.runes,s.runes),e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1))}newLiteral(e,t){const r=this.newRegexp(y.Op.LITERAL);return r.flags=t,(t&V.FOLD_CASE)!==0&&(e=U.minFoldRune(e)),r.runes=[e],r}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){const t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,r,s,i,o){let B=this.flags;if((B&V.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),B^=V.NON_GREEDY),o!==-1))throw new _e(U.ERR_INVALID_REPEAT_OP,i.from(o));const u=this.stack.length;if(u===0)throw new _e(U.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const c=this.stack[u-1];if(y.isPseudoOp(c.op))throw new _e(U.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const h=this.newRegexp(e);if(h.min=t,h.max=r,h.flags=B,h.subs=[c],this.stack[u-1]=h,this.checkLimits(h),e===y.Op.REPEAT&&(t>=2||r>=2)&&!this.repeatIsValid(h,1e3))throw new _e(U.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===y.Op.REPEAT){let r=e.max;if(r===0)return!0;if(r<0&&(r=e.min),r>t)return!1;r>0&&(t=Math.trunc(t/r))}for(let r of e.subs)if(!this.repeatIsValid(r,t))return!1;return!0}concat(){this.maybeConcat(-1,0);const e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(y.Op.EMPTY_MATCH)):this.push(this.collapse(e,y.Op.CONCAT))}alternate(){const e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(y.Op.NO_MATCH)):this.push(this.collapse(e,y.Op.ALTERNATE))}cleanAlt(e){e.op===y.Op.CHAR_CLASS&&(e.runes=new An(e.runes).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE?(e.runes=[],e.op=y.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===O.CODES.get(`
`)-1&&e.runes[2]===O.CODES.get(`
`)+1&&e.runes[3]===z.MAX_RUNE&&(e.runes=[],e.op=y.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let r=0;for(let B of e)r+=B.op===t?B.subs.length:1;let s=new Array(r).fill(null),i=0;for(let B of e)if(B.op===t){for(let u=0;u<B.subs.length;u++)s[i++]=B.subs[u];this.reuse(B)}else s[i++]=B;let o=this.newRegexp(t);if(o.subs=s,t===y.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){const B=o;o=o.subs[0],this.reuse(B)}return o}factor(e){if(e.length<2)return e;let t=0,r=e.length,s=0,i=null,o=0,B=0,u=0;for(let h=0;h<=r;h++){let C=null,p=0,w=0;if(h<r){let A=e[t+h];if(A.op===y.Op.CONCAT&&A.subs.length>0&&(A=A.subs[0]),A.op===y.Op.LITERAL&&(C=A.runes,p=A.runes.length,w=A.flags&V.FOLD_CASE),w===B){let L=0;for(;L<o&&L<p&&i[L]===C[L];)L++;if(L>0){o=L;continue}}}if(h!==u)if(h===u+1)e[s++]=e[t+u];else{const A=this.newRegexp(y.Op.LITERAL);A.flags=B,A.runes=i.slice(0,o);for(let j=u;j<h;j++)e[t+j]=this.removeLeadingString(e[t+j],o),this.checkLimits(e[t+j]);const L=this.collapse(e.slice(t+u,t+h),y.Op.ALTERNATE),M=this.newRegexp(y.Op.CONCAT);M.subs=[A,L],e[s++]=M}u=h,i=C,o=p,B=w}r=s,t=0,u=0,s=0;let c=null;for(let h=0;h<=r;h++){let C=null;if(!(h<r&&(C=U.leadingRegexp(e[t+h]),c!==null&&c.equals(C)&&(U.isCharClass(c)||c.op===y.Op.REPEAT&&c.min===c.max&&U.isCharClass(c.subs[0]))))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{const p=c;for(let L=u;L<h;L++){const M=L!==u;e[t+L]=this.removeLeadingRegexp(e[t+L],M),this.checkLimits(e[t+L])}const w=this.collapse(e.slice(t+u,t+h),y.Op.ALTERNATE),A=this.newRegexp(y.Op.CONCAT);A.subs=[p,w],e[s++]=A}u=h,c=C}}r=s,t=0,u=0,s=0;for(let h=0;h<=r;h++)if(!(h<r&&U.isCharClass(e[t+h]))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let C=u;for(let w=u+1;w<h;w++){const A=e[t+C],L=e[t+w];(A.op<L.op||A.op===L.op&&(A.runes!==null?A.runes.length:0)<(L.runes!==null?L.runes.length:0))&&(C=w)}const p=e[t+u];e[t+u]=e[t+C],e[t+C]=p;for(let w=u+1;w<h;w++)U.mergeCharClass(e[t+u],e[t+w]),this.reuse(e[t+w]);this.cleanAlt(e[t+u]),e[s++]=e[t+u]}h<r&&(e[s++]=e[t+h]),u=h+1}r=s,t=0,u=0,s=0;for(let h=0;h<r;++h)h+1<r&&e[t+h].op===y.Op.EMPTY_MATCH&&e[t+h+1].op===y.Op.EMPTY_MATCH||(e[s++]=e[t+h]);return r=s,t=0,e.slice(t,r)}removeLeadingString(e,t){if(e.op===y.Op.CONCAT&&e.subs.length>0){const r=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=r,r.op===y.Op.EMPTY_MATCH)switch(this.reuse(r),e.subs.length){case 0:case 1:e.op=y.Op.EMPTY_MATCH,e.subs=y.emptySubs();break;case 2:{const s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length);break}return e}return e.op===y.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=y.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===y.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=y.Op.EMPTY_MATCH,e.subs=y.emptySubs();break;case 1:{const r=e;e=e.subs[0],this.reuse(r);break}}return e}return t&&this.reuse(e),this.newRegexp(y.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&V.LITERAL)!==0)return U.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,r=-1;const s=new Iw(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case O.CODES.get("("):if((this.flags&V.LOOKBEHIND)!==0){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if((this.flags&V.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(y.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case O.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case O.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case O.CODES.get("^"):(this.flags&V.ONE_LINE)!==0?this.op(y.Op.BEGIN_TEXT):this.op(y.Op.BEGIN_LINE),s.skip(1);break;case O.CODES.get("$"):(this.flags&V.ONE_LINE)!==0?this.op(y.Op.END_TEXT).flags|=V.WAS_DOLLAR:this.op(y.Op.END_LINE),s.skip(1);break;case O.CODES.get("."):(this.flags&V.DOT_NL)!==0?this.op(y.Op.ANY_CHAR):this.op(y.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case O.CODES.get("["):this.parseClass(s);break;case O.CODES.get("*"):case O.CODES.get("+"):case O.CODES.get("?"):{i=s.pos();let o=null;switch(s.pop()){case O.CODES.get("*"):o=y.Op.STAR;break;case O.CODES.get("+"):o=y.Op.PLUS;break;case O.CODES.get("?"):o=y.Op.QUEST;break}this.repeat(o,t,r,i,s,e);break}case O.CODES.get("{"):{i=s.pos();const o=U.parseRepeat(s);if(o<0){s.rewindTo(i),this.literal(s.pop());break}t=o>>16,r=(o&z.MAX_BMP)<<16>>16,this.repeat(y.Op.REPEAT,t,r,i,s,e);break}case O.CODES.get("\\"):{const o=s.pos();if(s.skip(1),(this.flags&V.PERL_X)!==0&&s.more())switch(s.pop()){case O.CODES.get("A"):this.op(y.Op.BEGIN_TEXT);break e;case O.CODES.get("b"):this.op(y.Op.WORD_BOUNDARY);break e;case O.CODES.get("B"):this.op(y.Op.NO_WORD_BOUNDARY);break e;case O.CODES.get("C"):throw new _e(U.ERR_INVALID_ESCAPE,"\\C");case O.CODES.get("Q"):{let c=s.rest();const h=c.indexOf("\\E");h>=0?(c=c.substring(0,h),s.skipString(c),s.skipString("\\E")):s.skipString(c);let C=0;for(;C<c.length;){const p=c.codePointAt(C);this.literal(p),C+=W.charCount(p)}break e}case O.CODES.get("z"):this.op(y.Op.END_TEXT);break e;default:s.rewindTo(o);break}else s.rewindTo(o);const B=this.newRegexp(y.Op.CHAR_CLASS);if(B.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){const c=new An;if(this.parseUnicodeClass(s,c)){B.runes=c.toArray(),this.push(B);break e}}const u=new An;if(this.parsePerlClassEscape(s,u)){B.runes=u.toArray(),this.push(B);break e}s.rewindTo(o),this.reuse(B),this.literal(U.parseEscape(s));break}default:this.literal(s.pop());break}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new _e(U.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){const t=e.pos(),r=e.rest();if(r.startsWith("(?P<")||r.startsWith("(?<")){const B=r.charAt(2)==="P"?4:3,u=r.indexOf(">");if(u<0)throw new _e(U.ERR_INVALID_NAMED_CAPTURE,r);const c=r.substring(B,u);if(e.skipString(c),e.skip(B+1),!U.isValidCaptureName(c))throw new _e(U.ERR_INVALID_NAMED_CAPTURE,r.substring(0,u+1));const h=this.op(y.Op.LEFT_PAREN);if(h.cap=++this.numCap,this.namedGroups[c])throw new _e(U.ERR_DUPLICATE_NAMED_CAPTURE,c);this.namedGroups[c]=this.numCap,h.name=c;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){const B=e.pop();switch(B){case O.CODES.get("i"):s|=V.FOLD_CASE,o=!0;break;case O.CODES.get("m"):s&=-17,o=!0;break;case O.CODES.get("s"):s|=V.DOT_NL,o=!0;break;case O.CODES.get("U"):s|=V.NON_GREEDY,o=!0;break;case O.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case O.CODES.get(":"):case O.CODES.get(")"):if(i<0){if(!o)break e;s=~s}B===O.CODES.get(":")&&this.op(y.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new _e(U.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){const e=this.newRegexp(y.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){const e=this.newRegexp(y.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(y.Op.VERTICAL_BAR)}swapVerticalBar(){const e=this.stack.length;if(e>=3&&this.stack[e-2].op===y.Op.VERTICAL_BAR&&U.isCharClass(this.stack[e-1])&&U.isCharClass(this.stack[e-3])){let t=this.stack[e-1],r=this.stack[e-3];if(t.op>r.op){const s=r;r=t,t=s,this.stack[e-3]=r}return U.mergeCharClass(r,t),this.reuse(t),this.pop(),!0}if(e>=2){const t=this.stack[e-1],r=this.stack[e-2];if(r.op===y.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=r,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new _e(U.ERR_UNEXPECTED_PAREN,this.wholeRegexp);const e=this.pop(),t=this.pop();if(t.op!==y.Op.LEFT_PAREN)throw new _e(U.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if(U.hasCapture(e))throw new _e(U.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=y.Op.PLB:t.op=y.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=y.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){const r=e.pos();if((this.flags&V.PERL_X)===0||!e.more()||e.pop()!==O.CODES.get("\\")||!e.more())return!1;e.pop();const s=e.from(r),i=gh.has(s)?gh.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&V.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){const r=e.rest(),s=r.indexOf(":]");if(s<0)return!1;const i=r.substring(0,s+2);e.skipString(i);const o=Oh.has(i)?Oh.get(i):null;if(o===null)throw new _e(U.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&V.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){const r=e.pos();if((this.flags&V.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===O.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(r),new _e(U.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==O.CODES.get("{"))o=W.runeToString(i);else{const h=e.rest(),C=h.indexOf("}");if(C<0)throw e.rewindTo(r),new _e(U.ERR_INVALID_CHAR_RANGE,e.rest());o=h.substring(0,C),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===O.CODES.get("^")&&(s=0-s,o=o.substring(1));const B=U.unicodeTable(o);if(B===null)throw new _e(U.ERR_INVALID_CHAR_RANGE,e.from(r));B.sign<0&&(s=0-s);const u=B.tab,c=B.fold;if((this.flags&V.FOLD_CASE)===0||c===null)t.appendTableWithSign(u,s);else{const h=new An().appendTable(u).appendTable(c).cleanClass().toArray();t.appendClassWithSign(h,s)}return!0}parseClass(e){const t=e.pos();e.skip(1);const r=this.newRegexp(y.Op.CHAR_CLASS);r.flags=this.flags;const s=new An;let i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&V.CLASS_NL)===0&&s.appendRange(O.CODES.get(`
`),O.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==O.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&V.PERL_X)===0&&!o){const h=e.rest();if(h==="-"||!h.startsWith("-]"))throw e.rewindTo(t),new _e(U.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;const B=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(B)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(B);const u=U.parseClassChar(e,t);let c=u;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(c=U.parseClassChar(e,t),c<u)throw new _e(U.ERR_INVALID_CHAR_RANGE,e.from(B))}(this.flags&V.FOLD_CASE)===0?s.appendRange(u,c):s.appendFoldedRange(u,c)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),r.runes=s.toArray(),this.push(r)}},G(U,"ERR_INTERNAL_ERROR","regexp/syntax: internal error"),G(U,"ERR_INVALID_CHAR_RANGE","invalid character class range"),G(U,"ERR_INVALID_ESCAPE","invalid escape sequence"),G(U,"ERR_INVALID_NAMED_CAPTURE","invalid named capture"),G(U,"ERR_INVALID_PERL_OP","invalid or unsupported Perl syntax"),G(U,"ERR_INVALID_REPEAT_OP","invalid nested repetition operator"),G(U,"ERR_INVALID_REPEAT_SIZE","invalid repeat count"),G(U,"ERR_MISSING_BRACKET","missing closing ]"),G(U,"ERR_MISSING_PAREN","missing closing )"),G(U,"ERR_MISSING_REPEAT_ARGUMENT","missing argument to repetition operator"),G(U,"ERR_TRAILING_BACKSLASH","trailing backslash at end of expression"),G(U,"ERR_DUPLICATE_NAMED_CAPTURE","duplicate capture group name"),G(U,"ERR_UNEXPECTED_PAREN","unexpected )"),G(U,"ERR_NESTING_DEPTH","expression nests too deeply"),G(U,"ERR_LARGE","expression too large"),G(U,"ERR_INVALID_CAPTURE_IN_LOOKBEHIND","invalid capture in lookbehind"),G(U,"MAX_HEIGHT",1e3),G(U,"MAX_SIZE",3355443),G(U,"MAX_RUNES",33554432),G(U,"ANY_TABLE",new g(new Uint32Array([0,z.MAX_RUNE,1]))),G(U,"ASCII_TABLE",new g(new Uint32Array([0,127,1]))),G(U,"ASCII_FOLD_TABLE",new g(new Uint32Array([0,127,1,383,383,1,8490,8490,1]))),U),Tw=class lr{static initTest(e){const t=lr.compile(e),r=new lr(t.expr,t.prog,t.numSubexp,t.longest);return r.cond=t.cond,r.prefix=t.prefix,r.prefixUTF8=t.prefixUTF8,r.prefixComplete=t.prefixComplete,r.prefixRune=t.prefixRune,r.prefilter=t.prefilter,r}static compile(e){return lr.compileImpl(e,V.PERL,!1)}static compilePOSIX(e){return lr.compileImpl(e,V.POSIX,!0)}static compileImpl(e,t,r){let s=yw.parse(e,t);const i=s.maxCap();s=ww.simplify(s);const o=Ew.build(s),B=Dw.compileRegexp(s),u=new lr(e,B,i,r);u.prefilter=o.type===fe.Type.NONE?null:o;const[c,h]=B.prefix();return u.prefixComplete=c,u.prefix=h,u.prefixUTF8=W.stringToUtf8ByteArray(u.prefix),u.prefix.length>0&&(u.prefixRune=u.prefix.codePointAt(0)),u.namedGroups=s.namedGroups,u}static match(e,t){return lr.compile(e).match(t)}constructor(e,t,r=0,s=0){this.expr=e,this.prog=t,this.numSubexp=r,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.machinePool=[],this.dfa=new uw(this.prog),this.onepass=hh.compile(this.prog),this.prefilter=null}matchPrefixComplete(e,t,r,s){if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1;const B=e.prefixLength(this);if(r===V.UNANCHORED){const u=e.index(this,t);if(u<0)return null;i=t+u,o=i+B}else if(r===V.ANCHOR_BOTH){if(e.endPos()!==B||e.index(this,0)!==0)return null;i=0,o=B}else if(r===V.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=B}if(i<0)return null;if(s>0){const u=new Int32Array(s).fill(-1);return u[0]=i,u[1]=o,Array.from(u)}return[]}executeEngine(e,t,r,s){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,r,s);if(this.prefilter!==null&&r===V.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return hh.execute(this,e,t,r,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=ao.maxBitStateLen(this.prog)?ao.execute(this,e,t,r,s):this.doExecuteNFA(e,t,r,s);if(this.prog.numLb===0){const i=this.dfa.match(e,t,r);if(i!==null)return i?[]:null;if(e.endPos()<=ao.maxBitStateLen(this.prog))return ao.execute(this,e,t,r,s)}return this.doExecuteNFA(e,t,r,s)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,r,s){let i=this.get();i||(i=ow.fromRE2(this)),i.init(s);const o=i.match(e,t,r)?i.submatches():null;return this.put(i),o}match(e){return this.executeEngine(Ie.fromUTF16(e),0,V.UNANCHORED,0)!==null}matchWithGroup(e,t,r,s,i){return e instanceof Tr||(W.isByteArray(e)?e=Cr.utf8(e):e=Cr.utf16(e)),this.matchMachineInput(e,t,r,s,i)}matchMachineInput(e,t,r,s,i){if(t>r)return[!1,null];const o=e.isUTF16Encoding()?Ie.fromUTF16(e.asCharSequence(),0,r):Ie.fromUTF8(e.asBytes(),0,r),B=this.executeEngine(o,t,s,2*i);return B===null?[!1,null]:[!0,B]}matchUTF8(e){return this.executeEngine(Ie.fromUTF8(e),0,V.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,r){let s=0,i=0,o="";const B=Ie.fromUTF16(e);let u=0;for(;i<=e.length;){const c=this.executeEngine(B,i,V.UNANCHORED,2);if(c===null||c.length===0)break;o+=e.substring(s,c[0]),(c[1]>s||c[0]===0)&&(o+=t(e.substring(c[0],c[1])),u++),s=c[1];const h=B.step(i)&7;if(i+h>c[1]?i+=h:i+1>c[1]?i++:i=c[1],u>=r)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let r=new Array(t).fill(-1);for(let s=0;s<e.length;s++)r[s]=e[s];e=r}return e}allMatches(e,t,r=s=>s){let s=[];const i=e.endPos();t<0&&(t=i+1);let o=0,B=0,u=-1;for(;B<t&&o<=i;){const c=this.executeEngine(e,o,V.UNANCHORED,this.prog.numCap);if(c===null||c.length===0)break;let h=!0;if(c[1]===o){c[0]===u&&(h=!1);const C=e.step(o);C<0?o=i+1:o+=C&7}else o=c[1];u=c[1],h&&(s.push(r(this.pad(c))),B++)}return s}findUTF8(e){const t=this.executeEngine(Ie.fromUTF8(e),0,V.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){const t=this.executeEngine(Ie.fromUTF8(e),0,V.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){const t=this.executeEngine(Ie.fromUTF16(e),0,V.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(Ie.fromUTF16(e),0,V.UNANCHORED,2)}findUTF8Submatch(e){const t=this.executeEngine(Ie.fromUTF8(e),0,V.UNANCHORED,this.prog.numCap);if(t===null)return null;const r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.slice(t[2*s],t[2*s+1]));return r}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(Ie.fromUTF8(e),0,V.UNANCHORED,this.prog.numCap))}findSubmatch(e){const t=this.executeEngine(Ie.fromUTF16(e),0,V.UNANCHORED,this.prog.numCap);if(t===null)return null;const r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.substring(t[2*s],t[2*s+1]));return r}findSubmatchIndex(e){return this.pad(this.executeEngine(Ie.fromUTF16(e),0,V.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){const r=this.allMatches(Ie.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return r.length===0?null:r}findAllUTF8Index(e,t){const r=this.allMatches(Ie.fromUTF8(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAll(e,t){const r=this.allMatches(Ie.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return r.length===0?null:r}findAllIndex(e,t){const r=this.allMatches(Ie.fromUTF16(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAllUTF8Submatch(e,t){const r=this.allMatches(Ie.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllUTF8SubmatchIndex(e,t){const r=this.allMatches(Ie.fromUTF8(e),t);return r.length===0?null:r}findAllSubmatch(e,t){const r=this.allMatches(Ie.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllSubmatchIndex(e,t){const r=this.allMatches(Ie.fromUTF16(e),t);return r.length===0?null:r}},Aw=class Jr{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let r="",s=!1,i=e.length;i===0&&(r="(?:)",s=!0);let o=!1,B=0;for(;B<i;){let c=e[B];if(c==="\\"){if(B+1<i)switch(c=e[B+1],c){case"\\":r+="\\\\",B+=2;continue;case"c":if(B+2<i){let p=e[B+2].charCodeAt(0);if(p>=65&&p<=90||p>=97&&p<=122){let w=p%32;r+="\\x",r+=(w>>4).toString(16).toUpperCase(),r+=(w&15).toString(16).toUpperCase(),B+=3,s=!0;continue}}r+="c",B+=2,s=!0;continue;case"u":if(B+2<i){if(e[B+2]==="{"){let p=B+3,w=!1,A=!1;for(;p<i;){const L=e[p];if(L==="}"){A=!0;break}if(!Jr.isHexadecimal(L))break;w=!0,p++}if(A&&w){r+="\\x",B+=2,s=!0;continue}}else if(B+5<i){let p=!0;for(let w=0;w<4;w++)if(!Jr.isHexadecimal(e[B+2+w])){p=!1;break}if(p){r+="\\x{"+e.substring(B+2,B+6)+"}",B+=6,s=!0;continue}}}r+="u",B+=2,s=!0;continue;case"x":{let p=!1;if(B+2<i&&e[B+2]==="{"){let w=B+3,A=!1,L=!1;for(;w<i;){const M=e[w];if(M==="}"){L=!0;break}if(!Jr.isHexadecimal(M))break;A=!0,w++}L&&A&&(p=!0)}else B+3<i&&Jr.isHexadecimal(e[B+2])&&Jr.isHexadecimal(e[B+3])&&(p=!0);p?(r+="\\x",B+=2):(r+="x",B+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":r+="\\"+c,B+=2;continue;default:{let p=e.codePointAt(B+1);if(p>=48&&p<=57||p>=65&&p<=90||p>=97&&p<=122){let w=W.charCount(p);r+=e.substring(B+1,B+1+w),B+=w+1,s=!0}else{r+="\\";let w=W.charCount(p);r+=e.substring(B+1,B+1+w),B+=w+1}continue}}}else if(c==="/"){r+="\\/",B+=1,s=!0;continue}else if(c==="[")o=!0;else if(c==="]")o=!1;else if(!o&&c==="("&&B+2<i&&e[B+1]==="?"&&e[B+2]==="<"&&B+3<i&&!"=!>)".includes(e[B+3])){r+="(?P<",B+=3,s=!0;continue}let h=e.codePointAt(B),C=W.charCount(h);r+=e.substring(B,B+C),B+=C}const u=s?r:e;return t.length>0?`(?${t})${u}`:u}},Ne,_u=(Ne=class{static quote(e){return W.quoteMeta(e)}static quoteReplacement(e,t=!1){return Bh.quoteReplacement(e,t)}static translateRegExp(e){return Aw.translate(e)}static compile(e,t=0){let r=e;if((t&Ne.CASE_INSENSITIVE)!==0&&(r=`(?i)${r}`),(t&Ne.DOTALL)!==0&&(r=`(?s)${r}`),(t&Ne.MULTILINE)!==0&&(r=`(?m)${r}`),(t&-544)!==0)throw new iw("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=V.PERL;(t&Ne.DISABLE_UNICODE_GROUPS)!==0&&(s&=-129),(t&Ne.LOOKBEHINDS)!==0&&(s|=V.LOOKBEHIND);const i=new Ne(e,t);return i.re2Input=Tw.compileImpl(r,s,(t&Ne.LONGEST_MATCH)!==0),i}static matches(e,t){return Ne.compile(e).testExact(t)}static initTest(e,t,r){if(e==null)throw new Error("pattern is null");if(r==null)throw new Error("re2 is null");const s=new Ne(e,t);return s.re2Input=r,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return W.isByteArray(e)&&(e=Cr.utf8(e)),new Bh(this,e)}test(e){return W.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){const t=W.isByteArray(e)?Ie.fromUTF8(e):Ie.fromUTF16(e);return this.re2Input.executeEngine(t,0,V.ANCHOR_BOTH,0)!==null}exec(e){const t=this.matcher(e);if(!t.find())return null;const r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;return r}split(e,t=0){const r=this.matcher(e),s=[];let i=0,o=0;for(;r.find();){if(o===0&&r.end()===0){o=r.end();continue}if(t>0&&s.length===t-1)break;if(o===r.start()){if(t===0){i+=1,o=r.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.start())),o=r.end()}if(t===0&&o!==r.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.inputLength()))}return(t!==0||s.length===0&&!(o===r.inputLength()&&o>0))&&s.push(r.substring(o,r.inputLength())),s}*matchAll(e){const t=this.matcher(e);for(;t.find();){const r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;yield r}}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}},G(Ne,"CASE_INSENSITIVE",Ur.CASE_INSENSITIVE),G(Ne,"DOTALL",Ur.DOTALL),G(Ne,"MULTILINE",Ur.MULTILINE),G(Ne,"DISABLE_UNICODE_GROUPS",Ur.DISABLE_UNICODE_GROUPS),G(Ne,"LONGEST_MATCH",Ur.LONGEST_MATCH),G(Ne,"LOOKBEHINDS",Ur.LOOKBEHINDS),Ne);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let cs="12.18.0";function Rw(n){cs=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ar=new na("@firebase/firestore");function jr(){return Ar.logLevel}function K(n,...e){if(Ar.logLevel<=ue.DEBUG){const t=e.map(Du);Ar.debug(`Firestore (${cs}): ${n}`,...t)}}function dn(n,...e){if(Ar.logLevel<=ue.ERROR){const t=e.map(Du);Ar.error(`Firestore (${cs}): ${n}`,...t)}}function xt(n,...e){if(Ar.logLevel<=ue.WARN){const t=e.map(Du);Ar.warn(`Firestore (${cs}): ${n}`,...t)}}function Du(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,XC(n,r,t)}function XC(n,e,t){let r=`FIRESTORE (${cs}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw dn(r),new Error(r)}function Q(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||XC(e,s,r)}function re(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vw(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=vw(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function ae(n,e){return n<e?-1:n>e?1:0}function MB(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),i=e.charAt(r);if(s!==i)return fB(s)===fB(i)?ae(s,i):fB(s)?1:-1}return ae(n.length,e.length)}const Pw=55296,bw=57343;function fB(n){const e=n.charCodeAt(0);return e>=Pw&&e<=bw}function ns(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e,t){this.comparator=e,this.root=t||Je.EMPTY}insert(e,t){return new Re(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Je.BLACK,null,null))}remove(e){return new Re(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Je.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new uo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new uo(this.root,e,this.comparator,!1)}getReverseIterator(){return new uo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new uo(this.root,e,this.comparator,!0)}}class uo{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Je{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??Je.RED,this.left=s??Je.EMPTY,this.right=i??Je.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new Je(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Je.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Je.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Je.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Je.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw X(43730,{key:this.key,value:this.value});if(this.right.isRed())throw X(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw X(27949);return e+(this.isRed()?0:1)}}Je.EMPTY=null,Je.RED=!0,Je.BLACK=!1;Je.EMPTY=new class{constructor(){this.size=0}get key(){throw X(57766)}get value(){throw X(16141)}get color(){throw X(16727)}get left(){throw X(29726)}get right(){throw X(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new Je(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.comparator=e,this.data=new Re(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Nh(this.data.getIterator())}getIteratorFrom(e){return new Nh(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof ke)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new ke(this.comparator);return t.data=e,t}}class Nh{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class q extends Nt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ht="__name__";class Ut{constructor(e,t,r){t===void 0?t=0:t>e.length&&X(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&X(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Ut.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ut?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=Ut.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return ae(e.length,t.length)}static compareSegments(e,t){const r=Ut.isNumericId(e),s=Ut.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?Ut.extractNumericId(e).compare(Ut.extractNumericId(t)):MB(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Vn.fromString(e.substring(4,e.length-2))}}class Ce extends Ut{construct(e,t,r){return new Ce(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new q(k.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new Ce(t)}static emptyPath(){return new Ce([])}}const Sw=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let Tt=class Kr extends Ut{construct(e,t,r){return new Kr(e,t,r)}static isValidIdentifier(e){return Sw.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Kr.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ht}static keyField(){return new Kr([Ht])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new q(k.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let o=!1;for(;s<e.length;){const B=e[s];if(B==="\\"){if(s+1===e.length)throw new q(k.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new q(k.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else B==="`"?(o=!o,s++):B!=="."||o?(r+=B,s++):(i(),s++)}if(i(),o)throw new q(k.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Kr(t)}static emptyPath(){return new Kr([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e){this.fields=e,e.sort(Tt.comparator)}static empty(){return new wt([])}unionWith(e){let t=new ke(Tt.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new wt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return ns(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xo(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function tr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Ow(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function ZC(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${constructor(e){this.path=e}static fromPath(e){return new $(Ce.fromString(e))}static fromName(e){return new $(Ce.fromString(e).popFirst(5))}static empty(){return new $(Ce.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ce.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ce.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new $(new Ce(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ed(n,e,t){if(!t)throw new q(k.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Nw(n,e,t,r){if(e===!0&&r===!0)throw new q(k.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Fh(n){if(!$.isDocumentKey(n))throw new q(k.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Lh(n){if($.isDocumentKey(n))throw new q(k.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Ti(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function aa(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":X(12329,{type:typeof n})}function st(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new q(k.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=aa(n);throw new q(k.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Le(n,e){const t={typeString:n};return e&&(t.value=e),t}function Ai(n,e){if(!Ti(n))throw new q(k.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const o=n[r];if(s&&typeof o!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new q(k.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kh=-62135596800,xh=1e6;class Te{static now(){return Te.fromMillis(Date.now())}static fromDate(e){return Te.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*xh);return new Te(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new q(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new q(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<kh)throw new q(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new q(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/xh}_compareTo(e){return this.seconds===e.seconds?ae(this.nanoseconds,e.nanoseconds):ae(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Te._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ai(e,Te._jsonSchema))return new Te(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-kh;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Te._jsonSchemaVersion="firestore/timestamp/1.0",Te._jsonSchema={type:Le("string",Te._jsonSchemaVersion),seconds:Le("number"),nanoseconds:Le("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new td("Invalid base64 string: "+i):i}})(e);return new xe(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new xe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ae(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}xe.EMPTY_BYTE_STRING=new xe("");const Fw=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function qn(n){if(Q(!!n,39018),typeof n=="string"){let e=0;const t=Fw.exec(n);if(Q(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ve(n.seconds),nanos:ve(n.nanos)}}function ve(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Jn(n){return typeof n=="string"?xe.fromBase64String(n):xe.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nd="server_timestamp",rd="__type__",sd="__previous_value__",id="__local_write_time__";function Ba(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[rd])==null?void 0:r.stringValue)===nd}function Ri(n){const e=n.mapValue.fields[sd];return Ba(e)?Ri(e):e}function rs(n){const e=qn(n.mapValue.fields[id].timestampValue);return new Te(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lw{constructor(e,t,r,s,i,o,B,u,c,h,C,p,w){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=B,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=h,this.apiKey=C,this._customHeaders=p,this.grpcFlowControlWindow=w}}const Vo="(default)";class si{constructor(e,t){this.projectId=e,this.database=t||Vo}static empty(){return new si("","")}get isDefaultDatabase(){return this.database===Vo}isEqual(e){return e instanceof si&&e.projectId===this.projectId&&e.database===this.database}}function kw(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new q(k.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new si(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iu=-1;function ua(n){return n==null}function ii(n){return n===0&&1/n==-1/0}function xw(n){return typeof n=="number"&&Number.isInteger(n)&&!ii(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function Vw(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const od="__type__",Mw="__max__",co={mapValue:{}},ad="__vector__",oi="value",ss={nullValue:"NULL_VALUE"},pt={booleanValue:!0},qe={booleanValue:!1};function Ve(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Ba(n)?4:Gw(n)?9007199254740991:Mo(n)?10:11:X(28295,{value:n})}function Ot(n,e,t){if(n===e)return!0;const r=Ve(n);if(r!==Ve(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return rs(n).isEqual(rs(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const B=qn(i.timestampValue),u=qn(o.timestampValue);return B.seconds===u.seconds&&B.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,o){return Jn(i.bytesValue).isEqual(Jn(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,o){return ve(i.geoPointValue.latitude)===ve(o.geoPointValue.latitude)&&ve(i.geoPointValue.longitude)===ve(o.geoPointValue.longitude)})(n,e);case 2:return(function(i,o,B){if("integerValue"in i&&"integerValue"in o)return ve(i.integerValue)===ve(o.integerValue);let u,c;if("doubleValue"in i&&"doubleValue"in o)u=ve(i.doubleValue),c=ve(o.doubleValue);else{if(!(B!=null&&B.t))return!1;u=ve(i.integerValue??i.doubleValue),c=ve(o.integerValue??o.doubleValue)}return u===c?!!(B!=null&&B.i)||ii(u)===ii(c):!!(B===void 0||B.o)&&isNaN(u)&&isNaN(c)})(n,e,t);case 9:return ns(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>Ot(s,i,t)));case 10:case 11:return(function(i,o,B){const u=i.mapValue.fields||{},c=o.mapValue.fields||{};if(xo(u)!==xo(c))return!1;for(const h in u)if(u.hasOwnProperty(h)&&(c[h]===void 0||!Ot(u[h],c[h],B)))return!1;return!0})(n,e,t);default:return X(52216,{left:n})}}function ai(n,e){return(n.values||[]).find((t=>Ot(t,e)))!==void 0}function gt(n,e){if(n===e)return 0;const t=Ve(n),r=Ve(e);if(t!==r)return ae(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return ae(n.booleanValue,e.booleanValue);case 2:return(function(i,o){const B=ve(i.integerValue||i.doubleValue),u=ve(o.integerValue||o.doubleValue);return B<u?-1:B>u?1:B===u?0:isNaN(B)?isNaN(u)?0:-1:1})(n,e);case 3:return Vh(n.timestampValue,e.timestampValue);case 4:return Vh(rs(n),rs(e));case 5:return MB(n.stringValue,e.stringValue);case 6:return(function(i,o){const B=Jn(i),u=Jn(o);return B.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,o){const B=i.split("/"),u=o.split("/");for(let c=0;c<B.length&&c<u.length;c++){const h=ae(B[c],u[c]);if(h!==0)return h}return ae(B.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,o){const B=ae(ve(i.latitude),ve(o.latitude));return B!==0?B:ae(ve(i.longitude),ve(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Mh(n.arrayValue,e.arrayValue);case 10:return(function(i,o){var p,w,A,L;const B=i.fields||{},u=o.fields||{},c=(p=B[oi])==null?void 0:p.arrayValue,h=(w=u[oi])==null?void 0:w.arrayValue,C=ae(((A=c==null?void 0:c.values)==null?void 0:A.length)||0,((L=h==null?void 0:h.values)==null?void 0:L.length)||0);return C!==0?C:Mh(c,h)})(n.mapValue,e.mapValue);case 11:return(function(i,o){if(i===co.mapValue&&o===co.mapValue)return 0;if(i===co.mapValue)return 1;if(o===co.mapValue)return-1;const B=i.fields||{},u=Object.keys(B),c=o.fields||{},h=Object.keys(c);u.sort(),h.sort();for(let C=0;C<u.length&&C<h.length;++C){const p=MB(u[C],h[C]);if(p!==0)return p;const w=gt(B[u[C]],c[h[C]]);if(w!==0)return w}return ae(u.length,h.length)})(n.mapValue,e.mapValue);default:throw X(23264,{u:t})}}function Vh(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ae(n,e);const t=qn(n),r=qn(e),s=ae(t.seconds,r.seconds);return s!==0?s:ae(t.nanos,r.nanos)}function Mh(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=gt(t[s],r[s]);if(i!==void 0&&i!==0)return i}return ae(t.length,r.length)}function is(n){return GB(n)}function GB(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=qn(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Jn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return $.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=GB(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of r)i?i=!1:s+=",",s+=`${o}:${GB(t.fields[o])}`;return s+"}"})(n.mapValue):X(61005,{value:n})}function wo(n){switch(Ve(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ri(n);return e?16+wo(e):16;case 5:return 2*n.stringValue.length;case 6:return Jn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+wo(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return tr(r.fields,((i,o)=>{s+=i.length+wo(o)})),s})(n.mapValue);default:throw X(13486,{value:n})}}function Gh(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function qt(n){return!!n&&"integerValue"in n}function dr(n){return!!n&&"doubleValue"in n}function jn(n){return qt(n)||dr(n)}function os(n){return!!n&&"arrayValue"in n}function It(n){return!!n&&"nullValue"in n}function mt(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function mr(n){return!!n&&"mapValue"in n}function Mo(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[od])==null?void 0:r.stringValue)===ad}function UB(n){var e,t;return(t=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[oi])==null?void 0:t.arrayValue}function zs(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return tr(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=zs(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=zs(n.arrayValue.values[t]);return e}return{...n}}function Gw(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Mw}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this.value=e}static empty(){return new nt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!mr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=zs(t)}setAll(e){let t=Tt.emptyPath(),r={},s=[];e.forEach(((o,B)=>{if(!t.isImmediateParentOf(B)){const u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=B.popLast()}o?r[B.lastSegment()]=zs(o):s.push(B.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());mr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ot(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];mr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){tr(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new nt(zs(this.value))}}function Bd(n){const e=[];return tr(n.fields,((t,r)=>{const s=new Tt([t]);if(mr(r)){const i=Bd(r.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new wt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ca(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ii(e)?"-0":e}}function yu(n){return{integerValue:""+n}}function la(n,e,t){return xw(e)?yu(e):ca(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha{constructor(){this._=void 0}}function Uw(n,e,t){return n instanceof Bi?(function(s,i){const o={fields:{[rd]:{stringValue:nd},[id]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Ba(i)&&(i=Ri(i)),i&&(o.fields[sd]=i),{mapValue:o}})(t,e):n instanceof ui?cd(n,e):n instanceof ci?ld(n,e):n instanceof as?(function(s,i){const o=ud(s,i),B=Ho(o)+Ho(s.l);return qt(o)&&qt(s.l)?yu(B):ca(s.serializer,B)})(n,e):n instanceof Go?(function(s,i){return Uh(s,i,Math.min)})(n,e):n instanceof Uo?(function(s,i){return Uh(s,i,Math.max)})(n,e):void 0}function Hw(n,e,t){return n instanceof ui?cd(n,e):n instanceof ci?ld(n,e):t}function ud(n,e){return n instanceof as?jn(e)?e:{integerValue:0}:null}class Bi extends ha{}class ui extends ha{constructor(e){super(),this.elements=e}}function cd(n,e){const t=hd(e);for(const r of n.elements)t.some((s=>Ot(s,r)))||t.push(r);return{arrayValue:{values:t}}}class ci extends ha{constructor(e){super(),this.elements=e}}function ld(n,e){let t=hd(e);for(const r of n.elements)t=t.filter((s=>!Ot(s,r)));return{arrayValue:{values:t}}}class Tu extends ha{constructor(e,t){super(),this.serializer=e,this.l=t}}class as extends Tu{}class Go extends Tu{}class Uo extends Tu{}function Uh(n,e,t){if(!jn(e))return n.l;const r=t(Ho(e),Ho(n.l));return qt(e)&&qt(n.l)?yu(r):ca(n.serializer,r)}function Ho(n){return ve(n.integerValue||n.doubleValue)}function hd(n){return os(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e,t){this.field=e,this.transform=t}}function qw(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof ui&&s instanceof ui||r instanceof ci&&s instanceof ci?ns(r.elements,s.elements,Ot):r instanceof as&&s instanceof as||r instanceof Go&&s instanceof Go||r instanceof Uo&&s instanceof Uo?Ot(r.l,s.l):r instanceof Bi&&s instanceof Bi})(n.transform,e.transform)}class Jw{constructor(e,t){this.version=e,this.transformResults=t}}class it{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new it}static exists(e){return new it(void 0,e)}static updateTime(e){return new it(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Io(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class fa{}function Cd(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Ca(n.key,it.none()):new vi(n.key,n.data,it.none());{const t=n.data,r=nt.empty();let s=new ke(Tt.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new nr(n.key,r,new wt(s.toArray()),it.none())}}function jw(n,e,t){n instanceof vi?(function(s,i,o){const B=s.value.clone(),u=qh(s.fieldTransforms,i,o.transformResults);B.setAll(u),i.convertToFoundDocument(o.version,B).setHasCommittedMutations()})(n,e,t):n instanceof nr?(function(s,i,o){if(!Io(s.precondition,i))return void i.convertToUnknownDocument(o.version);const B=qh(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(dd(s)),u.setAll(B),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Qs(n,e,t,r){return n instanceof vi?(function(i,o,B,u){if(!Io(i.precondition,o))return B;const c=i.value.clone(),h=Jh(i.fieldTransforms,u,o);return c.setAll(h),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null})(n,e,t,r):n instanceof nr?(function(i,o,B,u){if(!Io(i.precondition,o))return B;const c=Jh(i.fieldTransforms,u,o),h=o.data;return h.setAll(dd(i)),h.setAll(c),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),B===null?null:B.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((C=>C.field)))})(n,e,t,r):(function(i,o,B){return Io(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):B})(n,e,t)}function Kw(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=ud(r.transform,s||null);i!=null&&(t===null&&(t=nt.empty()),t.set(r.field,i))}return t||null}function Hh(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&ns(r,s,((i,o)=>qw(i,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class vi extends fa{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class nr extends fa{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function dd(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function qh(n,e,t){const r=new Map;Q(n.length===t.length,32656,{h:t.length,T:n.length});for(let s=0;s<t.length;s++){const i=n[s],o=i.transform,B=e.data.field(i.field);r.set(i.field,Hw(o,B,t[s]))}return r}function Jh(n,e,t){const r=new Map;for(const s of n){const i=s.transform,o=t.data.field(s.field);r.set(s.field,Uw(i,o,e))}return r}class Ca extends fa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class zw extends fa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qo{constructor(e,t){this.position=e,this.inclusive=t}}function jh(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],o=n.position[s];if(i.field.isKeyField()?r=$.comparator($.fromName(o.referenceValue),t.key):r=gt(o,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Kh(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ot(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pd{}class Fe extends pd{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Ww(e,t,r):t==="array-contains"?new Xw(e,r):t==="in"?new Zw(e,r):t==="not-in"?new eI(e,r):t==="array-contains-any"?new tI(e,r):new Fe(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new $w(e,r):new Yw(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(gt(t,this.value)):t!==null&&Ve(this.value)===Ve(t)&&this.matchesComparison(gt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return X(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Vt extends pd{constructor(e,t){super(),this.filters=e,this.op=t,this.P=null}static create(e,t){return new Vt(e,t)}matches(e){return gd(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.P!==null||(this.P=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.P}getFilters(){return Object.assign([],this.filters)}}function gd(n){return n.op==="and"}function md(n){return Qw(n)&&gd(n)}function Qw(n){for(const e of n.filters)if(e instanceof Vt)return!1;return!0}function HB(n){if(n instanceof Fe)return n.field.canonicalString()+n.op.toString()+is(n.value);if(md(n))return n.filters.map((e=>HB(e))).join(",");{const e=n.filters.map((t=>HB(t))).join(",");return`${n.op}(${e})`}}function Ed(n,e){return n instanceof Fe?(function(r,s){return s instanceof Fe&&r.op===s.op&&r.field.isEqual(s.field)&&Ot(r.value,s.value)})(n,e):n instanceof Vt?(function(r,s){return s instanceof Vt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,o,B)=>i&&Ed(o,s.filters[B])),!0):!1})(n,e):void X(19439)}function _d(n){return n instanceof Fe?(function(t){return`${t.field.canonicalString()} ${t.op} ${is(t.value)}`})(n):n instanceof Vt?(function(t){return t.op.toString()+" {"+t.getFilters().map(_d).join(" ,")+"}"})(n):"Filter"}class Ww extends Fe{constructor(e,t,r){super(e,t,r),this.key=$.fromName(r.referenceValue)}matches(e){const t=$.comparator(e.key,this.key);return this.matchesComparison(t)}}class $w extends Fe{constructor(e,t){super(e,"in",t),this.keys=Dd("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Yw extends Fe{constructor(e,t){super(e,"not-in",t),this.keys=Dd("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Dd(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((r=>$.fromName(r.referenceValue)))}class Xw extends Fe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return os(t)&&ai(t.arrayValue,this.value)}}class Zw extends Fe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ai(this.value.arrayValue,t)}}class eI extends Fe{constructor(e,t){super(e,"not-in",t)}matches(e){if(ai(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ai(this.value.arrayValue,t)}}class tI extends Fe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!os(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>ai(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e,t="asc"){this.field=e,this.dir=t}}function nI(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{static fromTimestamp(e){return new ne(e)}static min(){return new ne(new Te(0,0))}static max(){return new ne(new Te(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e,t,r,s,i,o,B){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=B}static newInvalidDocument(e){return new We(e,0,ne.min(),ne.min(),ne.min(),nt.empty(),0)}static newFoundDocument(e,t,r,s){return new We(e,1,t,ne.min(),r,s,0)}static newNoDocument(e,t){return new We(e,2,t,ne.min(),ne.min(),nt.empty(),0)}static newUnknownDocument(e,t){return new We(e,3,t,ne.min(),ne.min(),nt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ne.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=nt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=nt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ne.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof We&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new We(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hi=-1;function rI(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=ne.fromTimestamp(r===1e9?new Te(t+1,0):new Te(t,r));return new Kn(s,$.empty(),e)}function sI(n){return new Kn(n.readTime,n.key,hi)}class Kn{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Kn(ne.min(),$.empty(),hi)}static max(){return new Kn(ne.max(),$.empty(),hi)}}function iI(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=$.comparator(n.documentKey,e.documentKey),t!==0?t:ae(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oI{constructor(e,t=null,r=[],s=[],i=null,o=null,B=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=B,this.R=null}}function zh(n,e=null,t=[],r=[],s=null,i=null,o=null){return new oI(n,e,t,r,s,i,o)}function wd(n){const e=re(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>HB(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),ua(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>is(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>is(r))).join(",")),e.R=t}return e.R}function Id(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!nI(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Ed(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Kh(n.startAt,e.startAt)&&Kh(n.endAt,e.endAt)}function hr(n){return!!n.isCorePipeline}function yd(n){return!!n.path&&$.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(e,t=null,r=[],s=[],i=null,o="F",B=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=B,this.endAt=u,this.I=null,this.A=null,this.V=null,this.startAt,this.endAt}}function aI(n,e,t,r,s,i,o,B){return new ls(n,e,t,r,s,i,o,B)}function da(n){return new ls(n)}function Qh(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function BI(n){return $.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Td(n){return n.collectionGroup!==null}function Ws(n){const e=re(n);if(e.I===null){e.I=[];const t=new Set;for(const i of e.explicitOrderBy)e.I.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let B=new ke(Tt.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(B=B.add(c.field))}))})),B})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.I.push(new li(i,r))})),t.has(Tt.keyField().canonicalString())||e.I.push(new li(Tt.keyField(),r))}return e.I}function zt(n){const e=re(n);return e.A||(e.A=uI(e,Ws(n))),e.A}function uI(n,e){if(n.limitType==="F")return zh(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new li(s.field,i)}));const t=n.endAt?new qo(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new qo(n.startAt.position,n.startAt.inclusive):null;return zh(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function qB(n,e){const t=n.filters.concat([e]);return new ls(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function cI(n,e){const t=n.explicitOrderBy.concat([e]);return new ls(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function JB(n,e,t){return new ls(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function lI(n,e){return Id(zt(n),zt(e))&&n.limitType===e.limitType}function $s(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>_d(s))).join(", ")}]`),ua(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>is(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>is(s))).join(",")),`Target(${r})`})(zt(n))}; limitType=${n.limitType})`}function pa(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):$.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of Ws(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(o,B,u){const c=jh(o,B,u);return o.inclusive?c<=0:c<0})(r.startAt,Ws(r),s)||r.endAt&&!(function(o,B,u){const c=jh(o,B,u);return o.inclusive?c>=0:c>0})(r.endAt,Ws(r),s))})(n,e)}function Au(n){return(e,t)=>{let r=!1;for(const s of Ws(n)){const i=hI(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function hI(n,e,t){const r=n.field.isKeyField()?$.comparator(e.key,t.key):(function(i,o,B){const u=o.data.field(i),c=B.data.field(i);return u!==null&&c!==null?gt(u,c):X(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return X(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fI{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Oe,le;function CI(n){switch(n){case k.OK:return X(64938);case k.CANCELLED:case k.UNKNOWN:case k.DEADLINE_EXCEEDED:case k.RESOURCE_EXHAUSTED:case k.INTERNAL:case k.UNAVAILABLE:case k.UNAUTHENTICATED:return!1;case k.INVALID_ARGUMENT:case k.NOT_FOUND:case k.ALREADY_EXISTS:case k.PERMISSION_DENIED:case k.FAILED_PRECONDITION:case k.ABORTED:case k.OUT_OF_RANGE:case k.UNIMPLEMENTED:case k.DATA_LOSS:return!0;default:return X(15467,{code:n})}}function Ad(n){if(n===void 0)return dn("GRPC error has no .code"),k.UNKNOWN;switch(n){case Oe.OK:return k.OK;case Oe.CANCELLED:return k.CANCELLED;case Oe.UNKNOWN:return k.UNKNOWN;case Oe.DEADLINE_EXCEEDED:return k.DEADLINE_EXCEEDED;case Oe.RESOURCE_EXHAUSTED:return k.RESOURCE_EXHAUSTED;case Oe.INTERNAL:return k.INTERNAL;case Oe.UNAVAILABLE:return k.UNAVAILABLE;case Oe.UNAUTHENTICATED:return k.UNAUTHENTICATED;case Oe.INVALID_ARGUMENT:return k.INVALID_ARGUMENT;case Oe.NOT_FOUND:return k.NOT_FOUND;case Oe.ALREADY_EXISTS:return k.ALREADY_EXISTS;case Oe.PERMISSION_DENIED:return k.PERMISSION_DENIED;case Oe.FAILED_PRECONDITION:return k.FAILED_PRECONDITION;case Oe.ABORTED:return k.ABORTED;case Oe.OUT_OF_RANGE:return k.OUT_OF_RANGE;case Oe.UNIMPLEMENTED:return k.UNIMPLEMENTED;case Oe.DATA_LOSS:return k.DATA_LOSS;default:return X(39323,{code:n})}}(le=Oe||(Oe={}))[le.OK=0]="OK",le[le.CANCELLED=1]="CANCELLED",le[le.UNKNOWN=2]="UNKNOWN",le[le.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",le[le.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",le[le.NOT_FOUND=5]="NOT_FOUND",le[le.ALREADY_EXISTS=6]="ALREADY_EXISTS",le[le.PERMISSION_DENIED=7]="PERMISSION_DENIED",le[le.UNAUTHENTICATED=16]="UNAUTHENTICATED",le[le.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",le[le.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",le[le.ABORTED=10]="ABORTED",le[le.OUT_OF_RANGE=11]="OUT_OF_RANGE",le[le.UNIMPLEMENTED=12]="UNIMPLEMENTED",le[le.INTERNAL=13]="INTERNAL",le[le.UNAVAILABLE=14]="UNAVAILABLE",le[le.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){tr(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return ZC(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dI=new Re($.comparator);function ft(){return dI}const Rd=new Re($.comparator);function zr(...n){let e=Rd;for(const t of n)e=e.insert(t.key,t);return e}function vd(n){let e=Rd;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Fn(){return Ys()}function Pd(){return Ys()}function Ys(){return new Fr((n=>n.toString()),((n,e)=>n.isEqual(e)))}const pI=new Re($.comparator),gI=new ke($.comparator);function oe(...n){let e=gI;for(const t of n)e=e.add(t);return e}const mI=new ke(ae);function EI(){return mI}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _I(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DI=new Vn([4294967295,4294967295],0);function Wh(n){const e=_I().encode(n),t=new GC;return t.update(e),new Uint8Array(t.digest())}function $h(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Vn([t,r],0),new Vn([s,i],0)]}class Ru{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Hs(`Invalid padding: ${t}`);if(r<0)throw new Hs(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Hs(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Hs(`Invalid padding when bitmap length is 0: ${t}`);this.m=8*e.length-t,this.p=Vn.fromNumber(this.m)}S(e,t,r){let s=e.add(t.multiply(Vn.fromNumber(r)));return s.compare(DI)===1&&(s=new Vn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.p).toNumber()}v(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.m===0)return!1;const t=Wh(e),[r,s]=$h(t);for(let i=0;i<this.hashCount;i++){const o=this.S(r,s,i);if(!this.v(o))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Ru(i,s,t);return r.forEach((B=>o.insert(B))),o}insert(e){if(this.m===0)return;const t=Wh(e),[r,s]=$h(t);for(let i=0;i<this.hashCount;i++){const o=this.S(r,s,i);this.D(o)}}D(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Hs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(e,t,r,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,bi.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Pi(ne.min(),s,new Re(ae),ft(),ft(),oe())}}class bi{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new bi(r,t,oe(),oe(),oe())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(e,t,r,s){this.C=e,this.removedTargetIds=t,this.key=r,this.F=s}}class bd{constructor(e,t){this.targetId=e,this.O=t}}class Sd{constructor(e,t,r=xe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Yh{constructor(e){this.targetId=e,this.M=0,this.N=Xh(),this.L=xe.EMPTY_BYTE_STRING,this.B=!1,this.U=!0}get current(){return this.B}get resumeToken(){return this.L}get k(){return this.M!==0}get q(){return this.U}$(e){e.approximateByteSize()>0&&(this.U=!0,this.L=e)}K(){let e=oe(),t=oe(),r=oe();return this.N.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:X(38017,{changeType:i})}})),new bi(this.L,this.B,e,t,r)}W(){this.U=!1,this.N=Xh()}G(e,t){this.U=!0,this.N=this.N.insert(e,t)}j(e){this.U=!0,this.N=this.N.remove(e)}H(){this.M+=1}J(){this.M-=1,Q(this.M>=0,3241,{M:this.M,targetId:this.targetId})}Y(){this.U=!0,this.B=!0}}const ks="WatchChangeAggregator";class wI{constructor(e){this.Z=e,this.X=new Map,this.ee=ft(),this.te=lo(),this.ne=ft(),this.re=lo(),this.ie=new Re(ae)}se(e){for(const t of e.C)e.F&&e.F.isFoundDocument()?this._e(t,e.F):this.oe(t,e.key,e.F);for(const t of e.removedTargetIds)this.oe(t,e.key,e.F)}ae(e){this.forEachTarget(e,(t=>{const r=this.X.get(t);if(r)switch(e.state){case 0:this.ue(t)&&r.$(e.resumeToken);break;case 1:r.J(),r.k||r.W(),r.$(e.resumeToken);break;case 2:r.J(),r.k||this.removeTarget(t);break;case 3:this.ue(t)&&(r.Y(),r.$(e.resumeToken));break;case 4:this.ue(t)&&(this.ce(t),r.$(e.resumeToken));break;default:X(56790,{state:e.state})}else K(ks,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.X.forEach(((r,s)=>{this.ue(s)&&t(s)}))}le(e){var t;return hr(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:yd(e)}Ee(e){const t=e.targetId,r=e.O.count,s=this.he(t);if(s){const i=s.target;if(this.le(i))if(r===0){const o=new $(hr(i)?Ce.fromString(i.getPipelineDocuments()[0]):i.path);this.oe(t,o,We.newNoDocument(o,ne.min()))}else Q(r===1,20013,"Single document existence filter with count: "+r);else{const o=this.Te(t);if(o!==r){const B=this.Pe(e),u=B?this.Re(B,e,o):1;if(u!==0){this.ce(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.ie=this.ie.insert(t,c)}}}}}Pe(e){const t=e.O.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let o,B;try{o=Jn(r).toUint8Array()}catch(u){if(u instanceof td)return xt("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{B=new Ru(o,s,i)}catch(u){return xt(u instanceof Hs?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return B.m===0?null:B}Re(e,t,r){return t.O.count===r-this.Ve(e,t.targetId)?0:2}Ve(e,t){const r=this.Z.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const o=this.Z.Ae(),B=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(B)||(this.oe(t,i,null),s++)})),s}de(e){const t=new Map;this.X.forEach(((i,o)=>{const B=this.he(o);if(B){if(i.current&&this.le(B.target)){const u=hr(B.target)?Ce.fromString(B.target.getPipelineDocuments()[0]):B.target.path,c=new $(u);this.fe(c).has(o)||this.me(o,c)||this.oe(o,c,We.newNoDocument(c,e))}i.q&&(t.set(o,i.K()),i.W())}}));let r=oe();this.re.forEach(((i,o)=>{let B=!0;o.forEachWhile((u=>{const c=this.he(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(B=!1,!1)})),B&&(r=r.add(i))})),this.ee.forEach(((i,o)=>o.setReadTime(e))),this.ne.forEach(((i,o)=>o.setReadTime(e)));const s=new Pi(e,t,this.ie,this.ee,this.ne,r);return this.ee=ft(),this.te=lo(),this.ne=ft(),this.re=lo(),this.ie=new Re(ae),s}_e(e,t){const r=this.X.get(e);if(!r||!this.ue(e))return void K(ks,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.me(e,t.key)?2:0;r.G(t.key,s),hr(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t.key,t):this.ee=this.ee.insert(t.key,t),this.te=this.te.insert(t.key,this.fe(t.key).add(e)),this.re=this.re.insert(t.key,this.pe(t.key).add(e))}oe(e,t,r){const s=this.X.get(e);s&&this.ue(e)?(this.me(e,t)?s.G(t,1):s.j(t),this.re=this.re.insert(t,this.pe(t).delete(e)),this.re=this.re.insert(t,this.pe(t).add(e)),r&&(hr(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t,r):this.ee=this.ee.insert(t,r))):K(ks,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.X.delete(e)}Te(e){const t=this.X.get(e);if(!t)return 0;const r=t.K();return this.Z.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}H(e){let t=this.X.get(e);t||(K(ks,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Yh(e),this.X.set(e,t)),t.H()}pe(e){let t=this.re.get(e);return t||(t=new ke(ae),this.re=this.re.insert(e,t)),t}fe(e){let t=this.te.get(e);return t||(t=new ke(ae),this.te=this.te.insert(e,t)),t}ue(e){const t=this.he(e)!==null;return t||K(ks,"Detected inactive target",e),t}he(e){const t=this.X.get(e);return t===void 0||t.k?null:this.Z.ge(e)}ce(e){this.X.set(e,new Yh(e)),this.Z.getRemoteKeysForTarget(e).forEach((t=>{this.oe(e,t,null)}))}me(e,t){return this.Z.getRemoteKeysForTarget(e).has(t)}}function lo(){return new Re($.comparator)}function Xh(){return new Re($.comparator)}const II={asc:"ASCENDING",desc:"DESCENDING"},yI={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},TI={and:"AND",or:"OR"};class AI{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function jB(n,e){return n.useProto3Json||ua(e)?e:{value:e}}function Jo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function vu(n){const e=qn(n);return new Te(e.seconds,e.nanos)}function Od(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function To(n,e){return Jo(n,e.toTimestamp())}function Qt(n){return Q(!!n,49232),ne.fromTimestamp(vu(n))}function Pu(n,e){return KB(n,e).canonicalString()}function KB(n,e){const t=(function(s){return new Ce(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Nd(n){const e=Ce.fromString(n);return Q(Vd(e),10190,{key:e.toString()}),e}function jo(n,e){return Pu(n.databaseId,e.path)}function CB(n,e){const t=Nd(e);if(t.get(1)!==n.databaseId.projectId)throw new q(k.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new q(k.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new $(Ld(t))}function Fd(n,e){return Pu(n.databaseId,e)}function RI(n){const e=Nd(n);return e.length===4?Ce.emptyPath():Ld(e)}function zB(n){return new Ce(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Ld(n){return Q(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Zh(n,e,t){return{name:jo(n,e),fields:t.value.mapValue.fields}}function vI(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:X(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,h){return c.useProto3Json?(Q(h===void 0||typeof h=="string",58123),xe.fromBase64String(h||"")):(Q(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),xe.fromUint8Array(h||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,B=o&&(function(c){const h=c.code===void 0?k.UNKNOWN:Ad(c.code);return new q(h,c.message||"")})(o);t=new Sd(r,s,i,B||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=CB(n,r.document.name),i=Qt(r.document.updateTime),o=r.document.createTime?Qt(r.document.createTime):ne.min(),B=new nt({mapValue:{fields:r.document.fields}}),u=We.newFoundDocument(s,i,o,B),c=r.targetIds||[],h=r.removedTargetIds||[];t=new yo(c,h,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=CB(n,r.document),i=r.readTime?Qt(r.readTime):ne.min(),o=We.newNoDocument(s,i),B=r.removedTargetIds||[];t=new yo([],B,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=CB(n,r.document),i=r.removedTargetIds||[];t=new yo([],i,s,null)}else{if(!("filter"in e))return X(11601,{ye:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,o=new fI(s,i),B=r.targetId;t=new bd(B,o)}}return t}function PI(n,e){let t;if(e instanceof vi)t={update:Zh(n,e.key,e.value)};else if(e instanceof Ca)t={delete:jo(n,e.key)};else if(e instanceof nr)t={update:Zh(n,e.key,e.data),updateMask:MI(e.fieldMask)};else{if(!(e instanceof zw))return X(16599,{we:e.type});t={verify:jo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,o){const B=o.transform;if(B instanceof Bi)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(B instanceof ui)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:B.elements}};if(B instanceof ci)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:B.elements}};if(B instanceof as)return{fieldPath:o.field.canonicalString(),increment:B.l};if(B instanceof Go)return{fieldPath:o.field.canonicalString(),minimum:B.l};if(B instanceof Uo)return{fieldPath:o.field.canonicalString(),maximum:B.l};throw X(20930,{transform:o.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:To(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:X(27497)})(n,e.precondition)),t}function bI(n,e){return n&&n.length>0?(Q(e!==void 0,14353),n.map((t=>(function(s,i){let o=s.updateTime?Qt(s.updateTime):Qt(i);return o.isEqual(ne.min())&&(o=Qt(i)),new Jw(o,s.transformResults||[])})(t,e)))):[]}function SI(n,e){return{documents:[Fd(n,e.path)]}}function OI(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Fd(n,s);const i=(function(c){if(c.length!==0)return xd(Vt.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(c){if(c.length!==0)return c.map((h=>(function(p){return{field:Qr(p.field),direction:kI(p.dir)}})(h)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const B=jB(n,e.limit);return B!==null&&(t.structuredQuery.limit=B),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{be:t,parent:s}}function NI(n){let e=RI(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){Q(r===1,65062);const h=t.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];t.where&&(i=(function(C){const p=kd(C);return p instanceof Vt&&md(p)?p.getFilters():[p]})(t.where));let o=[];t.orderBy&&(o=(function(C){return C.map((p=>(function(A){return new li(Wr(A.field),(function(M){switch(M){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(A.direction))})(p)))})(t.orderBy));let B=null;t.limit&&(B=(function(C){let p;return p=typeof C=="object"?C.value:C,ua(p)?null:p})(t.limit));let u=null;t.startAt&&(u=(function(C){const p=!!C.before,w=C.values||[];return new qo(w,p)})(t.startAt));let c=null;return t.endAt&&(c=(function(C){const p=!C.before,w=C.values||[];return new qo(w,p)})(t.endAt)),aI(e,s,o,i,B,"F",u,c)}function FI(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return X(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function LI(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function kd(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Wr(t.unaryFilter.field);return Fe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Wr(t.unaryFilter.field);return Fe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Wr(t.unaryFilter.field);return Fe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Wr(t.unaryFilter.field);return Fe.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return X(61313);default:return X(60726)}})(n):n.fieldFilter!==void 0?(function(t){return Fe.create(Wr(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return X(58110);default:return X(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Vt.create(t.compositeFilter.filters.map((r=>kd(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return X(1026)}})(t.compositeFilter.op))})(n):X(30097,{filter:n})}function kI(n){return II[n]}function xI(n){return yI[n]}function VI(n){return TI[n]}function Qr(n){return{fieldPath:n.canonicalString()}}function Wr(n){return Tt.fromServerFormat(n.fieldPath)}function xd(n){return n instanceof Fe?(function(t){if(t.op==="=="){if(mt(t.value))return{unaryFilter:{field:Qr(t.field),op:"IS_NAN"}};if(It(t.value))return{unaryFilter:{field:Qr(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(mt(t.value))return{unaryFilter:{field:Qr(t.field),op:"IS_NOT_NAN"}};if(It(t.value))return{unaryFilter:{field:Qr(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Qr(t.field),op:xI(t.op),value:t.value}}})(n):n instanceof Vt?(function(t){const r=t.getFilters().map((s=>xd(s)));return r.length===1?r[0]:{compositeFilter:{op:VI(t.op),filters:r}}})(n):X(54877,{filter:n})}function MI(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Vd(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Md(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function fi(n,e){const t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function Gd(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ga(n){return new AI(n,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Pt(xe.fromBase64String(e))}catch(t){throw new q(k.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Pt(xe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Pt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ai(e,Pt._jsonSchema))return Pt.fromBase64String(e.bytes)}}Pt._jsonSchemaVersion="firestore/bytes/1.0",Pt._jsonSchema={type:Le("string",Pt._jsonSchemaVersion),bytes:Le("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new q(k.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Tt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function GI(){return new Si(Ht)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new q(k.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new q(k.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ae(this._lat,e._lat)||ae(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Wt._jsonSchemaVersion}}static fromJSON(e){if(Ai(e,Wt._jsonSchema))return new Wt(e.latitude,e.longitude)}}Wt._jsonSchemaVersion="firestore/geoPoint/1.0",Wt._jsonSchema={type:Le("string",Wt._jsonSchemaVersion),latitude:Le("number"),longitude:Le("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Qe.UNAUTHENTICATED=new Qe(null),Qe.GOOGLE_CREDENTIALS=new Qe("google-credentials-uid"),Qe.FIRST_PARTY=new Qe("first-party-uid"),Qe.MOCK_USER=new Qe("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class UI{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Qe.UNAUTHENTICATED)))}shutdown(){}}class HI{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class qI{constructor(e){this.ve=e,this.currentUser=Qe.UNAUTHENTICATED,this.De=0,this.forceRefresh=!1,this.auth=null}start(e,t){Q(this.xe===void 0,42304);let r=this.De;const s=u=>this.De!==r?(r=this.De,t(u)):Promise.resolve();let i=new cn;this.xe=()=>{this.De++,this.currentUser=this.Ce(),i.resolve(),i=new cn,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},B=u=>{K("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.xe&&(this.auth.addAuthTokenListener(this.xe),o())};this.ve.onInit((u=>B(u))),setTimeout((()=>{if(!this.auth){const u=this.ve.getImmediate({optional:!0});u?B(u):(K("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new cn)}}),0),o()}getToken(){const e=this.De,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.De!==e?(K("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Q(typeof r.accessToken=="string",31837,{Fe:r}),new Ud(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.xe&&this.auth.removeAuthTokenListener(this.xe),this.xe=void 0}Ce(){const e=this.auth&&this.auth.getUid();return Q(e===null||typeof e=="string",2055,{Oe:e}),new Qe(e)}}class JI{constructor(e,t,r){this.Me=e,this.Ne=t,this.Le=r,this.type="FirstParty",this.user=Qe.FIRST_PARTY,this.Be=new Map}Ue(){return this.Le?this.Le():null}get headers(){this.Be.set("X-Goog-AuthUser",this.Me);const e=this.Ue();return e&&this.Be.set("Authorization",e),this.Ne&&this.Be.set("X-Goog-Iam-Authorization-Token",this.Ne),this.Be}}class jI{constructor(e,t,r){this.Me=e,this.Ne=t,this.Le=r}getToken(){return Promise.resolve(new JI(this.Me,this.Ne,this.Le))}start(e,t){e.enqueueRetryable((()=>t(Qe.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ef{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class KI{constructor(e,t){this.ke=t,this.forceRefresh=!1,this.appCheck=null,this.qe=null,this.$e=null,ht(e)&&e.settings.appCheckToken&&(this.$e=e.settings.appCheckToken)}start(e,t){Q(this.xe===void 0,3512);const r=i=>{i.error!=null&&K("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.qe;return this.qe=i.token,K("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.xe=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{K("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.xe&&this.appCheck.addTokenListener(this.xe)};this.ke.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.ke.getImmediate({optional:!0});i?s(i):K("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.$e)return Promise.resolve(new ef(this.$e));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Q(typeof t.token=="string",44558,{tokenResult:t}),this.qe=t.token,new ef(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.xe&&this.appCheck.removeTokenListener(this.xe),this.xe=void 0}}function Hd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zI{Ke(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tf="ConnectivityMonitor";class nf{constructor(){this.Qe=()=>this.We(),this.Ge=()=>this.ze(),this.je=[],this.He()}Ke(e){this.je.push(e)}shutdown(){window.removeEventListener("online",this.Qe),window.removeEventListener("offline",this.Ge)}He(){window.addEventListener("online",this.Qe),window.addEventListener("offline",this.Ge)}We(){K(tf,"Network connectivity changed: AVAILABLE");for(const e of this.je)e(0)}ze(){K(tf,"Network connectivity changed: UNAVAILABLE");for(const e of this.je)e(1)}static Je(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ho=null;function QB(){return ho===null?ho=(function(){return 268435456+Math.round(2147483648*Math.random())})():ho++,"0x"+ho.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dB="RestConnection",QI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class WI{get Ye(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Ze=t+"://"+e.host,this.Xe=`projects/${r}/databases/${s}`,this.et=this.databaseId.database===Vo?`project_id=${r}`:`project_id=${r}&database_id=${s}`}tt(e,t,r,s,i){const o=QB(),B=this.nt(e,t.toUriEncodedString());K(dB,`Sending RPC '${e}' ${o}:`,B,r);const u={"google-cloud-resource-prefix":this.Xe,"x-goog-request-params":this.et};this.rt(u,s,i);const{host:c}=new URL(B),h=Or(c);return this.it(e,B,u,r,h).then((C=>(K(dB,`Received RPC '${e}' ${o}: `,C),C)),(C=>{throw xt(dB,`RPC '${e}' ${o} failed with error: `,C,"url: ",B,"request:",r),C}))}st(e,t,r,s,i,o){return this.tt(e,t,r,s,i)}rt(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+cs})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}nt(e,t){const r=QI[e];let s=`${this.Ze}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $I{constructor(e){this._t=e._t,this.ot=e.ot}ut(e){this.ct=e}lt(e){this.Et=e}ht(e){this.Tt=e}onMessage(e){this.Pt=e}close(){this.ot()}send(e){this._t(e)}Rt(){this.ct()}It(){this.Et()}At(e){this.Tt(e)}Vt(e){this.Pt(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze="WebChannelConnection",xs=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Zr extends WI{constructor(e){super(e),this.dt=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static ft(){if(!Zr.gt){const e=JC();xs(e,qC.STAT_EVENT,(t=>{t.stat===LB.PROXY?K(ze,"STAT_EVENT: detected buffering proxy"):t.stat===LB.NOPROXY&&K(ze,"STAT_EVENT: detected no buffering proxy")})),Zr.gt=!0}}it(e,t,r,s,i){const o=QB();return new Promise(((B,u)=>{const c=new UC;c.setWithCredentials(!0),c.listenOnce(HC.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case Do.NO_ERROR:const C=c.getResponseJson();K(ze,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(C)),B(C);break;case Do.TIMEOUT:K(ze,`RPC '${e}' ${o} timed out`),u(new q(k.DEADLINE_EXCEEDED,"Request time out"));break;case Do.HTTP_ERROR:const p=c.getStatus();if(K(ze,`RPC '${e}' ${o} failed with status:`,p,"response text:",c.getResponseText()),p>0){let w=c.getResponseJson();Array.isArray(w)&&(w=w[0]);const A=w==null?void 0:w.error;if(A&&A.status&&A.message){const L=(function(j){const ee=j.toLowerCase().replace(/_/g,"-");return Object.values(k).indexOf(ee)>=0?ee:k.UNKNOWN})(A.status);u(new q(L,A.message))}else u(new q(k.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new q(k.UNAVAILABLE,"Connection failed."));break;default:X(9055,{yt:e,streamId:o,wt:c.getLastErrorCode(),bt:c.getLastError()})}}finally{K(ze,`RPC '${e}' ${o} completed.`)}}));const h=JSON.stringify(s);K(ze,`RPC '${e}' ${o} sending request:`,s),c.send(t,"POST",h,r,15)}))}St(e,t,r){const s=QB(),i=[this.Ze,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),B={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(B.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(B.useFetchStreams=!0),this.rt(B.initMessageHeaders,t,r),B.encodeInitMessageHeaders=!0;const c=i.join("");K(ze,`Creating RPC '${e}' stream ${s}: ${c}`,B);const h=o.createWebChannel(c,B);this.vt(h);let C=!1,p=!1;const w=new $I({_t:A=>{p?K(ze,`Not sending because RPC '${e}' stream ${s} is closed:`,A):(C||(K(ze,`Opening RPC '${e}' stream ${s} transport.`),h.open(),C=!0),K(ze,`RPC '${e}' stream ${s} sending:`,A),h.send(A))},ot:()=>h.close()});return xs(h,Us.EventType.OPEN,(()=>{p||(K(ze,`RPC '${e}' stream ${s} transport opened.`),w.Rt())})),xs(h,Us.EventType.CLOSE,(()=>{p||(p=!0,K(ze,`RPC '${e}' stream ${s} transport closed`),w.At(),this.Dt(h))})),xs(h,Us.EventType.ERROR,(A=>{p||(p=!0,xt(ze,`RPC '${e}' stream ${s} transport errored. Name:`,A.name,"Message:",A.message),w.At(new q(k.UNAVAILABLE,"The operation could not be completed")))})),xs(h,Us.EventType.MESSAGE,(A=>{var L;if(!p){const M=A.data[0];Q(!!M,16349);const j=M,ee=(j==null?void 0:j.error)||((L=j[0])==null?void 0:L.error);if(ee){K(ze,`RPC '${e}' stream ${s} received error:`,ee);const se=ee.status;let Be=(function(R){const E=Oe[R];if(E!==void 0)return Ad(E)})(se),De=ee.message;se==="NOT_FOUND"&&De.includes("database")&&De.includes("does not exist")&&De.includes(this.databaseId.database)&&xt(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Be===void 0&&(Be=k.INTERNAL,De="Unknown error status: "+se+" with message "+ee.message),p=!0,w.At(new q(Be,De)),h.close()}else K(ze,`RPC '${e}' stream ${s} received:`,M),w.Vt(M)}})),Zr.ft(),setTimeout((()=>{w.It()}),0),w}terminate(){this.dt.forEach((e=>e.close())),this.dt=[]}vt(e){this.dt.push(e)}Dt(e){this.dt=this.dt.filter((t=>t===e))}rt(e,t,r){super.rt(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return jC()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YI(n){return new Zr(n)}Zr.gt=!1;class qd{constructor(e,t,r=1e3,s=1.5,i=6e4){this.xt=e,this.timerId=t,this.Ct=r,this.Ft=s,this.Ot=i,this.Mt=0,this.Nt=null,this.Lt=Date.now(),this.reset()}reset(){this.Mt=0}Bt(){this.Mt=this.Ot}Ut(e){this.cancel();const t=Math.floor(this.Mt+this.kt()),r=Math.max(0,Date.now()-this.Lt),s=Math.max(0,t-r);s>0&&K("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Mt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Nt=this.xt.enqueueAfterDelay(this.timerId,s,(()=>(this.Lt=Date.now(),e()))),this.Mt*=this.Ft,this.Mt<this.Ct&&(this.Mt=this.Ct),this.Mt>this.Ot&&(this.Mt=this.Ot)}qt(){this.Nt!==null&&(this.Nt.skipDelay(),this.Nt=null)}cancel(){this.Nt!==null&&(this.Nt.cancel(),this.Nt=null)}kt(){return(Math.random()-.5)*this.Mt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rf="PersistentStream";class Jd{constructor(e,t,r,s,i,o,B,u){this.xt=e,this.$t=r,this.Kt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=B,this.listener=u,this.state=0,this.Qt=0,this.Wt=null,this.Gt=null,this.stream=null,this.zt=0,this.jt=new qd(e,t)}Ht(){return this.state===1||this.state===5||this.Jt()}Jt(){return this.state===2||this.state===3}start(){this.zt=0,this.state!==4?this.auth():this.Yt()}async stop(){this.Ht()&&await this.close(0)}Zt(){this.state=0,this.jt.reset()}Xt(){this.Jt()&&this.Wt===null&&(this.Wt=this.xt.enqueueAfterDelay(this.$t,6e4,(()=>this.en())))}tn(e){this.nn(),this.stream.send(e)}async en(){if(this.Jt())return this.close(0)}nn(){this.Wt&&(this.Wt.cancel(),this.Wt=null)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}async close(e,t){this.nn(),this.rn(),this.jt.cancel(),this.Qt++,e!==4?this.jt.reset():t&&t.code===k.RESOURCE_EXHAUSTED?(dn(t.toString()),dn("Using maximum backoff delay to prevent overloading the backend."),this.jt.Bt()):t&&t.code===k.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.sn(),this.stream.close(),this.stream=null),this.state=e,await this.listener.ht(t)}sn(){}auth(){this.state=1;const e=this._n(this.Qt),t=this.Qt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Qt===t&&this.an(r,s)}),(r=>{e((()=>{const s=new q(k.UNKNOWN,"Fetching auth token failed: "+r.message);return this.un(s)}))}))}an(e,t){const r=this._n(this.Qt);this.stream=this.cn(e,t),this.stream.ut((()=>{r((()=>this.listener.ut()))})),this.stream.lt((()=>{r((()=>(this.state=2,this.Gt=this.xt.enqueueAfterDelay(this.Kt,1e4,(()=>(this.Jt()&&(this.state=3),Promise.resolve()))),this.listener.lt())))})),this.stream.ht((s=>{r((()=>this.un(s)))})),this.stream.onMessage((s=>{r((()=>++this.zt==1?this.En(s):this.onNext(s)))}))}Yt(){this.state=5,this.jt.Ut((async()=>{this.state=0,this.start()}))}un(e){return K(rf,`close with error: ${e}`),this.stream=null,this.close(4,e)}_n(e){return t=>{this.xt.enqueueAndForget((()=>this.Qt===e?t():(K(rf,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class XI extends Jd{constructor(e,t,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}cn(e,t){return this.connection.St("Listen",e,t)}En(e){return this.onNext(e)}onNext(e){this.jt.reset();const t=vI(this.serializer,e),r=(function(i){if(!("targetChange"in i))return ne.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?ne.min():o.readTime?Qt(o.readTime):ne.min()})(e);return this.listener.hn(t,r)}Tn(e){const t={};t.database=zB(this.serializer),t.addTarget=(function(i,o){let B;const u=o.target;if(B=hr(u)?{pipelineQuery:LI(i,u)}:yd(u)?{documents:SI(i,u)}:{query:OI(i,u).be},B.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){B.resumeToken=Od(i,o.resumeToken);const c=jB(i,o.expectedCount);c!==null&&(B.expectedCount=c)}else if(o.snapshotVersion.compareTo(ne.min())>0){B.readTime=Jo(i,o.snapshotVersion.toTimestamp());const c=jB(i,o.expectedCount);c!==null&&(B.expectedCount=c)}return B})(this.serializer,e);const r=FI(this.serializer,e);r&&(t.labels=r),this.tn(t)}Pn(e){const t={};t.database=zB(this.serializer),t.removeTarget=e,this.tn(t)}}class ZI extends Jd{constructor(e,t,r,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}get Rn(){return this.zt>0}start(){this.lastStreamToken=void 0,super.start()}sn(){this.Rn&&this.In([])}cn(e,t){return this.connection.St("Write",e,t)}En(e){return Q(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Q(!e.writeResults||e.writeResults.length===0,55816),this.listener.An()}onNext(e){Q(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.jt.reset();const t=bI(e.writeResults,e.commitTime),r=Qt(e.commitTime);return this.listener.Vn(r,t)}dn(){const e={};e.database=zB(this.serializer),this.tn(e)}In(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>PI(this.serializer,r)))};this.tn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{}class ty extends ey{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.fn=!1}mn(){if(this.fn)throw new q(k.FAILED_PRECONDITION,"The client has already been terminated.")}tt(e,t,r,s){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.tt(e,KB(t,r),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new q(k.UNKNOWN,i.toString())}))}st(e,t,r,s,i){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,B])=>this.connection.st(e,KB(t,r),s,o,B,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new q(k.UNKNOWN,o.toString())}))}terminate(){this.fn=!0,this.connection.terminate()}}function ny(n,e,t,r){return new ty(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ry="ComponentProvider",sf=new Map;function sy(n,e,t,r,s){return new Lw(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Hd(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const of={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},jd=41943040;class ct{static withCacheSize(e){return new ct(e,ct.DEFAULT_COLLECTION_PERCENTILE,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}ct.DEFAULT_COLLECTION_PERCENTILE=10,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ct.DEFAULT=new ct(jd,ct.DEFAULT_COLLECTION_PERCENTILE,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ct.DISABLED=new ct(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.pn(r),this.gn=r=>t.writeSequenceNumber(r))}pn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.gn&&this.gn(e),e}}ma.yn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iy="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class oy{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hs(n){if(n.code!==k.FAILED_PRECONDITION||n.message!==iy)throw n;K("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&X(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new x(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof x?t:x.resolve(t)}catch(t){return x.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):x.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):x.reject(t)}static resolve(e){return new x(((t,r)=>{t(e)}))}static reject(e){return new x(((t,r)=>{r(e)}))}static waitFor(e){return new x(((t,r)=>{let s=0,i=0,o=!1;e.forEach((B=>{++s,B.next((()=>{++i,o&&i===s&&t()}),(u=>r(u)))})),o=!0,i===s&&t()}))}static or(e){let t=x.resolve(!1);for(const r of e)t=t.next((s=>s?x.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new x(((r,s)=>{const i=e.length,o=new Array(i);let B=0;for(let u=0;u<i;u++){const c=u;t(e[c]).next((h=>{o[c]=h,++B,B===i&&r(o)}),(h=>s(h)))}}))}static doWhile(e,t){return new x(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function ay(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function fs(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const af="LruGarbageCollector",By=1048576;function Bf([n,e],[t,r]){const s=ae(n,t);return s===0?ae(e,r):s}class uy{constructor(e){this.Jn=e,this.buffer=new ke(Bf),this.Yn=0}Zn(){return++this.Yn}Xn(e){const t=[e,this.Zn()];if(this.buffer.size<this.Jn)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Bf(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class cy{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.tr(6e4)}stop(){this.er&&(this.er.cancel(),this.er=null)}get started(){return this.er!==null}tr(e){K(af,`Garbage collection scheduled in ${e}ms`),this.er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){fs(t)?K(af,"Ignoring IndexedDB error during garbage collection: ",t):await hs(t)}await this.tr(3e5)}))}}class ly{constructor(e,t){this.nr=e,this.params=t}calculateTargetCount(e,t){return this.nr.rr(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return x.resolve(ma.yn);const r=new uy(t);return this.nr.forEachTarget(e,(s=>r.Xn(s.sequenceNumber))).next((()=>this.nr.ir(e,(s=>r.Xn(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.nr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.nr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(K("LruGarbageCollector","Garbage collection skipped; disabled"),x.resolve(of)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(K("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),of):this.sr(e,t)))}getCacheSize(e){return this.nr.getCacheSize(e)}sr(e,t){let r,s,i,o,B,u,c;const h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((C=>(C>this.params.maximumSequenceNumbersToCollect?(K("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${C}`),s=this.params.maximumSequenceNumbersToCollect):s=C,o=Date.now(),this.nthSequenceNumber(e,s)))).next((C=>(r=C,B=Date.now(),this.removeTargets(e,r,t)))).next((C=>(i=C,u=Date.now(),this.removeOrphanedDocuments(e,r)))).next((C=>(c=Date.now(),jr()<=ue.DEBUG&&K("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-h}ms
	Determined least recently used ${s} in `+(B-o)+`ms
	Removed ${i} targets in `+(u-B)+`ms
	Removed ${C} documents in `+(c-u)+`ms
Total Duration: ${c-h}ms`),x.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:C}))))}}function hy(n,e){return new ly(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kd="firestore.googleapis.com",uf=!0;class cf{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new q(k.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Kd,this.ssl=uf}else this.host=e.host,this.ssl=e.ssl??uf;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=jd;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<By)throw new q(k.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(Nw("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Hd(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new q(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new q(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new q(k.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new q(k.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;const i=Object.keys(r),o=Object.keys(s);if(i.length!==o.length)return!1;for(const B of i)if(r[B]!==s[B])return!1;return!0})(this._customHeaders,e._customHeaders)}}let Ea=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new cf({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new q(k.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new q(k.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new cf(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new UI;switch(r.type){case"firstParty":return new jI(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new q(k.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=sf.get(t);r&&(K(ry,"Removing Datastore"),sf.delete(t),r.terminate())})(this),Promise.resolve()}};function fy(n,e,t,r={}){var c;n=st(n,Ea);const s=Or(e),i=n._getSettings(),o={...i,emulatorOptions:n._getEmulatorOptions()},B=`${e}:${t}`;s&&au(`https://${B}`),i.host!==Kd&&i.host!==B&&xt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:B,ssl:s,emulatorOptions:r};if(!Hn(u,o)&&(n._setSettings(u),r.mockUserToken)){let h,C;if(typeof r.mockUserToken=="string")h=r.mockUserToken,C=Qe.MOCK_USER;else{h=Xf(r.mockUserToken,(c=n._app)==null?void 0:c.options.projectId);const p=r.mockUserToken.sub||r.mockUserToken.user_id;if(!p)throw new q(k.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");C=new Qe(p)}n._authCredentials=new HI(new Ud(h,C))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new rr(this.firestore,e,this._query)}}class Pe{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Mn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Pe(this.firestore,e,this._key)}toJSON(){return{type:Pe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Ai(t,Pe._jsonSchema))return new Pe(e,r||null,new $(Ce.fromString(t.referencePath)))}}Pe._jsonSchemaVersion="firestore/documentReference/1.0",Pe._jsonSchema={type:Le("string",Pe._jsonSchemaVersion),referencePath:Le("string")};class Mn extends rr{constructor(e,t,r){super(e,t,da(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Pe(this.firestore,null,new $(e))}withConverter(e){return new Mn(this.firestore,e,this._path)}}function cb(n,e,...t){if(n=de(n),ed("collection","path",e),n instanceof Ea){const r=Ce.fromString(e,...t);return Lh(r),new Mn(n,null,r)}{if(!(n instanceof Pe||n instanceof Mn))throw new q(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Ce.fromString(e,...t));return Lh(r),new Mn(n.firestore,null,r)}}function Cy(n,e,...t){if(n=de(n),arguments.length===1&&(e=wu.newId()),ed("doc","path",e),n instanceof Ea){const r=Ce.fromString(e,...t);return Fh(r),new Pe(n,null,new $(r))}{if(!(n instanceof Pe||n instanceof Mn))throw new q(k.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Ce.fromString(e,...t));return Fh(r),new Pe(n.firestore,n instanceof Mn?n.converter:null,new $(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:dt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ai(e,dt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new dt(e.vectorValues);throw new q(k.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}dt._jsonSchemaVersion="firestore/vectorValue/1.0",dt._jsonSchema={type:Le("string",dt._jsonSchemaVersion),vectorValues:Le("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dy=/^__.*__$/;class py{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new nr(e,this.data,this.fieldMask,t,this.fieldTransforms):new vi(e,this.data,t,this.fieldTransforms)}}class zd{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new nr(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Qd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw X(40011,{dataSource:n})}}class bu{constructor(e,t,r,s,i,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new bu({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Ko(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(Qd(this.dataSource)&&dy.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class gy{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||ga(e)}createContext(e,t,r,s=!1){return new bu({dataSource:e,methodName:t,targetDoc:r,path:Tt.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ni(n){const e=n._freezeSettings(),t=ga(n._databaseId);return new gy(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Su(n,e,t,r,s,i={}){const o=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);Fu("Data must be an object, but it was:",o,r);const B=Yd(r,o);let u,c;if(i.merge)u=new wt(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const h=[];for(const C of i.mergeFields){const p=Qn(e,C,t);if(!o.contains(p))throw new q(k.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);ep(h,p)||h.push(p)}u=new wt(h),c=o.fieldTransforms.filter((C=>u.covers(C.field)))}else u=null,c=o.fieldTransforms;return new py(new nt(B),u,c)}class Fi extends Oi{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Fi}}class Ou extends Oi{_toFieldTransform(e){return new fd(e.path,new Bi)}isEqual(e){return e instanceof Ou}}class Nu extends Oi{constructor(e,t){super(e),this.ar=t}_toFieldTransform(e){const t=new as(e.serializer,la(e.serializer,this.ar));return new fd(e.path,t)}isEqual(e){return e instanceof Nu&&(this.ar===e.ar||Number.isNaN(this.ar)&&Number.isNaN(e.ar))}}function Wd(n,e,t,r){const s=n.createContext(1,e,t);Fu("Data must be an object, but it was:",s,r);const i=[],o=nt.empty();tr(r,((u,c)=>{const h=Zd(e,u,t);c=de(c);const C=s.childContextForFieldPath(h);if(c instanceof Fi)i.push(h);else{const p=zn(c,C);p!=null&&(i.push(h),o.set(h,p))}}));const B=new wt(i);return new zd(o,B,s.fieldTransforms)}function $d(n,e,t,r,s,i){const o=n.createContext(1,e,t),B=[Qn(e,r,t)],u=[s];if(i.length%2!=0)throw new q(k.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<i.length;p+=2)B.push(Qn(e,i[p])),u.push(i[p+1]);const c=[],h=nt.empty();for(let p=B.length-1;p>=0;--p)if(!ep(c,B[p])){const w=B[p];let A=u[p];A=de(A);const L=o.childContextForFieldPath(w);if(A instanceof Fi)c.push(w);else{const M=zn(A,L);M!=null&&(c.push(w),h.set(w,M))}}const C=new wt(c);return new zd(h,C,o.fieldTransforms)}function my(n,e,t,r=!1){return zn(t,n.createContext(r?4:3,e))}function zn(n,e,t){if(Xd(n=de(n)))return Fu("Unsupported field value:",e,n),Yd(n,e);if(n instanceof Oi)return(function(s,i){if(!Qd(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const o=[];let B=0;for(const u of s){let c=zn(u,i.childContextForArray(B));c==null&&(c={nullValue:"NULL_VALUE"}),o.push(c),B++}return{arrayValue:{values:o}}})(n,e)}return(function(s,i,o){if((s=de(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return la(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const B=Te.fromDate(s);return{timestampValue:Jo(i.serializer,B)}}if(s instanceof Te){const B=new Te(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Jo(i.serializer,B)}}if(s instanceof Wt)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Pt)return{bytesValue:Od(i.serializer,s._byteString)};if(s instanceof Pe){const B=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(B))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${B.projectId}/${B.database}`);return{referenceValue:Pu(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof dt)return(function(u,c){const h=u instanceof dt?u.toArray():u;return{mapValue:{fields:{[od]:{stringValue:ad},[oi]:{arrayValue:{values:h.map((p=>{if(typeof p!="number")throw c.createError("VectorValues must only contain numeric values.");return ca(c.serializer,p)}))}}}}}})(s,i);if(Md(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${aa(s)}`)})(n,e)}function Yd(n,e){const t={};return ZC(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):tr(n,((r,s)=>{const i=zn(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function Xd(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Te||n instanceof Wt||n instanceof Pt||n instanceof Pe||n instanceof Oi||n instanceof dt||Md(n))}function Fu(n,e,t){if(!Xd(t)||!Ti(t)){const r=aa(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function Qn(n,e,t){if((e=de(e))instanceof Si)return e._internalPath;if(typeof e=="string")return Zd(n,e);throw Ko("Field path arguments must be of type string or ",n,!1,void 0,t)}const Ey=new RegExp("[~\\*/\\[\\]]");function Zd(n,e,t){if(e.search(Ey)>=0)throw Ko(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Si(...e.split("."))._internalPath}catch{throw Ko(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Ko(n,e,t,r,s){const i=r&&!r.isEmpty(),o=s!==void 0;let B=`Function ${e}() called with invalid data`;t&&(B+=" (via `toFirestore()`)"),B+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${r}`),o&&(u+=` in document ${s}`),u+=")"),new q(k.INVALID_ARGUMENT,B+n+u)}function ep(n,e){return n.some((t=>t.isEqual(e)))}function tp(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const r=nt.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const o=e[s];let B;i.nestedOptions&&Ti(o)?B={mapValue:{fields:new Ye(i.nestedOptions).getOptionsProto(t,o)}}:o&&(B=zn(o,t)??void 0),B&&r.set(Tt.fromServerFormat(i.serverName),B)}}return r}getOptionsProto(e,t,r){const s=this._getKnownOptions(t,e);if(r){const i=new Map(Ow(r,((o,B)=>[Tt.fromServerFormat(B),o!==void 0?zn(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _y(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Ti(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lb(){return new Fi("deleteField")}function hb(){return new Ou("serverTimestamp")}function fb(n){return new Nu("increment",n)}function Dy(n){return new dt(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H(n){let e;return n instanceof Lr?n:(e=Ti(n)?Ay(n):n instanceof Array?Ry(n):np(n,void 0),e)}function pB(n){if(n instanceof Lr)return n;if(n instanceof dt)return Ci(n);if(Array.isArray(n))return Ci(Dy(n));throw new Error("Unsupported value: "+typeof n)}function Lu(n){return Vw(n)?Ao(n):H(n)}class Lr{constructor(){this._protoValueType="ProtoValue"}add(e){return new F("add",[this,H(e)],"add")}asBoolean(){if(this instanceof Wn)return this;if(this instanceof ds)return new sp(this);if(this instanceof Cs)return new Ty(this);if(this instanceof F)return new rp(this);throw new q("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new F("subtract",[this,H(e)],"subtract")}multiply(e){return new F("multiply",[this,H(e)],"multiply")}divide(e){return new F("divide",[this,H(e)],"divide")}mod(e){return new F("mod",[this,H(e)],"mod")}equal(e){return new F("equal",[this,H(e)],"equal").asBoolean()}notEqual(e){return new F("not_equal",[this,H(e)],"notEqual").asBoolean()}lessThan(e){return new F("less_than",[this,H(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new F("less_than_or_equal",[this,H(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new F("greater_than",[this,H(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new F("greater_than_or_equal",[this,H(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const r=[e,...t].map((s=>H(s)));return new F("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new F("array_contains",[this,H(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new qs(e.map(H),"arrayContainsAll"):e;return new F("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new qs(e.map(H),"arrayContainsAny"):e;return new F("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new F("array_reverse",[this])}arrayLength(){return new F("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new qs(e.map(H),"equalAny"):e;return new F("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new qs(e.map(H),"notEqualAny"):e;return new F("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new F("exists",[this],"exists").asBoolean()}charLength(){return new F("char_length",[this],"charLength")}like(e){return new F("like",[this,H(e)],"like").asBoolean()}regexContains(e){return new F("regex_contains",[this,H(e)],"regexContains").asBoolean()}regexFind(e){return new F("regex_find",[this,H(e)],"regexFind")}regexFindAll(e){return new F("regex_find_all",[this,H(e)],"regexFindAll")}regexMatch(e){return new F("regex_match",[this,H(e)],"regexMatch").asBoolean()}stringContains(e){return new F("string_contains",[this,H(e)],"stringContains").asBoolean()}startsWith(e){return new F("starts_with",[this,H(e)],"startsWith").asBoolean()}endsWith(e){return new F("ends_with",[this,H(e)],"endsWith").asBoolean()}toLower(){return new F("to_lower",[this],"toLower")}toUpper(){return new F("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(H(e)),new F("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(H(e)),new F("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(H(e)),new F("rtrim",t,"rtrim")}type(){return new F("type",[this])}isType(e){return new F("is_type",[this,Ci(e)],"isType").asBoolean()}stringConcat(e,...t){const r=[e,...t].map(H);return new F("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new F("string_index_of",[this,H(e)],"stringIndexOf")}stringRepeat(e){return new F("string_repeat",[this,H(e)],"stringRepeat")}stringReplaceAll(e,t){return new F("string_replace_all",[this,H(e),H(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new F("string_replace_one",[this,H(e),H(t)],"stringReplaceOne")}concat(e,...t){const r=[e,...t].map(H);return new F("concat",[this,...r],"concat")}reverse(){return new F("reverse",[this],"reverse")}arrayFilter(e,t){return new F("array_filter",[this,H(e),t],"arrayFilter")}arrayTransform(e,t){return new F("array_transform",[this,H(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new F("array_transform",[this,H(e),H(t),r],"arrayTransformWithIndex")}arraySlice(e,t){const r=[this,H(e)];return t!==void 0&&r.push(H(t)),new F("array_slice",r,"arraySlice")}arrayFirst(){return new F("array_first",[this],"arrayFirst")}arrayFirstN(e){return new F("array_first_n",[this,H(e)],"arrayFirstN")}arrayLast(){return new F("array_last",[this],"arrayLast")}arrayLastN(e){return new F("array_last_n",[this,H(e)],"arrayLastN")}arrayMaximum(){return new F("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new F("maximum_n",[this,H(e)],"arrayMaximumN")}arrayMinimum(){return new F("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new F("minimum_n",[this,H(e)],"arrayMinimumN")}arrayIndexOf(e){return new F("array_index_of",[this,H(e),H("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new F("array_index_of",[this,H(e),H("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new F("array_index_of_all",[this,H(e)],"arrayIndexOfAll")}byteLength(){return new F("byte_length",[this],"byteLength")}ceil(){return new F("ceil",[this])}floor(){return new F("floor",[this])}abs(){return new F("abs",[this])}exp(){return new F("exp",[this])}mapGet(e){return new F("map_get",[this,Ci(e)],"mapGet")}mapSet(e,t,...r){const s=[this,H(e),H(t),...r.map(H)];return new F("map_set",s,"mapSet")}mapKeys(){return new F("map_keys",[this],"mapKeys")}mapValues(){return new F("map_values",[this],"mapValues")}mapEntries(){return new F("map_entries",[this],"mapEntries")}getField(e){return new F("get_field",[this,H(e)],"get_field")}count(){return Dt._create("count",[this],"count")}sum(){return Dt._create("sum",[this],"sum")}average(){return Dt._create("average",[this],"average")}minimum(){return Dt._create("minimum",[this],"minimum")}maximum(){return Dt._create("maximum",[this],"maximum")}first(){return Dt._create("first",[this],"first")}last(){return Dt._create("last",[this],"last")}arrayAgg(){return Dt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Dt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Dt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const r=[e,...t];return new F("maximum",[this,...r.map(H)],"logicalMaximum")}logicalMinimum(e,...t){const r=[e,...t];return new F("minimum",[this,...r.map(H)],"minimum")}vectorLength(){return new F("vector_length",[this],"vectorLength")}cosineDistance(e){return new F("cosine_distance",[this,pB(e)],"cosineDistance")}dotProduct(e){return new F("dot_product",[this,pB(e)],"dotProduct")}euclideanDistance(e){return new F("euclidean_distance",[this,pB(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new F("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new F("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new F("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new F("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new F("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new F("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new F("timestamp_add",[this,H(e),H(t)],"timestampAdd")}timestampSubtract(e,t){return new F("timestamp_subtract",[this,H(e),H(t)],"timestampSubtract")}timestampDiff(e,t){return new F("timestamp_diff",[this,Lu(e),H(t)],"timestampDiff")}timestampExtract(e,t){const r=[this,H(e)];return t&&r.push(H(t)),new F("timestamp_extract",r,"timestampExtract")}documentId(){return new F("document_id",[this],"documentId")}parent(){return new F("parent",[this],"parent")}substring(e,t){const r=H(e);return new F("substring",t===void 0?[this,r]:[this,r,H(t)],"substring")}arrayGet(e){return new F("array_get",[this,H(e)],"arrayGet")}isError(){return new F("is_error",[this],"isError").asBoolean()}ifError(e){const t=new F("if_error",[this,H(e)],"ifError");return e instanceof Wn?t.asBoolean():t}isAbsent(){return new F("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new F("map_remove",[this,H(e)],"mapRemove")}mapMerge(e,...t){const r=H(e),s=t.map(H);return new F("map_merge",[this,r,...s],"mapMerge")}pow(e){return new F("pow",[this,H(e)])}trunc(e){return e===void 0?new F("trunc",[this]):new F("trunc",[this,H(e)],"trunc")}round(e){return e===void 0?new F("round",[this]):new F("round",[this,H(e)],"round")}collectionId(){return new F("collection_id",[this])}length(){return new F("length",[this])}ln(){return new F("ln",[this])}sqrt(){return new F("sqrt",[this])}stringReverse(){return new F("string_reverse",[this])}ifAbsent(e){return new F("if_absent",[this,H(e)],"ifAbsent")}ifNull(e){return new F("if_null",[this,H(e)],"ifNull")}coalesce(e,...t){return new F("coalesce",[this,H(e),...t.map(H)],"coalesce")}join(e){return new F("join",[this,H(e)],"join")}log10(){return new F("log10",[this])}arraySum(){return new F("sum",[this])}split(e){return new F("split",[this,H(e)])}timestampTruncate(e,t){const r=[this,H(e)];return t&&r.push(H(t)),new F("timestamp_trunc",r)}ascending(){return vy(this)}descending(){return Py(this)}as(e){return new Iy(this,e,"as")}}class Dt{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){const s=new Dt(e,t);return s._methodName=r,s}as(e){return new wy(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class wy{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}}class Iy{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class qs extends Lr{constructor(e,t){super(),this.ur=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.ur.map((t=>t._toProto(e)))}}}_readUserData(e){this.ur.forEach((t=>t._readUserData(e)))}}class Cs extends Lr{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new F("geo_distance",[this,H(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function Ao(n){return yy(n,"field")}function yy(n,e){return new Cs(typeof n=="string"?Ht===n?GI()._internalPath:Qn("field",n):n._internalPath,e)}class ds extends Lr{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new ds(e,void 0);return t._protoValue=e,t}_toProto(e){return Q(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,_y(this._protoValue)||(this._protoValue=zn(this.value,e))}}function Ci(n,e){return np(n,"constant")}function np(n,e){const t=new ds(n,e);return typeof n=="boolean"?new sp(t):t}class F extends Lr{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new Ye({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class Wn extends Lr{get _methodName(){return this._expr._methodName}countIf(){return Dt._create("count_if",[this],"countIf")}not(){return new F("not",[this],"not").asBoolean()}conditional(e,t){return new F("conditional",[this,e,t],"conditional")}ifError(e){const t=H(e),r=new F("if_error",[this,t],"ifError");return t instanceof Wn?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class rp extends Wn{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class sp extends Wn{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class Ty extends Wn{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function Ay(n,e){const t=[];for(const r in n)if(Object.prototype.hasOwnProperty.call(n,r)){const s=n[r];t.push(Ci(r)),t.push(H(s))}return new F("map",t,"map")}function Ry(n){return(function(t,r){return new F("array",t.map((s=>H(s))),r)})(n,"array")}function vy(n){return new ip(Lu(n),"ascending","ascending")}function Py(n){return new ip(Lu(n),"descending","descending")}class ip{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:Gd(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class op extends Rt{get _name(){return"add_fields"}get _optionsUtil(){return new Ye({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[fi(e,this.fields)]}}_readUserData(e){super._readUserData(e),$n(this.fields,e)}}class ap extends Rt{get _name(){return"aggregate"}get _optionsUtil(){return new Ye({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[fi(e,this.accumulators),fi(e,this.groups)]}}_readUserData(e){super._readUserData(e),$n(this.groups,e),$n(this.accumulators,e)}}class Bp extends Rt{get _name(){return"distinct"}get _optionsUtil(){return new Ye({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[fi(e,this.groups)]}}_readUserData(e){super._readUserData(e),$n(this.groups,e)}}class _a extends Rt{get _name(){return"collection"}get _optionsUtil(){return new Ye({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.Er=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.Er}]}}_readUserData(e){super._readUserData(e)}}class Da extends Rt{get _name(){return"collection_group"}get _optionsUtil(){return new Ye({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class ku extends Rt{get _name(){return"database"}get _optionsUtil(){return new Ye({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class xu extends Rt{get _name(){return"documents"}get _optionsUtil(){return new Ye({})}constructor(e,t){if(super(t),!e||e.length===0)throw new q(k.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new q(k.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.hr=r,this.Tr=s}_toProto(e){return{...super._toProto(e),args:this.hr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class wa extends Rt{get _name(){return"where"}get _optionsUtil(){return new Ye({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),$n(this.condition,e)}}class Rr extends Rt{get _name(){return"limit"}get _optionsUtil(){return new Ye({})}constructor(e,t){Q(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[la(e,this.limit)]}}}class lf extends Rt{get _name(){return"offset"}get _optionsUtil(){return new Ye({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[la(e,this.offset)]}}}class by extends Rt{get _name(){return"select"}get _optionsUtil(){return new Ye({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[fi(e,this.selections)]}}_readUserData(e){super._readUserData(e),$n(this.selections,e)}}class an extends Rt{get _name(){return"sort"}get _optionsUtil(){return new Ye({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),$n(this.orderings,e)}}class Vu extends Rt{get _name(){return"replace_with"}get _optionsUtil(){return new Ye({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),Gd(Vu.Pr)]}}_readUserData(e){super._readUserData(e),$n(this.map,e)}}Vu.Pr="full_replace";function $n(n,e){return tp(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs{constructor(e,t,r,s){this._db=e,this.userDataReader=t,this._userDataWriter=r,this.stages=s}Ar(e,t){const r=this.userDataReader.createContext(3,e);return tp(t)?t._readUserData(r):Array.isArray(t)?t.forEach((s=>s._readUserData(r))):t.forEach((s=>s._readUserData(r))),t}where(e){const t=this.stages.map((r=>r));return this.Ar("where",e),t.push(new wa(e,{})),new Xs(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((r=>r));return t.push(new Rr(e,{})),new Xs(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const r=this.stages.map((s=>s));return"orderings"in e?r.push(new an(this.Ar("sort",e.orderings),{})):r.push(new an(this.Ar("sort",[e,...t]),{})),new Xs(this._db,this.userDataReader,this._userDataWriter,r)}Vr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class tt{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return Ia(this)}getPipelineCollectionGroup(){return Mu(this)}getPipelineCollectionId(){return Sy(this)}getPipelineDocuments(){return WB(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Bp.name&&s._name!==ap.name||(r="keyless"),s._name===by.name&&r==="exact"&&(r="augmented"),s._name===op.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return Gn(this)}}function Gn(n){const e=n.stages[0];return e instanceof _a||e instanceof Da||e instanceof ku||e instanceof xu?e._name:"unknown"}function Ia(n){if(Gn(n)==="collection")return n.stages[0].Er}function Mu(n){if(Gn(n)==="collection_group")return n.stages[0].collectionId}function Sy(n){switch(Gn(n)){case"collection":return Ce.fromString(Ia(n)).lastSegment();case"collection_group":return Mu(n);default:return}}function WB(n){if(Gn(n)==="documents")return n.stages[0].hr}class I{constructor(e,t){this.type=e,this.value=t}static dr(){return new I("ERROR",void 0)}static mr(){return new I("UNSET",void 0)}static pr(){return new I("NULL",ss)}static newValue(e){return It(e)?new I("NULL",ss):(function(r){return!!r&&"booleanValue"in r})(e)?new I("BOOLEAN",e):qt(e)?new I("INT",e):dr(e)?new I("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new I("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new I("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new I("BYTES",e):e.referenceValue?new I("REFERENCE",e):e.geoPointValue?new I("GEO_POINT",e):os(e)?new I("ARRAY",e):Mo(e)?new I("VECTOR",e):mr(e)?new I("MAP",e):new I("ERROR",void 0)}gr(){return this.type==="ERROR"||this.type==="UNSET"}yr(){return this.type==="NULL"}}function Zs(n){if(!n.gr())return n.value}function up(n){return n instanceof Wn?n._expr:n}function Z(n){if((n=up(n))instanceof Cs)return new Oy(n);if(n instanceof ds)return new Ny(n);if(n instanceof qs)return new Fy(n);if(n instanceof F){if(n.name==="add")return new xy(n);if(n.name==="subtract")return new Vy(n);if(n.name==="multiply")return new My(n);if(n.name==="divide")return new Gy(n);if(n.name==="mod")return new Uy(n);if(n.name==="and")return new Hy(n);if(n.name==="equal")return new eT(n);if(n.name==="not_equal")return new tT(n);if(n.name==="less_than")return new nT(n);if(n.name==="less_than_or_equal")return new rT(n);if(n.name==="greater_than")return new sT(n);if(n.name==="greater_than_or_equal")return new iT(n);if(n.name==="array_concat")return new oT(n);if(n.name==="array_reverse")return new aT(n);if(n.name==="array_contains")return new BT(n);if(n.name==="array_contains_all")return new uT(n);if(n.name==="array_contains_any")return new cT(n);if(n.name==="array_length")return new lT(n);if(n.name==="array_element")return new hT(n);if(n.name==="equal_any")return new cp(n);if(n.name==="not_equal_any")return new Jy(n);if(n.name==="is_nan")return new jy(n);if(n.name==="is_not_nan")return new Ky(n);if(n.name==="is_null")return new zy(n);if(n.name==="is_not_null")return new Qy(n);if(n.name==="is_error")return new Wy(n);if(n.name==="exists")return new $y(n);if(n.name==="not")return new ya(n);if(n.name==="or")return new qy(n);if(n.name==="xor")return new Gu(n);if(n.name==="conditional")return new Yy(n);if(n.name==="maximum")return new Xy(n);if(n.name==="minimum")return new Zy(n);if(n.name==="reverse")return new fT(n);if(n.name==="replace_first")return new CT(n);if(n.name==="replace_all")return new dT(n);if(n.name==="char_length")return new pT(n);if(n.name==="byte_length")return new gT(n);if(n.name==="like")return new mT(n);if(n.name==="regex_contains")return new ET(n);if(n.name==="regex_match")return new _T(n);if(n.name==="string_contains")return new DT(n);if(n.name==="starts_with")return new wT(n);if(n.name==="ends_with")return new IT(n);if(n.name==="to_lower")return new yT(n);if(n.name==="to_upper")return new TT(n);if(n.name==="trim")return new AT(n);if(n.name==="string_concat")return new RT(n);if(n.name==="map_get")return new vT(n);if(n.name==="cosine_distance")return new PT(n);if(n.name==="dot_product")return new bT(n);if(n.name==="euclidean_distance")return new ST(n);if(n.name==="vector_length")return new OT(n);if(n.name==="unix_micros_to_timestamp")return new xT(n);if(n.name==="timestamp_to_unix_micros")return new GT(n);if(n.name==="unix_millis_to_timestamp")return new VT(n);if(n.name==="timestamp_to_unix_millis")return new UT(n);if(n.name==="unix_seconds_to_timestamp")return new MT(n);if(n.name==="timestamp_to_unix_seconds")return new HT(n);if(n.name==="timestamp_add")return new qT(n);if(n.name==="timestamp_subtract")return new JT(n)}throw new Error(`Unknown Expr : ${n}`)}class Oy{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===Ht)return I.newValue({referenceValue:jo(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return I.newValue({timestampValue:To(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return I.newValue({timestampValue:To(e.serializer,t.createTime)});const r=t.data.field(this.expr._fieldPath);return r?Ba(r)?I.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:To(i.serializer,ne.fromTimestamp(rs(o)))};if(i.serverTimestampBehavior==="previous"){const B=Ri(o);if(B)return B}return{nullValue:"NULL_VALUE"}})(e,r)):I.newValue(r):I.mr()}}class Ny{constructor(e){this.expr=e}evaluate(e,t){return I.newValue(this.expr._getValue())}}class Fy{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.ur.map((s=>Z(s).evaluate(e,t)));return r.some((s=>s.gr()))?I.dr():I.newValue({arrayValue:{values:r.map((s=>s.value))}})}}function je(n){return dr(n)?Number(n.doubleValue):Number(n.integerValue)}function $t(n){return BigInt(n.integerValue)}const Ly=BigInt("0x7fffffffffffffff"),ky=-BigInt("0x8000000000000000");class Li{constructor(e){this.expr=e}evaluate(e,t){Q(this.expr.params.length>=2,24778);const r=Z(this.expr.params[0]).evaluate(e,t),s=Z(this.expr.params[1]).evaluate(e,t);let i=this.wr(r,s);for(const o of this.expr.params.slice(2)){const B=Z(o).evaluate(e,t);i=this.wr(i,B)}return i}wr(e,t){if(e.gr()||t.gr())return I.dr();if(e.yr()||t.yr())return I.pr();const r=e.value,s=t.value;if(!dr(r)&&!qt(r)||!dr(s)&&!qt(s))return I.dr();if(dr(r)||dr(s)){const i=this.br(r,s);return i?I.newValue(i):I.dr()}if(qt(r)&&qt(s)){const i=this.Sr(r,s);return i===void 0?I.dr():typeof i=="number"?I.newValue({doubleValue:i}):i<ky||i>Ly?I.dr():I.newValue({integerValue:`${i}`})}return I.dr()}}function pn(n,e){return Ve(n)!==Ve(e)?"TYPE_MISMATCH":mt(n)||mt(e)?"NOT_EQ":It(n)&&It(e)?"EQ":It(n)||It(e)?"NULL":os(n)&&os(e)?(function(r,s){var o,B,u;if(((o=r.values)==null?void 0:o.length)!==((B=s.values)==null?void 0:B.length))return"NOT_EQ";let i=!1;for(let c=0;c<(((u=r.values)==null?void 0:u.length)??0);c++){const h=r.values[c],C=s.values[c];switch(pn(h,C)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:X(44609,{vr:h,Dr:C})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):Mo(n)&&Mo(e)||mr(n)&&mr(e)?(function(r,s){const i=r.fields||{},o=s.fields||{};if(xo(i)!==xo(o))return"NOT_EQ";let B=!1;for(const u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(pn(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":B=!0}}return B?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return Ot(r,s,{o:!1,t:!0,i:!0})})(n,e)?"EQ":"NOT_EQ"}class xy extends Li{Sr(e,t){return $t(e)+$t(t)}br(e,t){return{doubleValue:je(e)+je(t)}}}class Vy extends Li{constructor(e){super(e),this.expr=e}Sr(e,t){return $t(e)-$t(t)}br(e,t){return{doubleValue:je(e)-je(t)}}}class My extends Li{constructor(e){super(e),this.expr=e}Sr(e,t){return $t(e)*$t(t)}br(e,t){return{doubleValue:je(e)*je(t)}}}class Gy extends Li{constructor(e){super(e),this.expr=e}Sr(e,t){const r=$t(t);if(r!==BigInt(0))return $t(e)/r}br(e,t){const r=je(t);return r===0?{doubleValue:ii(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:je(e)/r}}}class Uy extends Li{constructor(e){super(e),this.expr=e}Sr(e,t){const r=$t(t);if(r!==BigInt(0))return $t(e)%r}br(e,t){const r=je(t);if(r!==0)return{doubleValue:je(e)%r}}}class Hy{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const o of this.expr.params){const B=Z(o).evaluate(e,t);switch(B.type){case"BOOLEAN":if(!((i=B.value)!=null&&i.booleanValue))return I.newValue(qe);break;case"NULL":s=!0;break;default:r=!0}}return r?I.dr():s?I.pr():I.newValue(pt)}}class ya{constructor(e){this.expr=e}evaluate(e,t){var s;Q(this.expr.params.length===1,9634);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return I.newValue({booleanValue:!((s=r.value)!=null&&s.booleanValue)});case"NULL":return I.pr();default:return I.dr()}}}class qy{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const o of this.expr.params){const B=Z(o).evaluate(e,t);switch(B.type){case"BOOLEAN":if((i=B.value)!=null&&i.booleanValue)return I.newValue(pt);break;case"NULL":s=!0;break;default:r=!0}}return r?I.dr():s?I.pr():I.newValue(qe)}}class Gu{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const o of this.expr.params){const B=Z(o).evaluate(e,t);switch(B.type){case"BOOLEAN":r=Gu.xor(r,!!((i=B.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return I.dr()}}return s?I.pr():I.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}}class cp{constructor(e){this.expr=e}evaluate(e,t){var o,B;Q(this.expr.params.length===2,55094);let r=!1;const s=Z(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return I.dr()}const i=Z(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return I.dr()}if(r)return I.pr();for(const u of((B=(o=i.value)==null?void 0:o.arrayValue)==null?void 0:B.values)??[])switch(It(s.value)&&It(u)?"EQ":pn(s.value,u)){case"EQ":return I.newValue(pt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:X(44608,{value:s.value,candidate:u})}return r?I.pr():I.newValue(qe)}}class Jy{constructor(e){this.expr=e}evaluate(e,t){return new ya(new F("not",[new F("equal_any",this.expr.params)])).evaluate(e,t)}}class jy{constructor(e){this.expr=e}evaluate(e,t){Q(this.expr.params.length===1,23322);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return I.newValue(qe);case"DOUBLE":return I.newValue({booleanValue:isNaN(je(r.value))});case"NULL":return I.pr();default:return I.dr()}}}class Ky{constructor(e){this.expr=e}evaluate(e,t){return Q(this.expr.params.length===1,50406),new ya(new F("not",[new F("is_nan",this.expr.params)])).evaluate(e,t)}}class zy{constructor(e){this.expr=e}evaluate(e,t){switch(Q(this.expr.params.length===1,23123),Z(this.expr.params[0]).evaluate(e,t).type){case"NULL":return I.newValue(pt);case"UNSET":case"ERROR":return I.dr();default:return I.newValue(qe)}}}class Qy{constructor(e){this.expr=e}evaluate(e,t){return Q(this.expr.params.length===1,23167),new ya(new F("not",[new F("is_null",this.expr.params)])).evaluate(e,t)}}class Wy{constructor(e){this.expr=e}evaluate(e,t){return Q(this.expr.params.length===1,5228),Z(this.expr.params[0]).evaluate(e,t).type==="ERROR"?I.newValue(pt):I.newValue(qe)}}class $y{constructor(e){this.expr=e}evaluate(e,t){switch(Q(this.expr.params.length===1,6877),Z(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return I.dr();case"UNSET":return I.newValue(qe);default:return I.newValue(pt)}}}class Yy{constructor(e){this.expr=e}evaluate(e,t){var s;Q(this.expr.params.length===3,11706);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return(s=r.value)!=null&&s.booleanValue?Z(this.expr.params[1]).evaluate(e,t):Z(this.expr.params[2]).evaluate(e,t);case"NULL":return Z(this.expr.params[2]).evaluate(e,t);default:return I.dr()}}}class Xy{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>Z(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||gt(i.value,s.value)>0?i:s}return s===void 0?I.pr():s}}class Zy{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>Z(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||gt(i.value,s.value)<0?i:s}return s===void 0?I.pr():s}}class ps{constructor(e){this.expr=e}evaluate(e,t){Q(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return I.dr()}const s=Z(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return I.dr()}return this.Cr(r,s)}}class eT extends ps{constructor(e){super(e),this.expr=e}Cr(e,t){if(e.yr()&&t.yr())return I.newValue(pt);if(e.yr()||t.yr()||mt(e.value)||mt(t.value)||Ve(e.value)!==Ve(t.value))return I.newValue(qe);switch(pn(e.value,t.value)){case"EQ":return I.newValue(pt);case"NOT_EQ":return I.newValue(qe);case"NULL":return I.pr();default:X(44615,{left:e,right:t})}}}class tT extends ps{constructor(e){super(e),this.expr=e}Cr(e,t){switch(pn(e.value,t.value)){case"EQ":return I.newValue(qe);case"NOT_EQ":case"TYPE_MISMATCH":return I.newValue(pt);case"NULL":return I.pr();default:X(44614,{left:e,right:t})}}}class nT extends ps{constructor(e){super(e),this.expr=e}Cr(e,t){return Ve(e.value)!==Ve(t.value)||mt(e.value)||mt(t.value)?I.newValue(qe):I.newValue({booleanValue:gt(e.value,t.value)<0})}}class rT extends ps{constructor(e){super(e),this.expr=e}Cr(e,t){return Ve(e.value)!==Ve(t.value)||mt(e.value)||mt(t.value)?I.newValue(qe):pn(e.value,t.value)==="EQ"?I.newValue(pt):I.newValue({booleanValue:gt(e.value,t.value)<0})}}class sT extends ps{constructor(e){super(e),this.expr=e}Cr(e,t){return Ve(e.value)!==Ve(t.value)||mt(e.value)||mt(t.value)?I.newValue(qe):I.newValue({booleanValue:gt(e.value,t.value)>0})}}class iT extends ps{constructor(e){super(e),this.expr=e}Cr(e,t){return Ve(e.value)!==Ve(t.value)||mt(e.value)||mt(t.value)?I.newValue(qe):pn(e.value,t.value)==="EQ"?I.newValue(pt):I.newValue({booleanValue:gt(e.value,t.value)>0})}}class oT{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class aT{constructor(e){this.expr=e}evaluate(e,t){var s;Q(this.expr.params.length===1,216);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return I.pr();case"ARRAY":{const i=((s=r.value.arrayValue)==null?void 0:s.values)??[];return I.newValue({arrayValue:{values:[...i].reverse()}})}default:return I.dr()}}}class BT{constructor(e){this.expr=e}evaluate(e,t){return Q(this.expr.params.length===2,52884),new cp(new F("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class uT{constructor(e){this.expr=e}evaluate(e,t){var u,c,h,C;Q(this.expr.params.length===2,1392);let r=!1;const s=Z(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return I.dr()}const i=Z(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return I.dr()}if(r)return I.pr();const o=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],B=((C=(h=s.value)==null?void 0:h.arrayValue)==null?void 0:C.values)??[];for(const p of o){let w=!1;r=!1;for(const A of B){switch(It(p)&&It(A)?"EQ":pn(p,A)){case"EQ":w=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:X(44613,{value:A,search:p})}if(w)break}if(!w)return I.newValue(qe)}return I.newValue(pt)}}class cT{constructor(e){this.expr=e}evaluate(e,t){var u,c,h,C;Q(this.expr.params.length===2,2680);let r=!1;const s=Z(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return I.dr()}const i=Z(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return I.dr()}if(r)return I.pr();const o=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],B=((C=(h=s.value)==null?void 0:h.arrayValue)==null?void 0:C.values)??[];for(const p of B)for(const w of o)switch(It(p)&&It(w)?"EQ":pn(p,w)){case"EQ":return I.newValue(pt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:X(60403,{value:p,search:w})}return r?I.pr():I.newValue(qe)}}class lT{constructor(e){this.expr=e}evaluate(e,t){var s,i,o;Q(this.expr.params.length===1,38605);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return I.pr();case"ARRAY":return I.newValue({integerValue:`${((o=(i=(s=r.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:o.length)??0}`});default:return I.dr()}}}class hT{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class fT{constructor(e){this.expr=e}evaluate(e,t){var s,i;Q(this.expr.params.length===1,1508);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return I.pr();case"BYTES":{const o=(s=r.value)==null?void 0:s.bytesValue;if(typeof o=="string"){const B=xe.fromBase64String(o).toUint8Array();return B.reverse(),I.newValue({bytesValue:xe.fromUint8Array(B).toBase64()})}return I.newValue({bytesValue:new Uint8Array(o).reverse()})}case"STRING":{const o=(i=r.value)==null?void 0:i.stringValue,B=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(o),u=Array.from(B,(c=>c.segment)).reverse();return I.newValue({stringValue:u.join("")})}default:return I.dr()}}}class CT{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class dT{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class pT{constructor(e){this.expr=e}evaluate(e,t){Q(this.expr.params.length===1,19400);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return I.pr();case"STRING":{const s=(function(o){let B=0;for(let u=0;u<o.length;u++){const c=o.codePointAt(u);if(c===void 0)return;if(c<=65535)if(c>=55296&&c<=57343)if(c<=56319){const h=o.codePointAt(u+1);h!==void 0&&h>=56320&&h<=57343?(B+=1,u++):B+=1}else B+=1;else B+=1;else{if(!(c<=1114111))return;B+=1,u++}}return B})(r.value.stringValue);return s===void 0?I.dr():I.newValue({integerValue:s})}default:return I.dr()}}}class gT{constructor(e){this.expr=e}evaluate(e,t){var s,i;Q(this.expr.params.length===1,8486);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{const o=(s=r.value)==null?void 0:s.bytesValue;return typeof o=="string"?I.newValue({integerValue:xe.fromBase64String(o).toUint8Array().length}):I.newValue({integerValue:new Uint8Array(o).length})}case"STRING":{const o=(function(u){let c=0;for(let h=0;h<u.length;h++){const C=u.codePointAt(h);if(C===void 0)return;if(C>=55296&&C<=57343){if(!(C<=56319))return;{const p=u.codePointAt(h+1);if(p===void 0||!(p>=56320&&p<=57343))return;c+=4,h++}}else if(C<=127)c+=1;else if(C<=2047)c+=2;else if(C<=65535)c+=3;else{if(!(C<=1114111))return;c+=4,h++}}return c})((i=r.value)==null?void 0:i.stringValue);return o===void 0?I.dr():I.newValue({integerValue:o})}case"NULL":return I.pr();default:return I.dr()}}}class gs{constructor(e){this.expr=e}evaluate(e,t){var o,B;Q(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1;const s=Z(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return I.dr()}const i=Z(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return I.dr()}return r?I.pr():this.Fr((o=s.value)==null?void 0:o.stringValue,(B=i.value)==null?void 0:B.stringValue)}}class mT extends gs{Fr(e,t){try{const r=(function(o){let B="";for(let u=0;u<o.length;u++){const c=o.charAt(u);switch(c){case"_":B+=".";break;case"%":B+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":B+="\\"+c;break;default:B+=c}}return"^"+B+"$"})(t),s=_u.compile(r);return I.newValue({booleanValue:s.matches(e)})}catch(r){return xt(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),I.dr()}}}class ET extends gs{Fr(e,t){try{const r=_u.compile(t);return I.newValue({booleanValue:r.test(e)})}catch{return xt(`Invalid regex pattern found in regex_contains: ${t}, returning error`),I.dr()}}}class _T extends gs{Fr(e,t){try{return I.newValue({booleanValue:_u.compile(t).matches(e)})}catch{return xt(`Invalid regex pattern found in regex_match: ${t}, returning error`),I.dr()}}}class DT extends gs{Fr(e,t){return I.newValue({booleanValue:e.includes(t)})}}class wT extends gs{Fr(e,t){return I.newValue({booleanValue:e.startsWith(t)})}}class IT extends gs{Fr(e,t){return I.newValue({booleanValue:e.endsWith(t)})}}class yT{constructor(e){this.expr=e}evaluate(e,t){var s,i;Q(this.expr.params.length===1,29079);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return I.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return I.pr();default:return I.dr()}}}class TT{constructor(e){this.expr=e}evaluate(e,t){var s,i;Q(this.expr.params.length===1,60487);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return I.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return I.pr();default:return I.dr()}}}class AT{constructor(e){this.expr=e}evaluate(e,t){var s,i;Q(this.expr.params.length===1,28544);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return I.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return I.pr();default:return I.dr()}}}class RT{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((o=>Z(o).evaluate(e,t)));let s="",i=!1;for(const o of r)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return I.dr()}return i?I.pr():I.newValue({stringValue:s})}}class vT{constructor(e){this.expr=e}evaluate(e,t){var o,B,u,c;Q(this.expr.params.length===2,4483);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return I.mr();case"MAP":break;default:return I.dr()}const s=Z(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return I.dr();const i=(c=(B=(o=r.value)==null?void 0:o.mapValue)==null?void 0:B.fields)==null?void 0:c[(u=s.value)==null?void 0:u.stringValue];return i===void 0?I.mr():I.newValue(i)}}class Uu{constructor(e){this.expr=e}evaluate(e,t){var c,h;Q(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1;const s=Z(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return I.dr()}const i=Z(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return I.dr()}if(r)return I.pr();const o=UB(s.value),B=UB(i.value);if(o===void 0||B===void 0||((c=o.values)==null?void 0:c.length)!==((h=B.values)==null?void 0:h.length))return I.dr();const u=this.Or(o,B);return u===void 0||isNaN(u)?I.dr():I.newValue({doubleValue:u})}}class PT extends Uu{Or(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return;let i=0,o=0,B=0;for(let c=0;c<r.length;c++){if(!jn(r[c])||!jn(s[c]))return;const h=je(r[c]),C=je(s[c]);i+=h*C,o+=h*h,B+=C*C}const u=Math.sqrt(o)*Math.sqrt(B);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class bT extends Uu{Or(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!jn(r[o])||!jn(s[o]))return;i+=je(r[o])*je(s[o])}return i}}class ST extends Uu{Or(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!jn(r[o])||!jn(s[o]))return;const B=je(r[o]),u=je(s[o]);i+=Math.pow(B-u,2)}return Math.sqrt(i)}}class OT{constructor(e){this.expr=e}evaluate(e,t){var s;Q(this.expr.params.length===1,39044);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{const i=UB(r.value);return I.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return I.pr();default:return I.dr()}}}const di=BigInt(-62135596800),pi=BigInt(253402300799),zo=BigInt(1e3),Un=BigInt(1e6),NT=di*zo,FT=pi*zo+BigInt(999),LT=di*Un,kT=pi*Un+BigInt(999999);function Hu(n){return n>=LT&&n<=kT}function lp(n){return n>=di&&n<=pi}function gi(n,e){const t=BigInt(n);return!(t<di||t>pi)&&!(e<0||e>=1e9)&&(t!==di||e===0)&&!(t===pi&&e>999999999)}function hp(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function qu(n){return BigInt(n.seconds)*Un+BigInt(Math.trunc(n.nanoseconds/1e3))}class Ju{constructor(e){this.expr=e}evaluate(e,t){Q(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return I.pr();default:return I.dr()}}}class xT extends Ju{toTimestamp(e){if(!Hu(e))return I.dr();let t=Number(e/Un),r=Number(e%Un*BigInt(1e3));const s=hp(t,r);return t=s.seconds,r=s.nanos,gi(t,r)?I.newValue({timestampValue:{seconds:t,nanos:r}}):I.dr()}}class VT extends Ju{toTimestamp(e){if(!(function(o){return o>=NT&&o<=FT})(e))return I.dr();let t=Number(e/zo),r=Number(e%zo*BigInt(1e6));const s=hp(t,r);return t=s.seconds,r=s.nanos,gi(t,r)?I.newValue({timestampValue:{seconds:t,nanos:r}}):I.dr()}}class MT extends Ju{toTimestamp(e){if(!lp(e))return I.dr();const t=Number(e);return I.newValue({timestampValue:{seconds:t,nanos:0}})}}class ju{constructor(e){this.expr=e}evaluate(e,t){Q(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const r=Z(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return I.pr();default:return I.dr()}const s=vu(r.value.timestampValue);return gi(s.seconds,s.nanoseconds)?this.Mr(s):I.dr()}}class GT extends ju{Mr(e){const t=qu(e);return Hu(t)?I.newValue({integerValue:`${t.toString()}`}):I.dr()}}class UT extends ju{Mr(e){const t=qu(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?I.newValue({integerValue:r.toString()}):I.newValue({integerValue:(r-BigInt(1)).toString()})}}class HT extends ju{Mr(e){const t=BigInt(e.seconds);return lp(t)?I.newValue({integerValue:t.toString()}):I.dr()}}class fp{constructor(e){this.expr=e}evaluate(e,t){Q(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1;const s=Z(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return I.dr()}const i=Z(this.expr.params[1]).evaluate(e,t);let o;switch(i.type){case"STRING":if(o=(function(ee){switch(ee){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return I.dr();break;case"NULL":r=!0;break;default:return I.dr()}const B=Z(this.expr.params[2]).evaluate(e,t);switch(B.type){case"INT":break;case"NULL":r=!0;break;default:return I.dr()}if(r)return I.pr();const u=BigInt(B.value.integerValue);let c;try{switch(o){case"microsecond":c=u;break;case"millisecond":c=u*BigInt(1e3);break;case"second":c=u*BigInt(1e6);break;case"minute":c=u*BigInt(6e7);break;case"hour":c=u*BigInt(36e8);break;case"day":c=u*BigInt(864e8);break;default:return I.dr()}if(o!=="microsecond"&&u!==BigInt(0)&&c/u!==BigInt(this.Nr(o)))return I.dr()}catch(j){return xt(`Error during timestamp arithmetic: ${j}`),I.dr()}const h=vu(s.value.timestampValue);if(!gi(h.seconds,h.nanoseconds))return I.dr();const C=qu(h),p=this.Lr(C,c);if(!Hu(p))return I.dr();const w=Number(p/Un),A=p%Un,L=Number((A<0?A+Un:A)*BigInt(1e3)),M=A<0?w-1:w;return gi(M,L)?I.newValue({timestampValue:{seconds:M,nanos:L}}):I.dr()}Nr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class qT extends fp{Lr(e,t){return e+t}}class JT extends fp{Lr(e,t){return e-t}}function mi(n){if((n=up(n))instanceof Cs)return`fld(${n.fieldName})`;if(n instanceof ds)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof Pe?`ref(${t.path})`:t instanceof dt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof F)return`fn(${n.name},[${n.params.map(mi).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.ur.map(mi).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function jT(n){if(n instanceof op)return`${n._name}(${fo(n.fields)})`;if(n instanceof ap){let e=`${n._name}(${fo(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${fo(n.groups)})`),e}if(n instanceof Bp)return`${n._name}(${fo(n.groups)})`;if(n instanceof _a)return`${n._name}(${n.Er})`;if(n instanceof Da)return`${n._name}(${n.collectionId})`;if(n instanceof ku)return`${n._name}()`;if(n instanceof xu)return`${n._name}(${n.hr.sort()})`;if(n instanceof wa)return`${n._name}(${mi(n.condition)})`;if(n instanceof Rr)return`${n._name}(${n.limit})`;if(n instanceof an)return`${n._name}(${(function(t){return t.map((r=>`${mi(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function fo(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${mi(t)}`)).join(",")}`}function ln(n){return n.stages.map((e=>jT(e))).join("|")}function Cp(n,e){return ln(n)===ln(e)}function Ge(n){return n instanceof tt}function hf(n){return Ge(n)?ln(n):$s(n)}function dp(n){return Ge(n)?ln(n):(function(t){return`${wd(zt(t))}|lt:${t.limitType}`})(n)}function Ta(n,e){return n instanceof tt&&e instanceof tt?Cp(n,e):!(n instanceof tt&&!(e instanceof tt)||!(n instanceof tt)&&e instanceof tt)&&lI(n,e)}function pp(n){return hr(n)?ln(n):wd(n)}function gp(n,e){return n instanceof tt&&e instanceof tt?Cp(n,e):!(n instanceof tt&&!(e instanceof tt)||!(n instanceof tt)&&e instanceof tt)&&Id(n,e)}function KT(n,e){const t=(function(s){let i=!1;const o=[];for(const B of s)if(B instanceof an)if(i=!0,B.orderings.some((u=>u.expr instanceof Cs&&u.expr.fieldName===Ht)))o.push(B);else{const u=B.orderings.map((c=>c));u.push(Ao(Ht).ascending()),o.push(new an(u,{}))}else B instanceof Rr&&(i||(o.push(new an([Ao(Ht).ascending()],{})),i=!0)),o.push(B);return i||o.push(new an([Ao(Ht).ascending()],{})),o})(n.stages);if(n.userDataReader){const r=n.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(r)))}return new tt(n.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zT{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&jw(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Qs(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Qs(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Pd();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let B=this.applyToLocalView(o,i.mutatedFields);B=t.has(s.key)?null:B;const u=Cd(o,B);u!==null&&r.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(ne.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),oe())}isEqual(e){return this.batchId===e.batchId&&ns(this.mutations,e.mutations,((t,r)=>Hh(t,r)))&&ns(this.baseMutations,e.baseMutations,((t,r)=>Hh(t,r)))}}class Ku{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){Q(e.mutations.length===r.length,58842,{Br:e.mutations.length,Ur:r.length});let s=(function(){return pI})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,r[o].version);return new Ku(e,t,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mp="";function QT(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=ff(e)),e=WT(n.get(t),e);return ff(e)}function WT(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case mp:t+="";break;default:t+=i}}return t}function ff(n){return n+mp+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $T{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(e,t,r,s,i=ne.min(),o=ne.min(),B=xe.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=B,this.expectedCount=u}withSequenceNumber(e){return new Bn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Bn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Bn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Bn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YT{constructor(e){this.qr=e}}function XT(n){const e=NI({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?JB(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZT{constructor(){this.Yi=new eA}addToCollectionParentIndex(e,t){return this.Yi.add(t),x.resolve()}getCollectionParents(e,t){return x.resolve(this.Yi.getEntries(t))}addFieldIndex(e,t){return x.resolve()}deleteFieldIndex(e,t){return x.resolve()}deleteAllFieldIndexes(e){return x.resolve()}createTargetIndexes(e,t){return x.resolve()}getDocumentsMatchingTarget(e,t){return x.resolve(null)}getIndexType(e,t){return x.resolve(0)}getFieldIndexes(e,t){return x.resolve([])}getNextCollectionGroupToUpdate(e){return x.resolve(null)}getMinOffset(e,t){return x.resolve(Kn.min())}getMinOffsetFromCollectionGroup(e,t){return x.resolve(Kn.min())}updateCollectionGroup(e,t,r){return x.resolve()}updateIndexEntries(e,t){return x.resolve()}}class eA{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new ke(Ce.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ke(Ce.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e){this.gs=e}next(){return this.gs+=2,this.gs}static ys(){return new Yn(0)}static ws(){return new Yn(-1)}}// Copyright 2024 Google LLC* @license
function Ep(n,e){var r;let t=e;for(const s of n.stages)t=nA({serializer:n.serializer,serverTimestampBehavior:(r=n.listenOptions)==null?void 0:r.serverTimestampBehavior},s,t);return t}function Aa(n,e){return Ep(n,[e]).length>0}function tA(n,e){return Ge(n)?Aa(n,e):pa(n,e)}function nA(n,e,t){if(e instanceof _a)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()&&`/${B.key.getCollectionPath().canonicalString()}`===i.Er))})(0,e,t);if(e instanceof wa)return(function(s,i,o){return o.filter((B=>{const u=Zs(Z(i.condition).evaluate(s,B));return u!==void 0&&Ot(u,pt)}))})(n,e,t);if(e instanceof Da)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()&&B.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof ku)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()))})(0,0,t);if(e instanceof xu)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()&&i.Tr.has(B.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Rr)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof an)return(function(s,i,o){const B=i.orderings.map((u=>({Os:Z(u.expr),direction:u.direction})));return[...o].sort(((u,c)=>{for(const{Os:h,direction:C}of B){const p=Zs(h.evaluate(s,u)),w=Zs(h.evaluate(s,c)),A=gt(p??ss,w??ss);if(A!==0)return C==="ascending"?A:-A}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function $B(n){const e=(function(r){for(let s=r.stages.length-1;s>=0;s--){const i=r.stages[s];if(i instanceof an)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(const s of e){const i=Zs(Z(s.expr).evaluate({serializer:n.serializer},t)),o=Zs(Z(s.expr).evaluate({serializer:n.serializer},r)),B=gt(i||ss,o||ss);if(B!==0)return s.direction==="ascending"?B:-B}return 0}}function gB(n){for(let e=n.stages.length-1;e>=0;e--){const t=n.stages[e];if(t instanceof Rr)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(){this.changes=new Fr((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,We.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?x.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sA{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&Qs(r.mutation,s,wt.empty(),Te.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,oe()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=oe()){const s=Fn();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let o=zr();return i.forEach(((B,u)=>{o=o.insert(B,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const r=Fn();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,oe())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,B)=>{t.set(o,B)}))}))}computeViews(e,t,r,s){let i=ft();const o=Ys(),B=(function(){return Ys()})();return t.forEach(((u,c)=>{const h=r.get(c.key);s.has(c.key)&&(h===void 0||h.mutation instanceof nr)?i=i.insert(c.key,c):h!==void 0?(o.set(c.key,h.mutation.getFieldMask()),Qs(h.mutation,c,h.mutation.getFieldMask(),Te.now())):o.set(c.key,wt.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,h)=>o.set(c,h))),t.forEach(((c,h)=>B.set(c,new sA(h,o.get(c)??null)))),B)))}recalculateAndSaveOverlays(e,t){const r=Ys();let s=new Re(((o,B)=>o-B)),i=oe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const B of o)B.keys().forEach((u=>{const c=t.get(u);if(c===null)return;let h=r.get(u)||wt.empty();h=B.applyToLocalView(c,h),r.set(u,h);const C=(s.get(B.batchId)||oe()).add(u);s=s.insert(B.batchId,C)}))})).next((()=>{const o=[],B=s.getReverseIterator();for(;B.hasNext();){const u=B.getNext(),c=u.key,h=u.value,C=Pd();h.forEach((p=>{if(!i.has(p)){const w=Cd(t.get(p),r.get(p));w!==null&&C.set(p,w),i=i.add(p)}})),o.push(this.documentOverlayCache.saveOverlays(e,c,C))}return x.waitFor(o)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return Ge(t)?this.getDocumentsMatchingPipeline(e,t,r,s):BI(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Td(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):x.resolve(Fn());let B=hi,u=i;return o.next((c=>x.forEach(c,((h,C)=>(B<C.largestBatchId&&(B=C.largestBatchId),i.get(h)?x.resolve():this.remoteDocumentCache.getEntry(e,h).next((p=>{u=u.insert(h,p)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,oe()))).next((h=>({batchId:B,changes:vd(h)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new $(t)).next((r=>{let s=zr();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let o=zr();return this.indexManager.getCollectionParents(e,i).next((B=>x.forEach(B,(u=>{const c=(function(C,p){return new ls(p,null,C.explicitOrderBy.slice(),C.filters.slice(),C.limit,C.limitType,C.startAt,C.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,r,s).next((h=>{h.forEach(((C,p)=>{o=o.insert(C,p)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(B=>pa(t,B)))))}getDocumentsMatchingPipeline(e,t,r,s){if(Gn(t)==="collection_group"){const i=Mu(t);let o=zr();return this.indexManager.getCollectionParents(e,i).next((B=>x.forEach(B,(u=>{const c=(function(C,p){const w=C.stages.map((A=>A instanceof Da?new _a(p.canonicalString(),{}):A));return new tt(C.serializer,w)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,c,r,s).next((h=>{h.forEach(((C,p)=>{o=o.insert(C,p)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((o=>{switch(i=o,Gn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let B=oe();for(const u of WB(t))B=B.add($.fromPath(u));return this.remoteDocumentCache.getEntries(e,B);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new q("invalid-argument",`Invalid pipeline source to execute offline: ${ln(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(B=>Aa(t,B)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,o)=>{const B=o.getKey();t.get(B)===null&&(t=t.insert(B,We.newInvalidDocument(B)))}));let s=zr();return t.forEach(((i,o)=>{const B=e.get(i);B!==void 0&&Qs(B.mutation,o,wt.empty(),Te.now()),r(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,r){switch(Gn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,Ce.fromString(Ia(t)),r);case"collection_group":throw new q("invalid-argument",`Unexpected collection group pipeline: ${ln(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,WB(t).map((s=>$.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new q("invalid-argument",`Failed to get overlays for pipeline: ${ln(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oA{constructor(e){this.serializer=e,this.Ks=new Map,this.Qs=new Map}getBundleMetadata(e,t){return x.resolve(this.Ks.get(t))}saveBundleMetadata(e,t){return this.Ks.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Qt(s.createTime)}})(t)),x.resolve()}getNamedQuery(e,t){return x.resolve(this.Qs.get(t))}saveNamedQuery(e,t){return this.Qs.set(t.name,(function(s){return{name:s.name,query:XT(s.bundledQuery),readTime:Qt(s.readTime)}})(t)),x.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aA{constructor(){this.overlays=new Re($.comparator),this.Ws=new Map}getOverlay(e,t){return x.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Fn();return x.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){const r=Fn();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),x.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Yr(e,t,i)})),x.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ws.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Ws.delete(r)),x.resolve()}getOverlaysForCollection(e,t,r){const s=Fn(),i=t.length+1,o=new $(t.child("")),B=this.overlays.getIteratorFrom(o);for(;B.hasNext();){const u=B.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return x.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new Re(((c,h)=>c-h));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>r){let h=i.get(c.largestBatchId);h===null&&(h=Fn(),i=i.insert(c.largestBatchId,h)),h.set(c.getKey(),c)}}const B=Fn(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,h)=>B.set(c,h))),!(B.size()>=s)););return x.resolve(B)}Yr(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const o=this.Ws.get(s.largestBatchId).delete(r.key);this.Ws.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new $T(t,r));let i=this.Ws.get(t);i===void 0&&(i=oe(),this.Ws.set(t,i)),this.Ws.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BA{constructor(){this.sessionToken=xe.EMPTY_BYTE_STRING}getSessionToken(e){return x.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,x.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zu{constructor(){this.Gs=new ke(He.zs),this.js=new ke(He.Hs)}isEmpty(){return this.Gs.isEmpty()}addReference(e,t){const r=new He(e,t);this.Gs=this.Gs.add(r),this.js=this.js.add(r)}Js(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Ys(new He(e,t))}Zs(e,t){e.forEach((r=>this.removeReference(r,t)))}Xs(e){const t=new $(new Ce([])),r=new He(t,e),s=new He(t,e+1),i=[];return this.js.forEachInRange([r,s],(o=>{this.Ys(o),i.push(o.key)})),i}e_(){this.Gs.forEach((e=>this.Ys(e)))}Ys(e){this.Gs=this.Gs.delete(e),this.js=this.js.delete(e)}t_(e){const t=new $(new Ce([])),r=new He(t,e),s=new He(t,e+1);let i=oe();return this.js.forEachInRange([r,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new He(e,0),r=this.Gs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class He{constructor(e,t){this.key=e,this.n_=t}static zs(e,t){return $.comparator(e.key,t.key)||ae(e.n_,t.n_)}static Hs(e,t){return ae(e.n_,t.n_)||$.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uA{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Wr=1,this.r_=new ke(He.zs)}checkEmpty(e){return x.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Wr;this.Wr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new zT(i,t,r,s);this.mutationQueue.push(o);for(const B of s)this.r_=this.r_.add(new He(B.key,i)),this.indexManager.addToCollectionParentIndex(e,B.key.path.popLast());return x.resolve(o)}lookupMutationBatch(e,t){return x.resolve(this.i_(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.s_(r),i=s<0?0:s;return x.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return x.resolve(this.mutationQueue.length===0?Iu:this.Wr-1)}getAllMutationBatches(e){return x.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new He(t,0),s=new He(t,Number.POSITIVE_INFINITY),i=[];return this.r_.forEachInRange([r,s],(o=>{const B=this.i_(o.n_);i.push(B)})),x.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ke(ae);return t.forEach((s=>{const i=new He(s,0),o=new He(s,Number.POSITIVE_INFINITY);this.r_.forEachInRange([i,o],(B=>{r=r.add(B.n_)}))})),x.resolve(this.__(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;$.isDocumentKey(i)||(i=i.child(""));const o=new He(new $(i),0);let B=new ke(ae);return this.r_.forEachWhile((u=>{const c=u.key.path;return!!r.isPrefixOf(c)&&(c.length===s&&(B=B.add(u.n_)),!0)}),o),x.resolve(this.__(B))}__(e){const t=[];return e.forEach((r=>{const s=this.i_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){Q(this.o_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.r_;return x.forEach(t.mutations,(s=>{const i=new He(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.r_=r}))}jr(e){}containsKey(e,t){const r=new He(t,0),s=this.r_.firstAfterOrEqual(r);return x.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,x.resolve()}o_(e,t){return this.s_(e)}s_(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}i_(e){const t=this.s_(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cA{constructor(e){this.a_=e,this.docs=(function(){return new Re($.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,o=this.a_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return x.resolve(r?r.document.mutableCopy():We.newInvalidDocument(t))}getEntries(e,t){let r=ft();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():We.newInvalidDocument(s))})),x.resolve(r)}getAllEntries(e){let t=ft();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),x.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,o;Ge(t)?(i=Ce.fromString(Ia(t)),o=h=>Aa(t,h)):(i=t.path,o=h=>pa(t,h));let B=ft();const u=new $(i.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:h,value:{document:C}}=c.getNext();if(!i.isPrefixOf(h.path))break;h.path.length>i.length+1||iI(sI(C),r)<=0||(s.has(C.key)||o(C))&&(B=B.insert(C.key,C.mutableCopy()))}return x.resolve(B)}getAllFromCollectionGroup(e,t,r,s){X(9500)}u_(e,t){return x.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new lA(this)}getSize(e){return x.resolve(this.size)}}class lA extends rA{constructor(e){super(),this.qs=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.qs.addEntry(e,s)):this.qs.removeEntry(r)})),x.waitFor(t)}getFromCache(e,t){return this.qs.getEntry(e,t)}getAllFromCache(e,t){return this.qs.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hA{constructor(e){this.persistence=e,this.c_=new Fr((t=>pp(t)),gp),this.lastRemoteSnapshotVersion=ne.min(),this.highestTargetId=0,this.l_=0,this.E_=new zu,this.targetCount=0,this.h_=Yn.ys()}forEachTarget(e,t){return this.c_.forEach(((r,s)=>t(s))),x.resolve()}getLastRemoteSnapshotVersion(e){return x.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return x.resolve(this.l_)}allocateTargetId(e){return this.highestTargetId=this.h_.next(),x.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.l_&&(this.l_=t),x.resolve()}vs(e){this.c_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.h_=new Yn(t),this.highestTargetId=t),e.sequenceNumber>this.l_&&(this.l_=e.sequenceNumber)}addTargetData(e,t){return this.vs(t),this.targetCount+=1,x.resolve()}updateTargetData(e,t){return this.vs(t),x.resolve()}removeTargetData(e,t){return this.c_.delete(t.target),this.E_.Xs(t.targetId),this.targetCount-=1,x.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.c_.forEach(((o,B)=>{B.sequenceNumber<=t&&r.get(B.targetId)===null&&(this.c_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,B.targetId)),s++)})),x.waitFor(i).next((()=>s))}getTargetCount(e){return x.resolve(this.targetCount)}getTargetData(e,t){const r=this.c_.get(t)||null;return x.resolve(r)}addMatchingKeys(e,t,r){return this.E_.Js(t,r),x.resolve()}removeMatchingKeys(e,t,r){this.E_.Zs(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),x.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.E_.Xs(t),x.resolve()}getMatchingKeysForTargetId(e,t){const r=this.E_.t_(t);return x.resolve(r)}containsKey(e,t){return x.resolve(this.E_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _p{constructor(e,t){this.T_={},this.overlays={},this.P_=new ma(0),this.R_=!1,this.R_=!0,this.I_=new BA,this.referenceDelegate=e(this),this.A_=new hA(this),this.indexManager=new ZT,this.remoteDocumentCache=(function(s){return new cA(s)})((r=>this.referenceDelegate.V_(r))),this.serializer=new YT(t),this.d_=new oA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new aA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.T_[e.toKey()];return r||(r=new uA(t,this.referenceDelegate),this.T_[e.toKey()]=r),r}getGlobalsCache(){return this.I_}getTargetCache(){return this.A_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.d_}runTransaction(e,t,r){K("MemoryPersistence","Starting transaction:",e);const s=new fA(this.P_.next());return this.referenceDelegate.f_(),r(s).next((i=>this.referenceDelegate.m_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}p_(e,t){return x.or(Object.values(this.T_).map((r=>()=>r.containsKey(e,t))))}}class fA extends oy{constructor(e){super(),this.currentSequenceNumber=e}}class Qu{constructor(e){this.persistence=e,this.g_=new zu,this.y_=null}static w_(e){return new Qu(e)}get b_(){if(this.y_)return this.y_;throw X(60996)}addReference(e,t,r){return this.g_.addReference(r,t),this.b_.delete(r.toString()),x.resolve()}removeReference(e,t,r){return this.g_.removeReference(r,t),this.b_.add(r.toString()),x.resolve()}markPotentiallyOrphaned(e,t){return this.b_.add(t.toString()),x.resolve()}removeTarget(e,t){this.g_.Xs(t.targetId).forEach((s=>this.b_.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.b_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}f_(){this.y_=new Set}m_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return x.forEach(this.b_,(r=>{const s=$.fromPath(r);return this.S_(e,s).next((i=>{i||t.removeEntry(s,ne.min())}))})).next((()=>(this.y_=null,t.apply(e))))}updateLimboDocument(e,t){return this.S_(e,t).next((r=>{r?this.b_.delete(t.toString()):this.b_.add(t.toString())}))}V_(e){return 0}S_(e,t){return x.or([()=>x.resolve(this.g_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.p_(e,t)])}}class Qo{constructor(e,t){this.persistence=e,this.v_=new Fr((r=>QT(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=hy(this,t)}static w_(e,t){return new Qo(e,t)}f_(){}m_(e){return x.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}rr(e){const t=this.xs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}xs(e){let t=0;return this.ir(e,(r=>{t++})).next((()=>t))}ir(e,t){return x.forEach(this.v_,((r,s)=>this.Fs(e,r,s).next((i=>i?x.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.u_(e,(o=>this.Fs(e,o,t).next((B=>{B||(r++,i.removeEntry(o,ne.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.v_.set(t,e.currentSequenceNumber),x.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.v_.set(r,e.currentSequenceNumber),x.resolve()}removeReference(e,t,r){return this.v_.set(r,e.currentSequenceNumber),x.resolve()}updateLimboDocument(e,t){return this.v_.set(t,e.currentSequenceNumber),x.resolve()}V_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=wo(e.data.value)),t}Fs(e,t,r){return x.or([()=>this.persistence.p_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.v_.get(t);return x.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wu{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Ao=r,this.Vo=s}static fo(e,t){let r=oe(),s=oe();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Wu(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CA(n,e){return $.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{constructor(){this.mo=!1,this.po=!1,this.yo=100,this.wo=(function(){return wm()?8:ay($e())>0?6:4})()}initialize(e,t){this.bo=e,this.indexManager=t,this.mo=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.So(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.vo(e,t,s,r).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new dA;return this.Do(e,t,o).next((B=>{if(i.result=B,this.po)return this.xo(e,t,o,B.size)}))})).next((()=>i.result))}xo(e,t,r,s){return Ge(t)?x.resolve():r.documentReadCount<this.yo?(jr()<=ue.DEBUG&&K("QueryEngine","SDK will not create cache indexes for query:",$s(t),"since it only creates cache indexes for collection contains","more than or equal to",this.yo,"documents"),x.resolve()):(jr()<=ue.DEBUG&&K("QueryEngine","Query:",$s(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.wo*s?(jr()<=ue.DEBUG&&K("QueryEngine","The SDK decides to create cache indexes for query:",$s(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,zt(t))):x.resolve())}So(e,t){if(Ge(t))return x.resolve(null);let r=t;if(Qh(r))return x.resolve(null);let s=zt(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=JB(r,null,"F"),s=zt(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const B=oe(...o);return this.bo.getDocuments(e,B).next((u=>this.indexManager.getMinOffset(e,s).next((c=>{const h=this.Co(r,u);return this.Fo(r,h,B,c.readTime)?this.So(e,JB(r,null,"F")):this.Oo(e,h,r,c)}))))})))))}vo(e,t,r,s){return(Ge(t)?(function(o){for(const B of o.stages){if(B instanceof Rr||B instanceof lf)return!1;if(B instanceof wa){if(B.condition instanceof rp&&B.condition._expr.name==="exists"&&B.condition._expr.params[0]instanceof Cs&&B.condition._expr.params[0].fieldName===Ht)continue;return!1}}return!0})(t):Qh(t))||s.isEqual(ne.min())?x.resolve(null):this.bo.getDocuments(e,r).next((i=>{const o=this.Co(t,i);return this.Fo(t,o,r,s)?x.resolve(null):(jr()<=ue.DEBUG&&K("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),hf(t)),this.Oo(e,o,t,rI(s,hi)).next((B=>B)))}))}Co(e,t){let r,s;return Ge(e)?(r=new ke(CA),s=i=>Aa(e,i)):(r=new ke(Au(e)),s=i=>pa(e,i)),t.forEach(((i,o)=>{s(o)&&(r=r.add(o))})),r}Fo(e,t,r,s){if(Ge(e))return(function(B){return B.stages.some((u=>u instanceof Rr||u instanceof lf))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Do(e,t,r){return jr()<=ue.DEBUG&&K("QueryEngine","Using full collection scan to execute query:",hf(t)),this.bo.getDocumentsMatchingQuery(e,t,Kn.min(),r)}Oo(e,t,r,s){return this.bo.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $u="LocalStore",gA=3e8;class mA{constructor(e,t,r,s){this.persistence=e,this.Mo=t,this.serializer=s,this.No=new Re(ae),this.Lo=new Fr((i=>pp(i)),gp),this.Bo=new Map,this.Uo=e.getRemoteDocumentCache(),this.A_=e.getTargetCache(),this.d_=e.getBundleCache(),this.ko(r)}ko(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new iA(this.Uo,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Uo.setIndexManager(this.indexManager),this.Mo.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.No)))}}function EA(n,e,t,r){return new mA(n,e,t,r)}async function Dp(n,e){const t=re(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.ko(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const o=[],B=[];let u=oe();for(const c of s){o.push(c.batchId);for(const h of c.mutations)u=u.add(h.key)}for(const c of i){B.push(c.batchId);for(const h of c.mutations)u=u.add(h.key)}return t.localDocuments.getDocuments(r,u).next((c=>({qo:c,removedBatchIds:o,addedBatchIds:B})))}))}))}function _A(n,e){const t=re(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.Uo.newChangeBuffer({trackRemovals:!0});return(function(B,u,c,h){const C=c.batch,p=C.keys();let w=x.resolve();return p.forEach((A=>{w=w.next((()=>h.getEntry(u,A))).next((L=>{const M=c.docVersions.get(A);Q(M!==null,48541),L.version.compareTo(M)<0&&(C.applyToRemoteDocument(L,c),L.isValidDocument()&&(L.setReadTime(c.commitVersion),h.addEntry(L)))}))})),w.next((()=>B.mutationQueue.removeMutationBatch(u,C)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(B){let u=oe();for(let c=0;c<B.mutationResults.length;++c)B.mutationResults[c].transformResults.length>0&&(u=u.add(B.batch.mutations[c].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function wp(n){const e=re(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.A_.getLastRemoteSnapshotVersion(t)))}function DA(n,e){const t=re(n),r=e.snapshotVersion;let s=t.No;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Uo.newChangeBuffer({trackRemovals:!0});s=t.No;const B=[];e.targetChanges.forEach(((h,C)=>{const p=s.get(C);if(!p)return;B.push(t.A_.removeMatchingKeys(i,h.removedDocuments,C).next((()=>t.A_.addMatchingKeys(i,h.addedDocuments,C))));let w=p.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(C)!==null?w=w.withResumeToken(xe.EMPTY_BYTE_STRING,ne.min()).withLastLimboFreeSnapshotVersion(ne.min()):h.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(h.resumeToken,r)),s=s.insert(C,w),(function(L,M,j){return L.resumeToken.approximateByteSize()===0||M.snapshotVersion.toMicroseconds()-L.snapshotVersion.toMicroseconds()>=gA?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0})(p,w,h)&&B.push(t.A_.updateTargetData(i,w))}));let u=ft(),c=oe();if(e.documentUpdates.forEach((h=>{e.resolvedLimboDocuments.has(h)&&B.push(t.persistence.referenceDelegate.updateLimboDocument(i,h))})),B.push(wA(i,o,e.documentUpdates).next((h=>{u=h.$o,c=h.Ko}))),!r.isEqual(ne.min())){const h=t.A_.getLastRemoteSnapshotVersion(i).next((C=>t.A_.setTargetsMetadata(i,i.currentSequenceNumber,r)));B.push(h)}return x.waitFor(B).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(t.No=s,i)))}function wA(n,e,t){let r=oe(),s=oe();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let o=ft();return t.forEach(((B,u)=>{const c=i.get(B);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(B)),u.isNoDocument()&&u.version.isEqual(ne.min())?(e.removeEntry(B,u.readTime),o=o.insert(B,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(B,u)):K($u,"Ignoring outdated watch update for ",B,". Current version:",c.version," Watch version:",u.version)})),{$o:o,Ko:s}}))}function IA(n,e){const t=re(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Iu),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function yA(n,e){const t=re(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.A_.getTargetData(r,e).next((i=>i?(s=i,x.resolve(s)):t.A_.allocateTargetId(r).next((o=>(s=new Bn(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.A_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.No.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.No=t.No.insert(r.targetId,r),t.Lo.set(e,r.targetId)),r}))}async function YB(n,e,t){const r=re(n),s=r.No.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(o=>r.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!fs(o))throw o;K($u,`Failed to update sequence numbers for target ${e}: ${o}`)}r.No=r.No.remove(e),r.Lo.delete(s.target)}function Cf(n,e,t){const r=re(n);let s=ne.min(),i=oe();return r.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,c,h){const C=re(u),p=C.Lo.get(h);return p!==void 0?x.resolve(C.No.get(p)):C.A_.getTargetData(c,h)})(r,o,Ge(e)?e:zt(e)).next((B=>{if(B)return s=B.lastLimboFreeSnapshotVersion,r.A_.getMatchingKeysForTargetId(o,B.targetId).next((u=>{i=u}))})).next((()=>r.Mo.getDocumentsMatchingQuery(o,e,t?s:ne.min(),t?i:oe()))).next((B=>(TA(r,B),{documents:B,Qo:i})))))}function TA(n,e){e.forEach(((t,r)=>{const s=r.key.getCollectionGroup(),i=n.Bo.get(s)||ne.min();r.readTime.compareTo(i)>0&&n.Bo.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Jo=0,this.Yo=null,this.Zo=!0}Xo(){this.Jo===0&&(this.ea("Unknown"),this.Yo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Yo=null,this.ta("Backend didn't respond within 10 seconds."),this.ea("Offline"),Promise.resolve()))))}na(e){this.state==="Online"?this.ea("Unknown"):(this.Jo++,this.Jo>=1&&(this.ra(),this.ta(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ea("Offline")))}set(e){this.ra(),this.Jo=0,e==="Online"&&(this.Zo=!1),this.ea(e)}ea(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ta(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Zo?(dn(t),this.Zo=!1):K("OnlineStateTracker",t)}ra(){this.Yo!==null&&(this.Yo.cancel(),this.Yo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt="RemoteStore";class RA{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.ia=[],this.sa=new Map,this._a=new Map,this.oa=new Map,this.aa=new Yn(1e3),this.ua=new Yn(1001),this.ca=new Set,this.la=[],this.Ea=i,this.Ea.Ke((o=>{r.enqueueAndForget((async()=>{kr(this)&&(K(Yt,"Restarting streams for network reachability change."),await(async function(u){const c=re(u);c.ca.add(4),await ki(c),c.ha.set("Unknown"),c.ca.delete(4),await Ra(c)})(this))}))})),this.ha=new AA(r,s)}}async function Ra(n){if(kr(n))for(const e of n.la)await e(!0)}async function ki(n){for(const e of n.la)await e(!1)}function XB(n,e){return n._a.get(e)||void 0}function Ip(n,e){const t=re(n),r=XB(t,e.targetId);if(r!==void 0&&t.sa.has(r))return;const s=(function(B,u){const c=XB(B,u);c!==void 0&&B.oa.delete(c);const h=(function(p,w){return w%2!=0?p.ua.next():p.aa.next()})(B,u);return B._a.set(u,h),B.oa.set(h,u),h})(t,e.targetId);K(Yt,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Bn(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.sa.set(s,i),ec(t)?Zu(t):ms(t).Jt()&&Xu(t,i)}function Yu(n,e){const t=re(n),r=ms(t),s=XB(t,e);K(Yt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.sa.delete(s),t._a.delete(e),t.oa.delete(s),r.Jt()&&yp(t,s),t.sa.size===0&&(r.Jt()?r.Xt():kr(t)&&t.ha.set("Unknown"))}function Xu(n,e){if(n.Ta.H(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ne.min())>0){const t=n.oa.get(e.targetId);if(t===void 0)return void K(Yt,"SDK target ID not found for remote ID: "+e.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}ms(n).Tn(e)}function yp(n,e){n.Ta.H(e),ms(n).Pn(e)}function Zu(n){n.Ta=new wI({getRemoteKeysForTarget:e=>{const t=n.oa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):oe()},ge:e=>n.sa.get(e)||null,Ae:()=>n.datastore.serializer.databaseId}),ms(n).start(),n.ha.Xo()}function ec(n){return kr(n)&&!ms(n).Ht()&&n.sa.size>0}function kr(n){return re(n).ca.size===0}function Tp(n){n.Ta=void 0}async function vA(n){n.ha.set("Online")}async function PA(n){n.sa.forEach(((e,t)=>{Xu(n,e)}))}async function bA(n,e){Tp(n),ec(n)?(n.ha.na(e),Zu(n)):n.ha.set("Unknown")}async function SA(n,e,t){if(n.ha.set("Online"),e instanceof Sd&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const B of i.targetIds){if(s.sa.has(B)){const u=s.oa.get(B);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s._a.delete(u),s.oa.delete(B)),s.sa.delete(B)}s.Ta.removeTarget(B)}})(n,e)}catch(r){K(Yt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Wo(n,r)}else if(e instanceof yo?n.Ta.se(e):e instanceof bd?n.Ta.Ee(e):n.Ta.ae(e),!t.isEqual(ne.min()))try{const r=await wp(n.localStore);t.compareTo(r)>=0&&await(function(i,o){const B=i.Ta.de(o);B.targetChanges.forEach(((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const C=i.sa.get(h);C&&i.sa.set(h,C.withResumeToken(c.resumeToken,o))}})),B.targetMismatches.forEach(((c,h)=>{const C=i.sa.get(c);if(!C)return;i.sa.set(c,C.withResumeToken(xe.EMPTY_BYTE_STRING,C.snapshotVersion)),yp(i,c);const p=new Bn(C.target,c,h,C.sequenceNumber);Xu(i,p)}));const u=(function(h,C){const p=new Map;C.targetChanges.forEach(((A,L)=>{const M=h.oa.get(L);M!==void 0&&p.set(M,A)}));let w=new Re(ae);return C.targetMismatches.forEach(((A,L)=>{const M=h.oa.get(A);M!==void 0&&(w=w.insert(M,L))})),new Pi(C.snapshotVersion,p,w,C.documentUpdates,C.augmentedDocumentUpdates,C.resolvedLimboDocuments)})(i,B);return i.remoteSyncer.applyRemoteEvent(u)})(n,t)}catch(r){K(Yt,"Failed to raise snapshot:",r),await Wo(n,r)}}async function Wo(n,e,t){if(!fs(e))throw e;n.ca.add(1),await ki(n),n.ha.set("Offline"),t||(t=()=>wp(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{K(Yt,"Retrying IndexedDB access"),await t(),n.ca.delete(1),await Ra(n)}))}function Ap(n,e){return e().catch((t=>Wo(n,t,e)))}async function va(n){const e=re(n),t=Xn(e);let r=e.ia.length>0?e.ia[e.ia.length-1].batchId:Iu;for(;OA(e);)try{const s=await IA(e.localStore,r);if(s===null){e.ia.length===0&&t.Xt();break}r=s.batchId,NA(e,s)}catch(s){await Wo(e,s)}Rp(e)&&vp(e)}function OA(n){return kr(n)&&n.ia.length<10}function NA(n,e){n.ia.push(e);const t=Xn(n);t.Jt()&&t.Rn&&t.In(e.mutations)}function Rp(n){return kr(n)&&!Xn(n).Ht()&&n.ia.length>0}function vp(n){Xn(n).start()}async function FA(n){Xn(n).dn()}async function LA(n){const e=Xn(n);for(const t of n.ia)e.In(t.mutations)}async function kA(n,e,t){const r=n.ia.shift(),s=Ku.from(r,e,t);await Ap(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await va(n)}async function xA(n,e){e&&Xn(n).Rn&&await(async function(r,s){if((function(o){return CI(o)&&o!==k.ABORTED})(s.code)){const i=r.ia.shift();Xn(r).Zt(),await Ap(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await va(r)}})(n,e),Rp(n)&&vp(n)}async function df(n,e){const t=re(n);t.asyncQueue.verifyOperationInProgress(),K(Yt,"RemoteStore received new credentials");const r=kr(t);t.ca.add(3),await ki(t),r&&t.ha.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.ca.delete(3),await Ra(t)}async function VA(n,e){const t=re(n);e?(t.ca.delete(2),await Ra(t)):e||(t.ca.add(2),await ki(t),t.ha.set("Unknown"))}function ms(n){return n.Pa||(n.Pa=(function(t,r,s){const i=re(t);return i.mn(),new XI(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ut:vA.bind(null,n),lt:PA.bind(null,n),ht:bA.bind(null,n),hn:SA.bind(null,n)}),n.la.push((async e=>{e?(n.Pa.Zt(),ec(n)?Zu(n):n.ha.set("Unknown")):(await n.Pa.stop(),Tp(n))}))),n.Pa}function Xn(n){return n.Ra||(n.Ra=(function(t,r,s){const i=re(t);return i.mn(),new ZI(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ut:()=>Promise.resolve(),lt:FA.bind(null,n),ht:xA.bind(null,n),An:LA.bind(null,n),Vn:kA.bind(null,n)}),n.la.push((async e=>{e?(n.Ra.Zt(),await va(n)):(await n.Ra.stop(),n.ia.length>0&&(K(Yt,`Stopping write stream with ${n.ia.length} pending writes`),n.ia=[]))}))),n.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ia(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ia(this.observer.error,e):dn("Uncaught Error in snapshot listener:",e.toString()))}Aa(){this.muted=!0}Ia(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nc{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new cn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const o=Date.now()+r,B=new nc(e,t,o,s,i);return B.start(r),B}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new q(k.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function rc(n,e){if(dn("AsyncQueue",`${e}: ${n}`),fs(n))return new q(k.UNAVAILABLE,`${e}: ${n}`);throw n}class pf{constructor(){this.activeTargetIds=EI()}La(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ba(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Na(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class MA{constructor(){this.du=new pf,this.fu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.du.La(e),this.fu[e]||"not-current"}updateQueryState(e,t,r){this.fu[e]=t}removeLocalQueryTarget(e){this.du.Ba(e)}isLocalQueryTarget(e){return this.du.activeTargetIds.has(e)}clearQueryState(e){delete this.fu[e]}getAllActiveQueryTargets(){return this.du.activeTargetIds}isActiveQueryTarget(e){return this.du.activeTargetIds.has(e)}start(){return this.du=new pf,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}function mB(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er{static emptySet(e){return new Er(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||$.comparator(t.key,r.key):(t,r)=>$.comparator(t.key,r.key),this.keyedMap=zr(),this.sortedSet=new Re(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Er)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Er;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gf{constructor(){this.mu=new Re($.comparator)}track(e){const t=e.doc.key,r=this.mu.get(t);r?e.type!==0&&r.type===3?this.mu=this.mu.insert(t,e):e.type===3&&r.type!==1?this.mu=this.mu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.mu=this.mu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.mu=this.mu.remove(t):e.type===1&&r.type===2?this.mu=this.mu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):X(63341,{ye:e,pu:r}):this.mu=this.mu.insert(t,e)}gu(){const e=[];return this.mu.inorderTraversal(((t,r)=>{e.push(r)})),e}}class Bs{constructor(e,t,r,s,i,o,B,u,c){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=B,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,r,s,i){const o=[];return t.forEach((B=>{o.push({type:0,doc:B})})),new Bs(e,t,Er.emptySet(t),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ta(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GA{constructor(){this.yu=void 0,this.wu=[]}bu(){return this.wu.some((e=>e.Su()))}}class UA{constructor(){this.queries=mf(),this.onlineState="Unknown",this.vu=new Set}terminate(){(function(t,r){const s=re(t),i=s.queries;s.queries=mf(),i.forEach(((o,B)=>{for(const u of B.wu)u.onError(r)}))})(this,new q(k.ABORTED,"Firestore shutting down"))}}function mf(){return new Fr((n=>dp(n)),Ta)}async function sc(n,e){const t=re(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.bu()&&e.Su()&&(r=2):(i=new GA,r=e.Su()?0:1);try{switch(r){case 0:i.yu=await t.onListen(s,!0);break;case 1:i.yu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const B=rc(o,`Initialization of query '${Ge(e.query)?ln(e.query):$s(e.query)}' failed`);return void e.onError(B)}t.queries.set(s,i),i.wu.push(e),e.Du(t.onlineState),i.yu&&e.xu(i.yu)&&oc(t)}async function ic(n,e){const t=re(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const o=i.wu.indexOf(e);o>=0&&(i.wu.splice(o,1),i.wu.length===0?s=e.Su()?0:1:!i.bu()&&e.Su()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function HA(n,e){const t=re(n);let r=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const B of o.wu)B.xu(s)&&(r=!0);o.yu=s}}r&&oc(t)}function qA(n,e,t){const r=re(n),s=r.queries.get(e);if(s)for(const i of s.wu)i.onError(t);r.queries.delete(e)}function oc(n){n.vu.forEach((e=>{e.next()}))}var ZB;(function(n){n.Default="default",n.Cache="cache"})(ZB||(ZB={}));class ac{constructor(e,t,r){this.query=e,this.Cu=t,this.Fu=!1,this.Ou=null,this.onlineState="Unknown",this.options=r||{}}xu(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Bs(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Fu?this.Mu(e)&&(this.Cu.next(e),t=!0):this.Nu(e,this.onlineState)&&(this.Lu(e),t=!0),this.Ou=e,t}onError(e){this.Cu.error(e)}Du(e){this.onlineState=e;let t=!1;return this.Ou&&!this.Fu&&this.Nu(this.Ou,e)&&(this.Lu(this.Ou),t=!0),t}Nu(e,t){if(!e.fromCache||!this.Su())return!0;const r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Mu(e){if(e.docChanges.length>0)return!0;const t=this.Ou&&this.Ou.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Lu(e){e=Bs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Fu=!0,this.Cu.next(e)}Su(){return this.options.source!==ZB.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pp{constructor(e){this.key=e}}class bp{constructor(e){this.key=e}}class JA{constructor(e,t){this.query=e,this.Gu=t,this.zu=null,this.hasCachedResults=!1,this.current=!1,this.ju=oe(),this.mutatedKeys=oe(),this.Hu=Ge(e)?$B(e):Au(e),this.Ju=new Er(this.Hu)}get Yu(){return this.Gu}Zu(e,t){const r=t?t.Xu:new gf,s=t?t.Ju:this.Ju;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,B=!1;const[u,c]=this.ec(this.query,s);e.inorderTraversal(((C,p)=>{const w=s.get(C),A=tA(this.query,p)?p:null,L=!!w&&this.mutatedKeys.has(w.key),M=!!A&&(A.hasLocalMutations||this.mutatedKeys.has(A.key)&&A.hasCommittedMutations);let j=!1;w&&A?w.data.isEqual(A.data)?L!==M&&(r.track({type:3,doc:A}),j=!0):this.tc(w,A)||(r.track({type:2,doc:A}),j=!0,(u&&this.Hu(A,u)>0||c&&this.Hu(A,c)<0)&&(B=!0)):!w&&A?(r.track({type:0,doc:A}),j=!0):w&&!A&&(r.track({type:1,doc:w}),j=!0,(u||c)&&(B=!0)),j&&(A?(o=o.add(A),i=M?i.add(C):i.delete(C)):(o=o.delete(C),i=i.delete(C)))}));const h=this.nc(this.query);if(h)if(Ge(this.query)){const C=[];o.forEach((A=>C.push(A)));const p=Ep(this.query,C);let w=new Er($B(this.query));for(const A of p)w=w.add(A);o.forEach((A=>{w.has(A.key)||(i=i.delete(A.key),r.track({type:1,doc:A}))})),o=w}else{const C=this.rc(this.query);for(;o.size>h;){const p=C==="F"?o.last():o.first();o=o.delete(p.key),i=i.delete(p.key),r.track({type:1,doc:p})}}return{Ju:o,Xu:r,Fo:B,mutatedKeys:i}}nc(e){var t;return Ge(e)?(t=gB(e))==null?void 0:t.limit:e.limit||void 0}rc(e){if(Ge(e)){const t=gB(e);return t&&t.limit<0?"L":"F"}return e.limitType}ec(e,t){var r;if(Ge(e)){const s=(r=gB(e))==null?void 0:r.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.nc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.nc(this.query)?t.first():null]}tc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Ju;this.Ju=e.Ju,this.mutatedKeys=e.mutatedKeys;const o=e.Xu.gu();o.sort(((h,C)=>(function(w,A){const L=M=>{switch(M){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return X(20277,{ye:M})}};return L(w)-L(A)})(h.type,C.type)||this.Hu(h.doc,C.doc))),this.sc(r),s=s??!1;const B=t&&!s?this._c():[],u=this.ju.size===0&&this.current&&!s?1:0,c=u!==this.zu;return this.zu=u,o.length!==0||c?{snapshot:new Bs(this.query,e.Ju,i,o,e.mutatedKeys,u===0,c,!1,!!r&&r.resumeToken.approximateByteSize()>0),oc:B}:{oc:B}}Du(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ju:this.Ju,Xu:new gf,mutatedKeys:this.mutatedKeys,Fo:!1},!1)):{oc:[]}}ac(e){return!this.Gu.has(e)&&!!this.Ju.has(e)&&!this.Ju.get(e).hasLocalMutations}sc(e){e&&(e.addedDocuments.forEach((t=>this.Gu=this.Gu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Gu=this.Gu.delete(t))),this.current=e.current)}_c(){if(!this.current)return[];const e=this.ju;this.ju=oe(),this.Ju.forEach((r=>{this.ac(r.key)&&(this.ju=this.ju.add(r.key))}));const t=[];return e.forEach((r=>{this.ju.has(r)||t.push(new bp(r))})),this.ju.forEach((r=>{e.has(r)||t.push(new Pp(r))})),t}uc(e){this.Gu=e.Qo,this.ju=oe();const t=this.Zu(e.documents);return this.applyChanges(t,!0)}cc(){return Bs.fromInitialDocuments(this.query,this.Ju,this.mutatedKeys,this.zu===0,this.hasCachedResults)}}const Bc="SyncEngine";class jA{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class KA{constructor(e){this.key=e,this.lc=!1}}class zA{constructor(e,t,r,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ec={},this.hc=new Fr((B=>dp(B)),Ta),this.Tc=new Map,this.Pc=new Set,this.Rc=new Re($.comparator),this.Ic=new Map,this.Ac=new zu,this.Vc={},this.dc=new Map,this.fc=Yn.ws(),this.onlineState="Unknown",this.mc=void 0}get isPrimaryClient(){return this.mc===!0}}async function QA(n,e,t=!0){const r=kp(n);let s;const i=r.hc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.cc()):s=await Sp(r,e,t,!0),s}async function WA(n,e){const t=kp(n);await Sp(t,e,!0,!1)}async function Sp(n,e,t,r){const s=await yA(n.localStore,Ge(e)?e:zt(e)),i=s.targetId,o=n.sharedClientState.addLocalQueryTarget(i,t);let B;return r&&(B=await $A(n,e,i,o==="current",s.resumeToken)),n.isPrimaryClient&&t&&Ip(n.remoteStore,s),B}async function $A(n,e,t,r,s){n.gc=(C,p,w)=>(async function(L,M,j,ee){let se=M.view.Zu(j);se.Fo&&(se=await Cf(L.localStore,M.query,!1).then((({documents:R})=>M.view.Zu(R,se))));const Be=ee&&ee.targetChanges.get(M.targetId),De=ee&&ee.targetMismatches.get(M.targetId)!=null,pe=M.view.applyChanges(se,L.isPrimaryClient,Be,De);return _f(L,M.targetId,pe.oc),pe.snapshot})(n,C,p,w);const i=await Cf(n.localStore,e,!0),o=new JA(e,i.Qo),B=o.Zu(i.documents),u=bi.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),c=o.applyChanges(B,n.isPrimaryClient,u);_f(n,t,c.oc);const h=new jA(e,t,o);return n.hc.set(e,h),n.Tc.has(t)?n.Tc.get(t).push(e):n.Tc.set(t,[e]),c.snapshot}async function YA(n,e,t){const r=re(n),s=r.hc.get(e),i=r.Tc.get(s.targetId);if(i.length>1)return r.Tc.set(s.targetId,i.filter((o=>!Ta(o,e)))),void r.hc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await YB(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Yu(r.remoteStore,s.targetId),eu(r,s.targetId)})).catch(hs)):(eu(r,s.targetId),await YB(r.localStore,s.targetId,!0))}async function XA(n,e){const t=re(n),r=t.hc.get(e),s=t.Tc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Yu(t.remoteStore,r.targetId))}async function ZA(n,e,t){const r=oR(n);try{const s=await(function(o,B){const u=re(o),c=Te.now(),h=B.reduce(((w,A)=>w.add(A.key)),oe());let C,p;return u.persistence.runTransaction("Locally write mutations","readwrite",(w=>{let A=ft(),L=oe();return u.Uo.getEntries(w,h).next((M=>{A=M,A.forEach(((j,ee)=>{ee.isValidDocument()||(L=L.add(j))}))})).next((()=>u.localDocuments.getOverlayedDocuments(w,A))).next((M=>{C=M;const j=[];for(const ee of B){const se=Kw(ee,C.get(ee.key).overlayedDocument);se!=null&&j.push(new nr(ee.key,se,Bd(se.value.mapValue),it.exists(!0)))}return u.mutationQueue.addMutationBatch(w,c,j,B)})).next((M=>{p=M;const j=M.applyToLocalDocumentSet(C,L);return u.documentOverlayCache.saveOverlays(w,M.batchId,j)}))})).then((()=>({batchId:p.batchId,changes:vd(C)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(o,B,u){let c=o.Vc[o.currentUser.toKey()];c||(c=new Re(ae)),c=c.insert(B,u),o.Vc[o.currentUser.toKey()]=c})(r,s.batchId,t),await xi(r,s.changes),await va(r.remoteStore)}catch(s){const i=rc(s,"Failed to persist write");t.reject(i)}}async function Op(n,e){const t=re(n);try{const r=await DA(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.Ic.get(i);o&&(Q(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.lc=!0:s.modifiedDocuments.size>0?Q(o.lc,14607):s.removedDocuments.size>0&&(Q(o.lc,42227),o.lc=!1))})),await xi(t,r,e)}catch(r){await hs(r)}}function Ef(n,e,t){const r=re(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.hc.forEach(((i,o)=>{const B=o.view.Du(e);B.snapshot&&s.push(B.snapshot)})),(function(o,B){const u=re(o);u.onlineState=B;let c=!1;u.queries.forEach(((h,C)=>{for(const p of C.wu)p.Du(B)&&(c=!0)})),c&&oc(u)})(r.eventManager,e),s.length&&r.Ec.hn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function eR(n,e,t){const r=re(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Ic.get(e),i=s&&s.key;if(i){let o=new Re($.comparator);o=o.insert(i,We.newNoDocument(i,ne.min()));const B=oe().add(i),u=new Pi(ne.min(),new Map,new Re(ae),o,ft(),B);await Op(r,u),r.Rc=r.Rc.remove(i),r.Ic.delete(e),uc(r)}else await YB(r.localStore,e,!1).then((()=>eu(r,e,t))).catch(hs)}async function tR(n,e){const t=re(n),r=e.batch.batchId;try{const s=await _A(t.localStore,e);Fp(t,r,null),Np(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await xi(t,s)}catch(s){await hs(s)}}async function nR(n,e,t){const r=re(n);try{const s=await(function(o,B){const u=re(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let h;return u.mutationQueue.lookupMutationBatch(c,B).next((C=>(Q(C!==null,37113),h=C.keys(),u.mutationQueue.removeMutationBatch(c,C)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,h,B))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,h))).next((()=>u.localDocuments.getDocuments(c,h)))}))})(r.localStore,e);Fp(r,e,t),Np(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await xi(r,s)}catch(s){await hs(s)}}function Np(n,e){(n.dc.get(e)||[]).forEach((t=>{t.resolve()})),n.dc.delete(e)}function Fp(n,e,t){const r=re(n);let s=r.Vc[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Vc[r.currentUser.toKey()]=s}}function eu(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Tc.get(e))n.hc.delete(r),t&&n.Ec.yc(r,t);n.Tc.delete(e),n.isPrimaryClient&&n.Ac.Xs(e).forEach((r=>{n.Ac.containsKey(r)||Lp(n,r)}))}function Lp(n,e){n.Pc.delete(e.path.canonicalString());const t=n.Rc.get(e);t!==null&&(Yu(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ic.delete(t),uc(n))}function _f(n,e,t){for(const r of t)r instanceof Pp?(n.Ac.addReference(r.key,e),rR(n,r)):r instanceof bp?(K(Bc,"Document no longer in limbo: "+r.key),n.Ac.removeReference(r.key,e),n.Ac.containsKey(r.key)||Lp(n,r.key)):X(19791,{wc:r})}function rR(n,e){const t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Pc.has(r)||(K(Bc,"New document in limbo: "+t),n.Pc.add(r),uc(n))}function uc(n){for(;n.Pc.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){const e=n.Pc.values().next().value;n.Pc.delete(e);const t=new $(Ce.fromString(e)),r=n.fc.next();n.Ic.set(r,new KA(t)),n.Rc=n.Rc.insert(t,r),Ip(n.remoteStore,new Bn(zt(da(t.path)),r,"TargetPurposeLimboResolution",ma.yn))}}async function xi(n,e,t){const r=re(n),s=[],i=[],o=[];r.hc.isEmpty()||(r.hc.forEach(((B,u)=>{o.push(r.gc(u,e,t).then((c=>{var h;if((c||t)&&r.isPrimaryClient){const C=c?!c.fromCache:(h=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:h.current;r.sharedClientState.updateQueryState(u.targetId,C?"current":"not-current")}if(c){s.push(c);const C=Wu.fo(u.targetId,c);i.push(C)}})))})),await Promise.all(o),r.Ec.hn(s),await(async function(u,c){const h=re(u);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",(C=>x.forEach(c,(p=>x.forEach(p.Ao,(w=>h.persistence.referenceDelegate.addReference(C,p.targetId,w))).next((()=>x.forEach(p.Vo,(w=>h.persistence.referenceDelegate.removeReference(C,p.targetId,w)))))))))}catch(C){if(!fs(C))throw C;K($u,"Failed to update sequence numbers: "+C)}for(const C of c){const p=C.targetId;if(!C.fromCache){const w=h.No.get(p),A=w.snapshotVersion,L=w.withLastLimboFreeSnapshotVersion(A);h.No=h.No.insert(p,L)}}})(r.localStore,i))}async function sR(n,e){const t=re(n);if(!t.currentUser.isEqual(e)){K(Bc,"User change. New user:",e.toKey());const r=await Dp(t.localStore,e);t.currentUser=e,(function(i,o){i.dc.forEach((B=>{B.forEach((u=>{u.reject(new q(k.CANCELLED,o))}))})),i.dc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await xi(t,r.qo)}}function iR(n,e){const t=re(n),r=t.Ic.get(e);if(r&&r.lc)return oe().add(r.key);{let s=oe();const i=t.Tc.get(e);if(!i)return s;for(const o of i??[]){const B=t.hc.get(o);s=s.unionWith(B.view.Yu)}return s}}function kp(n){const e=re(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Op.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=iR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=eR.bind(null,e),e.Ec.hn=HA.bind(null,e.eventManager),e.Ec.yc=qA.bind(null,e.eventManager),e}function oR(n){const e=re(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=tR.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=nR.bind(null,e),e}class $o{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ga(e.databaseInfo.databaseId),this.sharedClientState=this.Sc(e),this.persistence=this.vc(e),await this.persistence.start(),this.localStore=this.Dc(e),this.gcScheduler=this.xc(e,this.localStore),this.indexBackfillerScheduler=this.Cc(e,this.localStore)}xc(e,t){return null}Cc(e,t){return null}Dc(e){return EA(this.persistence,new pA,e.initialUser,this.serializer)}vc(e){return new _p(Qu.w_,this.serializer)}Sc(e){return new MA}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}$o.provider={build:()=>new $o};class aR extends $o{constructor(e){super(),this.cacheSizeBytes=e}xc(e,t){Q(this.persistence.referenceDelegate instanceof Qo,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new cy(r,e.asyncQueue,t)}vc(e){const t=this.cacheSizeBytes!==void 0?ct.withCacheSize(this.cacheSizeBytes):ct.DEFAULT;return new _p((r=>Qo.w_(r,t)),this.serializer)}}class tu{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Ef(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=sR.bind(null,this.syncEngine),await VA(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new UA})()}createDatastore(e){const t=ga(e.databaseInfo.databaseId),r=YI(e.databaseInfo);return ny(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,o,B){return new RA(r,s,i,o,B)})(this.localStore,this.datastore,e.asyncQueue,(t=>Ef(this.syncEngine,t,0)),(function(){return nf.Je()?new nf:new zI})())}createSyncEngine(e,t){return(function(s,i,o,B,u,c,h){const C=new zA(s,i,o,B,u,c);return h&&(C.mc=!0),C})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=re(s);K(Yt,"RemoteStore shutting down."),i.ca.add(5),await ki(i),i.Ea.shutdown(),i.ha.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}tu.provider={build:()=>new tu};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zn="FirestoreClient";class BR{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=Qe.UNAUTHENTICATED,this.clientId=wu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async o=>{K(Zn,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(r,(o=>(K(Zn,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new cn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=rc(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function EB(n,e){n.asyncQueue.verifyOperationInProgress(),K(Zn,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await Dp(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Df(n,e){n.asyncQueue.verifyOperationInProgress();const t=await uR(n);K(Zn,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>df(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>df(e.remoteStore,s))),n._onlineComponents=e}async function uR(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){K(Zn,"Using user provided OfflineComponentProvider");try{await EB(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===k.FAILED_PRECONDITION||s.code===k.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;xt("Error using user provided cache. Falling back to memory cache: "+t),await EB(n,new $o)}}else K(Zn,"Using default OfflineComponentProvider"),await EB(n,new aR(void 0));return n._offlineComponents}async function xp(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(K(Zn,"Using user provided OnlineComponentProvider"),await Df(n,n._uninitializedComponentsProvider._online)):(K(Zn,"Using default OnlineComponentProvider"),await Df(n,new tu))),n._onlineComponents}function cR(n){return xp(n).then((e=>e.syncEngine))}async function Yo(n){const e=await xp(n),t=e.eventManager;return t.onListen=QA.bind(null,e.syncEngine),t.onUnlisten=YA.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=WA.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=XA.bind(null,e.syncEngine),t}function lR(n,e,t,r){const s=new tc(r),i=new ac(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>sc(await Yo(n),i))),()=>{s.Aa(),n.asyncQueue.enqueueAndForget((async()=>ic(await Yo(n),i)))}}function hR(n,e,t={}){const r=new cn;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,B,u,c){const h=new tc({next:p=>{h.Aa(),o.enqueueAndForget((()=>ic(i,C)));const w=p.docs.has(B);!w&&p.fromCache?c.reject(new q(k.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&p.fromCache&&u&&u.source==="server"?c.reject(new q(k.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(p)},error:p=>c.reject(p)}),C=new ac(da(B.path),h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return sc(i,C)})(await Yo(n),n.asyncQueue,e,t,r))),r.promise}function fR(n,e,t={}){const r=new cn;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,B,u,c){const h=new tc({next:p=>{h.Aa(),o.enqueueAndForget((()=>ic(i,C))),p.fromCache&&u.source==="server"?c.reject(new q(k.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(p)},error:p=>c.reject(p)}),C=new ac(B instanceof Xs?KT(B):B,h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return sc(i,C)})(await Yo(n),n.asyncQueue,e,t,r))),r.promise}function CR(n,e){const t=new cn;return n.asyncQueue.enqueueAndForget((async()=>ZA(await cR(n),e,t))),t.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vp=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Pe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new dR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Qn("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},dR=class extends Vp{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pR{convertValue(e,t="none"){switch(Ve(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ve(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Jn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw X(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return tr(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var r,s,i;const t=(i=(s=(r=e.fields)==null?void 0:r[oi].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>ve(o.doubleValue)));return new dt(t)}convertGeoPoint(e){return new Wt(ve(e.latitude),ve(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Ri(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(rs(e));default:return null}}convertTimestamp(e){const t=qn(e);return new Te(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Ce.fromString(e);Q(Vd(r),9688,{name:e});const s=new si(r.get(1),r.get(3)),i=new $(r.popFirst(5));return s.isEqual(t)||dn(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cc(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wf="AsyncQueue";class If{constructor(e=Promise.resolve()){this.qc=[],this.$c=!1,this.Kc=[],this.Qc=null,this.Wc=!1,this.Gc=!1,this.zc=[],this.jt=new qd(this,"async_queue_retry"),this.jc=()=>{const r=mB();r&&K(wf,"Visibility state changed to "+r.visibilityState),this.jt.qt()},this.Hc=e;const t=mB();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.jc)}get isShuttingDown(){return this.$c}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Jc(),this.Yc(e)}enterRestrictedMode(e){if(!this.$c){this.$c=!0,this.Gc=e||!1;const t=mB();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.jc)}}enqueue(e){if(this.Jc(),this.$c)return new Promise((()=>{}));const t=new cn;return this.Yc((()=>this.$c&&this.Gc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.qc.push(e),this.Zc())))}async Zc(){if(this.qc.length!==0){try{await this.qc[0](),this.qc.shift(),this.jt.reset()}catch(e){if(!fs(e))throw e;K(wf,"Operation failed with retryable error: "+e)}this.qc.length>0&&this.jt.Ut((()=>this.Zc()))}}Yc(e){const t=this.Hc.then((()=>(this.Wc=!0,e().catch((r=>{throw this.Qc=r,this.Wc=!1,dn("INTERNAL UNHANDLED ERROR: ",yf(r)),r})).then((r=>(this.Wc=!1,r))))));return this.Hc=t,t}enqueueAfterDelay(e,t,r){this.Jc(),this.zc.indexOf(e)>-1&&(t=0);const s=nc.createAndSchedule(this,e,t,r,(i=>this.Xc(i)));return this.Kc.push(s),s}Jc(){this.Qc&&X(47125,{el:yf(this.Qc)})}verifyOperationInProgress(){}async tl(){let e;do e=this.Hc,await e;while(e!==this.Hc)}nl(e){for(const t of this.Kc)if(t.timerId===e)return!0;return!1}rl(e){return this.tl().then((()=>{this.Kc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.Kc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.tl()}))}il(e){this.zc.push(e)}Xc(e){const t=this.Kc.indexOf(e);this.Kc.splice(t,1)}}function yf(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class Xt extends Ea{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new If,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new If(e),this._firestoreClient=void 0,await e}}}function pb(n,e){const t=typeof n=="object"?n:ra(),r=typeof n=="string"?n:Vo,s=er(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Qf("firestore");i&&fy(s,...i)}return s}function Vi(n){if(n._terminated)throw new q(k.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||gR(n),n._firestoreClient}function gR(n){var r,s,i,o;const e=n._freezeSettings(),t=sy(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,e);n._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new BR(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(u){const c=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(c),_online:c}})(n._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc extends pR{constructor(e){super(),this.firestore=e}convertBytes(e){return new Pt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Pe(this.firestore,null,t)}}class Js{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class _r extends Vp{constructor(e,t,r,s,i,o){super(e,t,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ro(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Qn("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new q(k.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=_r._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}_r._jsonSchemaVersion="firestore/documentSnapshot/1.0",_r._jsonSchema={type:Le("string",_r._jsonSchemaVersion),bundleSource:Le("string","DocumentSnapshot"),bundleName:Le("string"),bundle:Le("string")};class Ro extends _r{data(e={}){return super.data(e)}}class Dr{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Js(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Ro(this._firestore,this._userDataWriter,r.key,r,new Js(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new q(k.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((B=>{Ge(s._snapshot.query)?$B(s._snapshot.query):Au(s.query._query);const u=new Ro(s._firestore,s._userDataWriter,B.doc.key,B.doc,new Js(s._snapshot.mutatedKeys.has(B.doc.key),s._snapshot.fromCache),s.query.converter);return B.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((B=>i||B.type!==3)).map((B=>{const u=new Ro(s._firestore,s._userDataWriter,B.doc.key,B.doc,new Js(s._snapshot.mutatedKeys.has(B.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,h=-1;return B.type!==0&&(c=o.indexOf(B.doc.key),o=o.delete(B.doc.key)),B.type!==1&&(o=o.add(B.doc),h=o.indexOf(B.doc.key)),{type:mR(B.type),doc:u,oldIndex:c,newIndex:h}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new q(k.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Dr._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=wu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function mR(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return X(61501,{type:n})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Dr._jsonSchemaVersion="firestore/querySnapshot/1.0",Dr._jsonSchema={type:Le("string",Dr._jsonSchemaVersion),bundleSource:Le("string","QuerySnapshot"),bundleName:Le("string"),bundle:Le("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mp(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new q(k.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class hc{}class Gp extends hc{}function gb(n,e,...t){let r=[];e instanceof hc&&r.push(e),r=r.concat(t),(function(i){const o=i.filter((u=>u instanceof fc)).length,B=i.filter((u=>u instanceof Pa)).length;if(o>1||o>0&&B>0)throw new q(k.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class Pa extends Gp{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new Pa(e,t,r)}_apply(e){const t=this._parse(e);return Up(e._query,t),new rr(e.firestore,e.converter,qB(e._query,t))}_parse(e){const t=Ni(e.firestore);return(function(i,o,B,u,c,h,C){let p;if(c.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new q(k.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){Af(C,h);const A=[];for(const L of C)A.push(Tf(u,i,L));p={arrayValue:{values:A}}}else p=Tf(u,i,C)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||Af(C,h),p=my(B,o,C,h==="in"||h==="not-in");return Fe.create(c,h,p)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function mb(n,e,t){const r=e,s=Qn("where",n);return Pa._create(s,r,t)}class fc extends hc{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new fc(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:Vt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const B=i.getFlattenedFilters();for(const u of B)Up(o,u),o=qB(o,u)})(e._query,t),new rr(e.firestore,e.converter,qB(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Cc extends Gp{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Cc(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new q(k.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new q(k.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new li(i,o)})(e._query,this._field,this._direction);return new rr(e.firestore,e.converter,cI(e._query,t))}}function Eb(n,e="asc"){const t=e,r=Qn("orderBy",n);return Cc._create(r,t)}function Tf(n,e,t){if(typeof(t=de(t))=="string"){if(t==="")throw new q(k.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Td(e)&&t.indexOf("/")!==-1)throw new q(k.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(Ce.fromString(t));if(!$.isDocumentKey(r))throw new q(k.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Gh(n,new $(r))}if(t instanceof Pe)return Gh(n,t._key);throw new q(k.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${aa(t)}.`)}function Af(n,e){if(!Array.isArray(n)||n.length===0)throw new q(k.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Up(n,e){const t=(function(s,i){for(const o of s)for(const B of o.getFlattenedFilters())if(i.indexOf(B.op)>=0)return B.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new q(k.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new q(k.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rf(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ER{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Ni(e)}set(e,t,r){this._verifyNotCommitted();const s=_B(e,this._firestore),i=cc(s.converter,t,r),o=Su(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(o.toMutation(s._key,it.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const i=_B(e,this._firestore);let o;return o=typeof(t=de(t))=="string"||t instanceof Si?$d(this._dataReader,"WriteBatch.update",i._key,t,r,s):Wd(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,it.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=_B(e,this._firestore);return this._mutations=this._mutations.concat(new Ca(t._key,it.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new q(k.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function _B(n,e){if((n=de(n)).firestore!==e)throw new q(k.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _b(n){n=st(n,Pe);const e=st(n.firestore,Xt),t=Vi(e);return hR(t,n._key).then((r=>Hp(e,n,r)))}function Db(n){n=st(n,rr);const e=st(n.firestore,Xt),t=Vi(e),r=new lc(e);return Mp(n._query),fR(t,n._query).then((s=>new Dr(e,r,n,s)))}function wb(n,e,t){n=st(n,Pe);const r=st(n.firestore,Xt),s=cc(n.converter,e,t),i=Ni(r);return Mi(r,[Su(i,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,it.none())])}function Ib(n,e,t,...r){n=st(n,Pe);const s=st(n.firestore,Xt),i=Ni(s);let o;return o=typeof(e=de(e))=="string"||e instanceof Si?$d(i,"updateDoc",n._key,e,t,r):Wd(i,"updateDoc",n._key,e),Mi(s,[o.toMutation(n._key,it.exists(!0))])}function yb(n){return Mi(st(n.firestore,Xt),[new Ca(n._key,it.none())])}function Tb(n,e){const t=st(n.firestore,Xt),r=Cy(n),s=cc(n.converter,e),i=Ni(n.firestore);return Mi(t,[Su(i,"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,it.exists(!1))]).then((()=>r))}function Ab(n,...e){var c,h,C;n=de(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||Rf(e[r])||(t=e[r++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Rf(e[r])){const p=e[r];e[r]=(c=p.next)==null?void 0:c.bind(p),e[r+1]=(h=p.error)==null?void 0:h.bind(p),e[r+2]=(C=p.complete)==null?void 0:C.bind(p)}let i,o,B;if(n instanceof Pe)o=st(n.firestore,Xt),B=da(n._key.path),i={next:p=>{e[r]&&e[r](Hp(o,n,p))},error:e[r+1],complete:e[r+2]};else{const p=st(n,rr);o=st(p.firestore,Xt),B=p._query;const w=new lc(o);i={next:A=>{e[r]&&e[r](new Dr(o,w,p,A))},error:e[r+1],complete:e[r+2]},Mp(n._query)}const u=Vi(o);return lR(u,B,s,i)}function Mi(n,e){const t=Vi(n);return CR(t,e)}function Hp(n,e,t){const r=t.docs.get(e._key),s=new lc(n);return new _r(n,s,e._key,r,new Js(t.hasPendingWrites,t.fromCache),e.converter)}function Rb(n){return n=st(n,Xt),Vi(n),new ER(n,(e=>Mi(n,e)))}const vf="@firebase/firestore",Pf="4.17.1";(function(e,t=!0){Rw(Nr),kt(new bt("firestore",((r,{instanceIdentifier:s,options:i})=>{const o=r.getProvider("app").getImmediate(),B=new Xt(new qI(r.getProvider("auth-internal")),new KI(o,r.getProvider("app-check-internal")),kw(o,s),o);return i={useFetchStreams:t,...i},B._setSettings(i),B}),"PUBLIC").setMultipleInstances(!0)),Ct(vf,Pf,e),Ct(vf,Pf,"esm2020")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qp="firebasestorage.googleapis.com",Jp="storageBucket",_R=120*1e3,DR=600*1e3,wR=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be extends Nt{constructor(e,t,r=0){super(DB(e),`Firebase Storage: ${t} (${DB(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,be.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return DB(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Ae;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Ae||(Ae={}));function DB(n){return"storage/"+n}function dc(){const n="An unknown error occurred, please check the error payload for server response.";return new be(Ae.UNKNOWN,n)}function IR(n){return new be(Ae.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function yR(n){return new be(Ae.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function TR(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new be(Ae.UNAUTHENTICATED,n)}function AR(){return new be(Ae.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function RR(n){return new be(Ae.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function jp(){return new be(Ae.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Kp(){return new be(Ae.CANCELED,"User canceled the upload/download.")}function vR(n){return new be(Ae.INVALID_URL,"Invalid URL '"+n+"'.")}function PR(n){return new be(Ae.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function bR(){return new be(Ae.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Jp+"' property when initializing the app?")}function zp(){return new be(Ae.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function SR(){return new be(Ae.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function OR(){return new be(Ae.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function NR(n){return new be(Ae.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function nu(n){return new be(Ae.INVALID_ARGUMENT,n)}function Qp(){return new be(Ae.APP_DELETED,"The Firebase app was deleted.")}function FR(n){return new be(Ae.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function ei(n,e){return new be(Ae.INVALID_FORMAT,"String does not match format '"+n+"': "+e)}function Vs(n){throw new be(Ae.INTERNAL_ERROR,"Internal error: "+n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=yt.makeFromUrl(e,t)}catch{return new yt(e,"")}if(r.path==="")return r;throw PR(e)}static makeFromUrl(e,t){let r=null;const s="([A-Za-z0-9.\\-_]+)";function i(Be){Be.path.charAt(Be.path.length-1)==="/"&&(Be.path_=Be.path_.slice(0,-1))}const o="(/(.*))?$",B=new RegExp("^gs://"+s+o,"i"),u={bucket:1,path:3};function c(Be){Be.path_=decodeURIComponent(Be.path)}const h="v[A-Za-z0-9_]+",C=t.replace(/[.]/g,"\\."),p="(/([^?#]*).*)?$",w=new RegExp(`^https?://${C}/${h}/b/${s}/o${p}`,"i"),A={bucket:1,path:3},L=t===qp?"(?:storage.googleapis.com|storage.cloud.google.com)":t,M="([^?#]*)",j=new RegExp(`^https?://${L}/${s}/${M}`,"i"),se=[{regex:B,indices:u,postModify:i},{regex:w,indices:A,postModify:c},{regex:j,indices:{bucket:1,path:2},postModify:c}];for(let Be=0;Be<se.length;Be++){const De=se[Be],pe=De.regex.exec(e);if(pe){const R=pe[De.indices.bucket];let E=pe[De.indices.path];E||(E=""),r=new yt(R,E),De.postModify(r);break}}if(r==null)throw vR(e);return r}}class LR{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kR(n,e,t){let r=1,s=null,i=null,o=!1,B=0;function u(){return B===2}let c=!1;function h(...M){c||(c=!0,e.apply(null,M))}function C(M){s=setTimeout(()=>{s=null,n(w,u())},M)}function p(){i&&clearTimeout(i)}function w(M,...j){if(c){p();return}if(M){p(),h.call(null,M,...j);return}if(u()||o){p(),h.call(null,M,...j);return}r<64&&(r*=2);let se;B===1?(B=2,se=0):se=(r+Math.random())*1e3,C(se)}let A=!1;function L(M){A||(A=!0,p(),!c&&(s!==null?(M||(B=2),clearTimeout(s),C(0)):M||(B=1)))}return C(0),i=setTimeout(()=>{o=!0,L(!0)},t),L}function xR(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function VR(n){return n!==void 0}function MR(n){return typeof n=="function"}function GR(n){return typeof n=="object"&&!Array.isArray(n)}function ba(n){return typeof n=="string"||n instanceof String}function bf(n){return pc()&&n instanceof Blob}function pc(){return typeof Blob<"u"}function Sf(n,e,t,r){if(r<e)throw nu(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw nu(`Invalid value for '${n}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(n,e,t){let r=e;return t==null&&(r=`https://${e}`),`${t}://${r}/v0${n}`}function Wp(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const s=e(r)+"="+e(n[r]);t=t+s+"&"}return t=t.slice(0,-1),t}var wr;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(wr||(wr={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $p(n,e){const t=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,i=e.indexOf(n)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UR{constructor(e,t,r,s,i,o,B,u,c,h,C,p=!0,w=!1){this.url_=e,this.method_=t,this.headers_=r,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=B,this.errorCallback_=u,this.timeout_=c,this.progressCallback_=h,this.connectionFactory_=C,this.retry=p,this.isUsingEmulator=w,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((A,L)=>{this.resolve_=A,this.reject_=L,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new Co(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=B=>{const u=B.loaded,c=B.lengthComputable?B.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,c)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const B=i.getErrorCode()===wr.NO_ERROR,u=i.getStatus();if(!B||$p(u,this.additionalRetryCodes_)&&this.retry){const h=i.getErrorCode()===wr.ABORT;r(!1,new Co(!1,null,h));return}const c=this.successCodes_.indexOf(u)!==-1;r(!0,new Co(c,i))})},t=(r,s)=>{const i=this.resolve_,o=this.reject_,B=s.connection;if(s.wasSuccessCode)try{const u=this.callback_(B,B.getResponse());VR(u)?i(u):i()}catch(u){o(u)}else if(B!==null){const u=dc();u.serverResponse=B.getErrorText(),this.errorCallback_?o(this.errorCallback_(B,u)):o(u)}else if(s.canceled){const u=this.appDelete_?Qp():Kp();o(u)}else{const u=jp();o(u)}};this.canceled_?t(!1,new Co(!1,null,!0)):this.backoffId_=kR(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&xR(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Co{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function HR(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function qR(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function JR(n,e){e&&(n["X-Firebase-GMPID"]=e)}function jR(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function KR(n,e,t,r,s,i,o=!0,B=!1){const u=Wp(n.urlParams),c=n.url+u,h=Object.assign({},n.headers);return JR(h,e),HR(h,t),qR(h,i),jR(h,r),new UR(c,n.method,h,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,o,B)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zR(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function QR(...n){const e=zR();if(e!==void 0){const t=new e;for(let r=0;r<n.length;r++)t.append(n[r]);return t.getBlob()}else{if(pc())return new Blob(n);throw new be(Ae.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function WR(n,e,t){return n.webkitSlice?n.webkitSlice(e,t):n.mozSlice?n.mozSlice(e,t):n.slice?n.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $R(n){if(typeof atob>"u")throw NR("base-64");return atob(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jt={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class wB{constructor(e,t){this.data=e,this.contentType=t||null}}function YR(n,e){switch(n){case Jt.RAW:return new wB(Yp(e));case Jt.BASE64:case Jt.BASE64URL:return new wB(Xp(n,e));case Jt.DATA_URL:return new wB(ZR(e),ev(e))}throw dc()}function Yp(n){const e=[];for(let t=0;t<n.length;t++){let r=n.charCodeAt(t);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(t<n.length-1&&(n.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const i=r,o=n.charCodeAt(++t);r=65536|(i&1023)<<10|o&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function XR(n){let e;try{e=decodeURIComponent(n)}catch{throw ei(Jt.DATA_URL,"Malformed data URL.")}return Yp(e)}function Xp(n,e){switch(n){case Jt.BASE64:{const s=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(s||i)throw ei(n,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case Jt.BASE64URL:{const s=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(s||i)throw ei(n,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=$R(e)}catch(s){throw s.message.includes("polyfill")?s:ei(n,"Invalid character found")}const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}class Zp{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw ei(Jt.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=t[1]||null;r!=null&&(this.base64=tv(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function ZR(n){const e=new Zp(n);return e.base64?Xp(Jt.BASE64,e.rest):XR(e.rest)}function ev(n){return new Zp(n).contentType}function tv(n,e){return n.length>=e.length?n.substring(n.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e,t){let r=0,s="";bf(e)?(this.data_=e,r=e.size,s=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,t){if(bf(this.data_)){const r=this.data_,s=WR(r,e,t);return s===null?null:new tn(s)}else{const r=new Uint8Array(this.data_.buffer,e,t-e);return new tn(r,!0)}}static getBlob(...e){if(pc()){const t=e.map(r=>r instanceof tn?r.data_:r);return new tn(QR.apply(null,t))}else{const t=e.map(o=>ba(o)?YR(Jt.RAW,o).data:o.data_);let r=0;t.forEach(o=>{r+=o.byteLength});const s=new Uint8Array(r);let i=0;return t.forEach(o=>{for(let B=0;B<o.length;B++)s[i++]=o[B]}),new tn(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eg(n){let e;try{e=JSON.parse(n)}catch{return null}return GR(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nv(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function rv(n,e){const t=e.split("/").filter(r=>r.length>0).join("/");return n.length===0?t:n+"/"+t}function tg(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sv(n,e){return e}class et{constructor(e,t,r,s){this.server=e,this.local=t||e,this.writable=!!r,this.xform=s||sv}}let po=null;function iv(n){return!ba(n)||n.length<2?n:tg(n)}function gc(){if(po)return po;const n=[];n.push(new et("bucket")),n.push(new et("generation")),n.push(new et("metageneration")),n.push(new et("name","fullPath",!0));function e(i,o){return iv(o)}const t=new et("name");t.xform=e,n.push(t);function r(i,o){return o!==void 0?Number(o):o}const s=new et("size");return s.xform=r,n.push(s),n.push(new et("timeCreated")),n.push(new et("updated")),n.push(new et("md5Hash",null,!0)),n.push(new et("cacheControl",null,!0)),n.push(new et("contentDisposition",null,!0)),n.push(new et("contentEncoding",null,!0)),n.push(new et("contentLanguage",null,!0)),n.push(new et("contentType",null,!0)),n.push(new et("metadata","customMetadata",!0)),po=n,po}function ov(n,e){function t(){const r=n.bucket,s=n.fullPath,i=new yt(r,s);return e._makeStorageReference(i)}Object.defineProperty(n,"ref",{get:t})}function av(n,e,t){const r={};r.type="file";const s=t.length;for(let i=0;i<s;i++){const o=t[i];r[o.local]=o.xform(r,e[o.server])}return ov(r,n),r}function ng(n,e,t){const r=eg(e);return r===null?null:av(n,r,t)}function Bv(n,e,t,r){const s=eg(e);if(s===null||!ba(s.downloadTokens))return null;const i=s.downloadTokens;if(i.length===0)return null;const o=encodeURIComponent;return i.split(",").map(c=>{const h=n.bucket,C=n.fullPath,p="/b/"+o(h)+"/o/"+o(C),w=Es(p,t,r),A=Wp({alt:"media",token:c});return w+A})[0]}function rg(n,e){const t={},r=e.length;for(let s=0;s<r;s++){const i=e[s];i.writable&&(t[i.server]=n[i.local])}return JSON.stringify(t)}class xr{constructor(e,t,r,s){this.url=e,this.method=t,this.handler=r,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hn(n){if(!n)throw dc()}function mc(n,e){function t(r,s){const i=ng(n,s,e);return hn(i!==null),i}return t}function uv(n,e){function t(r,s){const i=ng(n,s,e);return hn(i!==null),Bv(i,s,n.host,n._protocol)}return t}function Gi(n){function e(t,r){let s;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?s=AR():s=TR():t.getStatus()===402?s=yR(n.bucket):t.getStatus()===403?s=RR(n.path):s=r,s.status=t.getStatus(),s.serverResponse=r.serverResponse,s}return e}function Ec(n){const e=Gi(n);function t(r,s){let i=e(r,s);return r.getStatus()===404&&(i=IR(n.path)),i.serverResponse=s.serverResponse,i}return t}function cv(n,e,t){const r=e.fullServerUrl(),s=Es(r,n.host,n._protocol),i="GET",o=n.maxOperationRetryTime,B=new xr(s,i,mc(n,t),o);return B.errorHandler=Ec(e),B}function lv(n,e,t){const r=e.fullServerUrl(),s=Es(r,n.host,n._protocol),i="GET",o=n.maxOperationRetryTime,B=new xr(s,i,uv(n,t),o);return B.errorHandler=Ec(e),B}function hv(n,e){const t=e.fullServerUrl(),r=Es(t,n.host,n._protocol),s="DELETE",i=n.maxOperationRetryTime;function o(u,c){}const B=new xr(r,s,o,i);return B.successCodes=[200,204],B.errorHandler=Ec(e),B}function fv(n,e){return n&&n.contentType||e&&e.type()||"application/octet-stream"}function sg(n,e,t){const r=Object.assign({},t);return r.fullPath=n.path,r.size=e.size(),r.contentType||(r.contentType=fv(null,e)),r}function ig(n,e,t,r,s){const i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function B(){let se="";for(let Be=0;Be<2;Be++)se=se+Math.random().toString().slice(2);return se}const u=B();o["Content-Type"]="multipart/related; boundary="+u;const c=sg(e,r,s),h=rg(c,t),C="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+h+`\r
--`+u+`\r
Content-Type: `+c.contentType+`\r
\r
`,p=`\r
--`+u+"--",w=tn.getBlob(C,r,p);if(w===null)throw zp();const A={name:c.fullPath},L=Es(i,n.host,n._protocol),M="POST",j=n.maxUploadRetryTime,ee=new xr(L,M,mc(n,t),j);return ee.urlParams=A,ee.headers=o,ee.body=w.uploadData(),ee.errorHandler=Gi(e),ee}class Xo{constructor(e,t,r,s){this.current=e,this.total=t,this.finalized=!!r,this.metadata=s||null}}function _c(n,e){let t=null;try{t=n.getResponseHeader("X-Goog-Upload-Status")}catch{hn(!1)}return hn(!!t&&(e||["active"]).indexOf(t)!==-1),t}function Cv(n,e,t,r,s){const i=e.bucketOnlyServerUrl(),o=sg(e,r,s),B={name:o.fullPath},u=Es(i,n.host,n._protocol),c="POST",h={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${r.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},C=rg(o,t),p=n.maxUploadRetryTime;function w(L){_c(L);let M;try{M=L.getResponseHeader("X-Goog-Upload-URL")}catch{hn(!1)}return hn(ba(M)),M}const A=new xr(u,c,w,p);return A.urlParams=B,A.headers=h,A.body=C,A.errorHandler=Gi(e),A}function dv(n,e,t,r){const s={"X-Goog-Upload-Command":"query"};function i(c){const h=_c(c,["active","final"]);let C=null;try{C=c.getResponseHeader("X-Goog-Upload-Size-Received")}catch{hn(!1)}C||hn(!1);const p=Number(C);return hn(!isNaN(p)),new Xo(p,r.size(),h==="final")}const o="POST",B=n.maxUploadRetryTime,u=new xr(t,o,i,B);return u.headers=s,u.errorHandler=Gi(e),u}const Of=256*1024;function pv(n,e,t,r,s,i,o,B){const u=new Xo(0,0);if(o?(u.current=o.current,u.total=o.total):(u.current=0,u.total=r.size()),r.size()!==u.total)throw SR();const c=u.total-u.current;let h=c;s>0&&(h=Math.min(h,s));const C=u.current,p=C+h;let w="";h===0?w="finalize":c===h?w="upload, finalize":w="upload";const A={"X-Goog-Upload-Command":w,"X-Goog-Upload-Offset":`${u.current}`},L=r.slice(C,p);if(L===null)throw zp();function M(Be,De){const pe=_c(Be,["active","final"]),R=u.current+h,E=r.size();let D;return pe==="final"?D=mc(e,i)(Be,De):D=null,new Xo(R,E,pe==="final",D)}const j="POST",ee=e.maxUploadRetryTime,se=new xr(t,j,M,ee);return se.headers=A,se.body=L.uploadData(),se.progressCallback=B||null,se.errorHandler=Gi(n),se}const lt={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function IB(n){switch(n){case"running":case"pausing":case"canceling":return lt.RUNNING;case"paused":return lt.PAUSED;case"success":return lt.SUCCESS;case"canceled":return lt.CANCELED;case"error":return lt.ERROR;default:return lt.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gv{constructor(e,t,r){if(MR(e)||t!=null||r!=null)this.next=e,this.error=t??void 0,this.complete=r??void 0;else{const i=e;this.next=i.next,this.error=i.error,this.complete=i.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hr(n){return(...e)=>{Promise.resolve().then(()=>n(...e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=wr.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=wr.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=wr.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,s,i){if(this.sent_)throw Vs("cannot .send() more than once");if(Or(e)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(const o in i)i.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,i[o].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Vs("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Vs("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Vs("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Vs("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class Ev extends mv{initXhr(){this.xhr_.responseType="text"}}function Ln(){return new Ev}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _v{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(e,t,r=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=r,this._mappings=gc(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=s=>{if(this._request=void 0,this._chunkMultiplier=1,s._codeEquals(Ae.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const i=this.isExponentialBackoffExpired();if($p(s.status,[]))if(i)s=jp();else{this.sleepTime=Math.max(this.sleepTime*2,wR),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=s,this._transition("error")}},this._metadataErrorHandler=s=>{this._request=void 0,s._codeEquals(Ae.CANCELED)?this.completeTransitions_():(this._error=s,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((s,i)=>{this._resolve=s,this._reject=i,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const e=this._transferred;return t=>this._updateProgress(e+t)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([t,r])=>{switch(this._state){case"running":e(t,r);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,t)=>{const r=Cv(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(r,Ln,e,t);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._uploadUrl=i,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((t,r)=>{const s=dv(this._ref.storage,this._ref._location,e,this._blob),i=this._ref.storage._makeRequest(s,Ln,t,r);this._request=i,i.getPromise().then(o=>{o=o,this._request=void 0,this._updateProgress(o.current),this._needToFetchStatus=!1,o.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=Of*this._chunkMultiplier,t=new Xo(this._transferred,this._blob.size()),r=this._uploadUrl;this._resolveToken((s,i)=>{let o;try{o=pv(this._ref._location,this._ref.storage,r,this._blob,e,this._mappings,t,this._makeProgressCallback())}catch(u){this._error=u,this._transition("error");return}const B=this._ref.storage._makeRequest(o,Ln,s,i,!1);this._request=B,B.getPromise().then(u=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(u.current),u.finalized?(this._metadata=u.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){Of*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,t)=>{const r=cv(this._ref.storage,this._ref._location,this._mappings),s=this._ref.storage._makeRequest(r,Ln,e,t);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,t)=>{const r=ig(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(r,Ln,e,t);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const t=this._state==="paused";this._state=e,t&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=Kp(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=IB(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,t,r,s){const i=new gv(t||void 0,r||void 0,s||void 0);return this._addObserver(i),()=>{this._removeObserver(i)}}then(e,t){return this._promise.then(e,t)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const t=this._observers.indexOf(e);t!==-1&&this._observers.splice(t,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(t=>{this._notifyObserver(t)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(IB(this._state)){case lt.SUCCESS:Hr(this._resolve.bind(null,this.snapshot))();break;case lt.CANCELED:case lt.ERROR:const t=this._reject;Hr(t.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(IB(this._state)){case lt.RUNNING:case lt.PAUSED:e.next&&Hr(e.next.bind(e,this.snapshot))();break;case lt.SUCCESS:e.complete&&Hr(e.complete.bind(e))();break;case lt.CANCELED:case lt.ERROR:e.error&&Hr(e.error.bind(e,this._error))();break;default:e.error&&Hr(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{constructor(e,t){this._service=e,t instanceof yt?this._location=t:this._location=yt.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new vr(e,t)}get root(){const e=new yt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return tg(this._location.path)}get storage(){return this._service}get parent(){const e=nv(this._location.path);if(e===null)return null;const t=new yt(this._location.bucket,e);return new vr(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw FR(e)}}function Dv(n,e,t){n._throwIfRoot("uploadBytes");const r=ig(n.storage,n._location,gc(),new tn(e,!0),t);return n.storage.makeRequestWithTokens(r,Ln).then(s=>({metadata:s,ref:n}))}function wv(n,e,t){return n._throwIfRoot("uploadBytesResumable"),new _v(n,new tn(e),t)}function Iv(n){n._throwIfRoot("getDownloadURL");const e=lv(n.storage,n._location,gc());return n.storage.makeRequestWithTokens(e,Ln).then(t=>{if(t===null)throw OR();return t})}function yv(n){n._throwIfRoot("deleteObject");const e=hv(n.storage,n._location);return n.storage.makeRequestWithTokens(e,Ln)}function Tv(n,e){const t=rv(n._location.path,e),r=new yt(n._location.bucket,t);return new vr(n.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Av(n){return/^[A-Za-z]+:\/\//.test(n)}function Rv(n,e){return new vr(n,e)}function og(n,e){if(n instanceof Dc){const t=n;if(t._bucket==null)throw bR();const r=new vr(t,t._bucket);return e!=null?og(r,e):r}else return e!==void 0?Tv(n,e):n}function vv(n,e){if(e&&Av(e)){if(n instanceof Dc)return Rv(n,e);throw nu("To use ref(service, url), the first argument must be a Storage instance.")}else return og(n,e)}function Nf(n,e){const t=e==null?void 0:e[Jp];return t==null?null:yt.makeFromBucketSpec(t,n)}function Pv(n,e,t,r={}){n.host=`${e}:${t}`;const s=Or(e);s&&au(`https://${n.host}/b`),n._isUsingEmulator=!0,n._protocol=s?"https":"http";const{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:Xf(i,n.app.options.projectId))}class Dc{constructor(e,t,r,s,i,o=!1){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=o,this._bucket=null,this._host=qp,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=_R,this._maxUploadRetryTime=DR,this._requests=new Set,s!=null?this._bucket=yt.makeFromBucketSpec(s,this._host):this._bucket=Nf(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=yt.makeFromBucketSpec(this._url,e):this._bucket=Nf(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Sf("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Sf("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(ht(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new vr(this,e)}_makeRequest(e,t,r,s,i=!0){if(this._deleted)return new LR(Qp());{const o=KR(e,this._appId,r,s,t,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,t){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,s).getPromise()}}const Ff="@firebase/storage",Lf="0.14.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ag="storage";function vb(n,e,t){return n=de(n),Dv(n,e,t)}function Pb(n,e,t){return n=de(n),wv(n,e,t)}function bb(n){return n=de(n),Iv(n)}function Sb(n){return n=de(n),yv(n)}function Ob(n,e){return n=de(n),vv(n,e)}function Nb(n=ra(),e){n=de(n);const r=er(n,ag).getImmediate({identifier:e}),s=Qf("storage");return s&&bv(r,...s),r}function bv(n,e,t,r={}){Pv(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sv(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new Dc(t,r,s,e,Nr)}function Ov(){kt(new bt(ag,Sv,"PUBLIC").setMultipleInstances(!0)),Ct(Ff,Lf,""),Ct(Ff,Lf,"esm2020")}Ov();const Bg="@firebase/installations",wc="0.6.24";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ug=1e4,cg=`w:${wc}`,lg="FIS_v2",Nv="https://firebaseinstallations.googleapis.com/v1",Fv=3600*1e3,Lv="installations",kv="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xv={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Pr=new Sr(Lv,kv,xv);function hg(n){return n instanceof Nt&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fg({projectId:n}){return`${Nv}/projects/${n}/installations`}function Cg(n){return{token:n.token,requestStatus:2,expiresIn:Mv(n.expiresIn),creationTime:Date.now()}}async function dg(n,e){const r=(await e.json()).error;return Pr.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function pg({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function Vv(n,{refreshToken:e}){const t=pg(n);return t.append("Authorization",Gv(e)),t}async function gg(n){const e=await n();return e.status>=500&&e.status<600?n():e}function Mv(n){return Number(n.replace("s","000"))}function Gv(n){return`${lg} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uv({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=fg(n),s=pg(n),i=e.getImmediate({optional:!0});if(i){const c=await i.getHeartbeatsHeader();c&&s.append("x-firebase-client",c)}const o={fid:t,authVersion:lg,appId:n.appId,sdkVersion:cg},B={method:"POST",headers:s,body:JSON.stringify(o)},u=await gg(()=>fetch(r,B));if(u.ok){const c=await u.json();return{fid:c.fid||t,registrationStatus:2,refreshToken:c.refreshToken,authToken:Cg(c.authToken)}}else throw await dg("Create Installation",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mg(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hv(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qv=/^[cdef][\w-]{21}$/,ru="";function Jv(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=jv(n);return qv.test(t)?t:ru}catch{return ru}}function jv(n){return Hv(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sa(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eg=new Map;function _g(n,e){const t=Sa(n);Dg(t,e),Kv(t,e)}function Dg(n,e){const t=Eg.get(n);if(t)for(const r of t)r(e)}function Kv(n,e){const t=zv();t&&t.postMessage({key:n,fid:e}),Qv()}let pr=null;function zv(){return!pr&&"BroadcastChannel"in self&&(pr=new BroadcastChannel("[Firebase] FID Change"),pr.onmessage=n=>{Dg(n.data.key,n.data.fid)}),pr}function Qv(){Eg.size===0&&pr&&(pr.close(),pr=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wv="firebase-installations-database",$v=1,br="firebase-installations-store";let yB=null;function Ic(){return yB||(yB=nC(Wv,$v,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(br)}}})),yB}async function Zo(n,e){const t=Sa(n),s=(await Ic()).transaction(br,"readwrite"),i=s.objectStore(br),o=await i.get(t);return await i.put(e,t),await s.done,(!o||o.fid!==e.fid)&&_g(n,e.fid),e}async function wg(n){const e=Sa(n),r=(await Ic()).transaction(br,"readwrite");await r.objectStore(br).delete(e),await r.done}async function Oa(n,e){const t=Sa(n),s=(await Ic()).transaction(br,"readwrite"),i=s.objectStore(br),o=await i.get(t),B=e(o);return B===void 0?await i.delete(t):await i.put(B,t),await s.done,B&&(!o||o.fid!==B.fid)&&_g(n,B.fid),B}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yc(n){let e;const t=await Oa(n.appConfig,r=>{const s=Yv(r),i=Xv(n,s);return e=i.registrationPromise,i.installationEntry});return t.fid===ru?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function Yv(n){const e=n||{fid:Jv(),registrationStatus:0};return Ig(e)}function Xv(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Pr.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=Zv(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:eP(n)}:{installationEntry:e}}async function Zv(n,e){try{const t=await Uv(n,e);return Zo(n.appConfig,t)}catch(t){throw hg(t)&&t.customData.serverCode===409?await wg(n.appConfig):await Zo(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function eP(n){let e=await kf(n.appConfig);for(;e.registrationStatus===1;)await mg(100),e=await kf(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await yc(n);return r||t}return e}function kf(n){return Oa(n,e=>{if(!e)throw Pr.create("installation-not-found");return Ig(e)})}function Ig(n){return tP(n)?{fid:n.fid,registrationStatus:0}:n}function tP(n){return n.registrationStatus===1&&n.registrationTime+ug<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nP({appConfig:n,heartbeatServiceProvider:e},t){const r=rP(n,t),s=Vv(n,t),i=e.getImmediate({optional:!0});if(i){const c=await i.getHeartbeatsHeader();c&&s.append("x-firebase-client",c)}const o={installation:{sdkVersion:cg,appId:n.appId}},B={method:"POST",headers:s,body:JSON.stringify(o)},u=await gg(()=>fetch(r,B));if(u.ok){const c=await u.json();return Cg(c)}else throw await dg("Generate Auth Token",u)}function rP(n,{fid:e}){return`${fg(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tc(n,e=!1){let t;const r=await Oa(n.appConfig,i=>{if(!yg(i))throw Pr.create("not-registered");const o=i.authToken;if(!e&&oP(o))return i;if(o.requestStatus===1)return t=sP(n,e),i;{if(!navigator.onLine)throw Pr.create("app-offline");const B=BP(i);return t=iP(n,B),B}});return t?await t:r.authToken}async function sP(n,e){let t=await xf(n.appConfig);for(;t.authToken.requestStatus===1;)await mg(100),t=await xf(n.appConfig);const r=t.authToken;return r.requestStatus===0?Tc(n,e):r}function xf(n){return Oa(n,e=>{if(!yg(e))throw Pr.create("not-registered");const t=e.authToken;return uP(t)?{...e,authToken:{requestStatus:0}}:e})}async function iP(n,e){try{const t=await nP(n,e),r={...e,authToken:t};return await Zo(n.appConfig,r),t}catch(t){if(hg(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await wg(n.appConfig);else{const r={...e,authToken:{requestStatus:0}};await Zo(n.appConfig,r)}throw t}}function yg(n){return n!==void 0&&n.registrationStatus===2}function oP(n){return n.requestStatus===2&&!aP(n)}function aP(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Fv}function BP(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function uP(n){return n.requestStatus===1&&n.requestTime+ug<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cP(n){const e=n,{installationEntry:t,registrationPromise:r}=await yc(e);return r?r.catch(console.error):Tc(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lP(n,e=!1){const t=n;return await hP(t),(await Tc(t,e)).token}async function hP(n){const{registrationPromise:e}=await yc(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fP(n){if(!n||!n.options)throw TB("App Configuration");if(!n.name)throw TB("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw TB(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function TB(n){return Pr.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tg="installations",CP="installations-internal",dP=n=>{const e=n.getProvider("app").getImmediate(),t=fP(e),r=er(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},pP=n=>{const e=n.getProvider("app").getImmediate(),t=er(e,Tg).getImmediate();return{getId:()=>cP(t),getToken:s=>lP(t,s)}};function gP(){kt(new bt(Tg,dP,"PUBLIC")),kt(new bt(CP,pP,"PRIVATE"))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */gP();Ct(Bg,wc);Ct(Bg,wc,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ea="analytics",mP="firebase_id",EP="origin",_P=60*1e3,DP="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Ac="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ot=new na("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wP={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},At=new Sr("analytics","Analytics",wP);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IP(n){if(!n.startsWith(Ac)){const e=At.create("invalid-gtag-resource",{gtagURL:n});return ot.warn(e.message),""}return n}function Ag(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function yP(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function TP(n,e){const t=yP("firebase-js-sdk-policy",{createScriptURL:IP}),r=document.createElement("script"),s=`${Ac}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function AP(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function RP(n,e,t,r,s,i){const o=r[s];try{if(o)await e[o];else{const u=(await Ag(t)).find(c=>c.measurementId===s);u&&await e[u.appId]}}catch(B){ot.error(B)}n("config",s,i)}async function vP(n,e,t,r,s){try{let i=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const B=await Ag(t);for(const u of o){const c=B.find(C=>C.measurementId===u),h=c&&e[c.appId];if(h)i.push(h);else{i=[];break}}}i.length===0&&(i=Object.values(e)),await Promise.all(i),n("event",r,s||{})}catch(i){ot.error(i)}}function PP(n,e,t,r){async function s(i,...o){try{if(i==="event"){const[B,u]=o;await vP(n,e,t,B,u)}else if(i==="config"){const[B,u]=o;await RP(n,e,t,r,B,u)}else if(i==="consent"){const[B,u]=o;n("consent",B,u)}else if(i==="get"){const[B,u,c]=o;n("get",B,u,c)}else if(i==="set"){const[B]=o;n("set",B)}else n(i,...o)}catch(B){ot.error(B)}}return s}function bP(n,e,t,r,s){let i=function(...o){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=PP(i,n,e,t),{gtagCore:i,wrappedGtag:window[s]}}function SP(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Ac)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OP=30,NP=1e3;class FP{constructor(e={},t=NP){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Rg=new FP;function LP(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function kP(n){var o;const{appId:e,apiKey:t}=n,r={method:"GET",headers:LP(t)},s=DP.replace("{app-id}",e),i=await fetch(s,r);if(i.status!==200&&i.status!==304){let B="";try{const u=await i.json();(o=u.error)!=null&&o.message&&(B=u.error.message)}catch{}throw At.create("config-fetch-failed",{httpStatus:i.status,responseMessage:B})}return i.json()}async function xP(n,e=Rg,t){const{appId:r,apiKey:s,measurementId:i}=n.options;if(!r)throw At.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:r};throw At.create("no-api-key")}const o=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},B=new GP;return setTimeout(async()=>{B.abort()},_P),vg({appId:r,apiKey:s,measurementId:i},o,B,e)}async function vg(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=Rg){var B;const{appId:i,measurementId:o}=n;try{await VP(r,e)}catch(u){if(o)return ot.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:i,measurementId:o};throw u}try{const u=await kP(n);return s.deleteThrottleMetadata(i),u}catch(u){const c=u;if(!MP(c)){if(s.deleteThrottleMetadata(i),o)return ot.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:i,measurementId:o};throw u}const h=Number((B=c==null?void 0:c.customData)==null?void 0:B.httpStatus)===503?Sl(t,s.intervalMillis,OP):Sl(t,s.intervalMillis),C={throttleEndTimeMillis:Date.now()+h,backoffCount:t+1};return s.setThrottleMetadata(i,C),ot.debug(`Calling attemptFetch again in ${h} millis`),vg(n,C,r,s)}}function VP(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),i=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(i),r(At.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function MP(n){if(!(n instanceof Nt)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class GP{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function UP(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const i=await e,o={...r,send_to:i};n("event",t,o)}}async function HP(n,e,t,r){if(r&&r.global){const s={};for(const i of Object.keys(t))s[`user_properties.${i}`]=t[i];return n("set",s),Promise.resolve()}else{const s=await e;n("config",s,{update:!0,user_properties:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qP(){if(iu())try{await ou()}catch(n){return ot.warn(At.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return ot.warn(At.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function JP(n,e,t,r,s,i,o){const B=xP(n);B.then(p=>{t[p.measurementId]=p.appId,n.options.measurementId&&p.measurementId!==n.options.measurementId&&ot.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${p.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(p=>ot.error(p)),e.push(B);const u=qP().then(p=>{if(p)return r.getId()}),[c,h]=await Promise.all([B,u]);SP(i)||TP(i,c.measurementId),s("js",new Date);const C=(o==null?void 0:o.config)??{};return C[EP]="firebase",C.update=!0,h!=null&&(C[mP]=h),s("config",c.measurementId,C),c.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jP{constructor(e){this.app=e}_delete(){return delete es[this.app.options.appId],Promise.resolve()}}let es={},Vf=[];const Mf={};let AB="dataLayer",KP="gtag",Gf,Rc,Uf=!1;function zP(){const n=[];if(su()&&n.push("This is a browser extension environment."),Zf()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=At.create("invalid-analytics-context",{errorInfo:e});ot.warn(t.message)}}function QP(n,e,t){zP();const r=n.options.appId;if(!r)throw At.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)ot.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw At.create("no-api-key");if(es[r]!=null)throw At.create("already-exists",{id:r});if(!Uf){AP(AB);const{wrappedGtag:i,gtagCore:o}=bP(es,Vf,Mf,AB,KP);Rc=i,Gf=o,Uf=!0}return es[r]=JP(n,Vf,Mf,e,Gf,AB,t),new jP(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fb(n=ra()){n=de(n);const e=er(n,ea);return e.isInitialized()?e.getImmediate():WP(n)}function WP(n,e={}){const t=er(n,ea);if(t.isInitialized()){const s=t.getImmediate();if(Hn(e,t.getOptions()))return s;throw At.create("already-initialized")}return t.initialize({options:e})}async function Lb(){if(su()||!Zf()||!iu())return!1;try{return await ou()}catch{return!1}}function $P(n,e,t){n=de(n),HP(Rc,es[n.app.options.appId],e,t).catch(r=>ot.error(r))}function YP(n,e,t,r){n=de(n),UP(Rc,es[n.app.options.appId],e,t,r).catch(s=>ot.error(s))}const Hf="@firebase/analytics",qf="0.10.24";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XP(){kt(new bt(ea,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return QP(r,s,t)},"PUBLIC")),kt(new bt("analytics-internal",n,"PRIVATE")),Ct(Hf,qf),Ct(Hf,qf,"esm2020");function n(e){try{const t=e.getProvider(ea).getImmediate();return{logEvent:(r,s,i)=>YP(t,r,s,i),setUserProperties:(r,s)=>$P(t,r,s)}}catch(t){throw At.create("interop-component-reg-failed",{reason:t})}}}XP();export{sb as A,Eb as B,de as C,Qf as D,ra as E,Or as F,Sn as G,au as H,Nt as I,kt as J,bt as K,Ct as L,ht as M,Rb as N,fb as O,Db as P,eb as Q,Pb as R,rb as S,Te as T,er as _,pb as a,Nb as b,Lb as c,Fb as d,cb as e,Cy as f,ab as g,Tb as h,bE as i,yb as j,vb as k,bb as l,Sb as m,_b as n,Ab as o,hb as p,gb as q,Ob as r,wb as s,lb as t,Ib as u,ob as v,tb as w,nb as x,ib as y,mb as z};
