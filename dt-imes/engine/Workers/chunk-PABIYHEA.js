/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.134.1
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
import{f as C}from"./chunk-S2E5UWT4.js";import{a as n,e as b}from"./chunk-HMXGNDLA.js";import{a as w}from"./chunk-V7XA5C77.js";var j={},q=new n,L=new n,Q=new C,G=new b;function W(e,t,r,a,o,i,l,s,y,c){let m=e+t;n.multiplyByScalar(a,Math.cos(m),q),n.multiplyByScalar(r,Math.sin(m),L),n.add(q,L,q);let u=Math.cos(e);u*=u;let w=Math.sin(e);w*=w;let x=i/Math.sqrt(l*u+o*w)/s;return C.fromAxisAngle(q,x,Q),b.fromQuaternion(Q,G),b.multiplyByVector(G,y,c),n.normalize(c,c),n.multiplyByScalar(c,s,c),c}var U=new n,Z=new n,N=new n,v=new n;j.raisePositionsToHeight=function(e,t,r){let a=t.ellipsoid,o=t.height,i=t.extrudedHeight,l=r?e.length/3*2:e.length/3,s=new Float64Array(3*l),y=e.length,c=r?y:0;for(let t=0;t<y;t+=3){let l=t+1,y=t+2,m=n.fromArray(e,t,U);a.scaleToGeodeticSurface(m,m);let u=n.clone(m,Z),w=a.geodeticSurfaceNormal(m,v),x=n.multiplyByScalar(w,o,N);n.add(m,x,m),r&&(n.multiplyByScalar(w,i,x),n.add(u,x,u),s[t+c]=u.x,s[l+c]=u.y,s[y+c]=u.z),s[t]=m.x,s[l]=m.y,s[y]=m.z}return s};var D=new n,J=new n,K=new n;j.computeEllipsePositions=function(e,t,r){let a=e.semiMinorAxis,o=e.semiMajorAxis,i=e.rotation,l=e.center,s=8*e.granularity,y=a*a,c=o*o,m=o*a,u=n.magnitude(l),x=n.normalize(l,D),h=n.cross(n.UNIT_Z,l,J);h=n.normalize(h,h);let f=n.cross(x,h,K),z=1+Math.ceil(w.PI_OVER_TWO/s),_=w.PI_OVER_TWO/(z-1),p=w.PI_OVER_TWO-z*_;p<0&&(z-=Math.ceil(Math.abs(p)/_));let O,d,P,M,T,I=t?new Array(3*(z*(z+2)*2)):void 0,g=0,A=U,E=Z,V=4*z*3,j=V-1,v=0,R=r?new Array(V):void 0;for(p=w.PI_OVER_TWO,A=W(p,i,f,h,y,m,c,u,x,A),t&&(I[g++]=A.x,I[g++]=A.y,I[g++]=A.z),r&&(R[j--]=A.z,R[j--]=A.y,R[j--]=A.x),p=w.PI_OVER_TWO-_,O=1;O<z+1;++O){if(A=W(p,i,f,h,y,m,c,u,x,A),E=W(Math.PI-p,i,f,h,y,m,c,u,x,E),t){for(I[g++]=A.x,I[g++]=A.y,I[g++]=A.z,P=2*O+2,d=1;d<P-1;++d)M=d/(P-1),T=n.lerp(A,E,M,N),I[g++]=T.x,I[g++]=T.y,I[g++]=T.z;I[g++]=E.x,I[g++]=E.y,I[g++]=E.z}r&&(R[j--]=A.z,R[j--]=A.y,R[j--]=A.x,R[v++]=E.x,R[v++]=E.y,R[v++]=E.z),p=w.PI_OVER_TWO-(O+1)*_}for(O=z;O>1;--O){if(p=w.PI_OVER_TWO-(O-1)*_,A=W(-p,i,f,h,y,m,c,u,x,A),E=W(p+Math.PI,i,f,h,y,m,c,u,x,E),t){for(I[g++]=A.x,I[g++]=A.y,I[g++]=A.z,P=2*(O-1)+2,d=1;d<P-1;++d)M=d/(P-1),T=n.lerp(A,E,M,N),I[g++]=T.x,I[g++]=T.y,I[g++]=T.z;I[g++]=E.x,I[g++]=E.y,I[g++]=E.z}r&&(R[j--]=A.z,R[j--]=A.y,R[j--]=A.x,R[v++]=E.x,R[v++]=E.y,R[v++]=E.z)}p=w.PI_OVER_TWO,A=W(-p,i,f,h,y,m,c,u,x,A);let S={};return t&&(I[g++]=A.x,I[g++]=A.y,I[g++]=A.z,S.positions=I,S.numPts=z),r&&(R[j--]=A.z,R[j--]=A.y,R[j--]=A.x,S.outerPositions=R),S};var tt=j;export{tt as a};