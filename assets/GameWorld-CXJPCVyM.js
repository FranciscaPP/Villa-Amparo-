import{r as c,u as M,b as B,j as e}from"./index-C6Viod6b.js";import{R as D,S as G,B as I,U as z,g as S,b as N,a as W,_ as O,C as Z,u as C,h as V,e as $}from"./RobloxCharacter-CcfSTuSL.js";const J=parseInt(D.replace(/\D+/g,""));var U=Object.defineProperty,K=(t,i,o)=>i in t?U(t,i,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[i]=o,k=(t,i,o)=>(K(t,typeof i!="symbol"?i+"":i,o),o);const X=(()=>{const t={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new S},up:{value:new S(0,1,0)}},vertexShader:`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      uniform vec3 up;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
        zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
        return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
        float c = ( 0.2 * T ) * 10E-18;
        return 0.434 * c * MieConst;
      }

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position.z = gl_Position.w; // set z to camera.far

        vSunDirection = normalize( sunPosition );

        vSunE = sunIntensity( dot( vSunDirection, up ) );

        vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

        float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
        vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
        vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,fragmentShader:`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      uniform float mieDirectionalG;
      uniform vec3 up;

      const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
        return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
        float g2 = pow( g, 2.0 );
        float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
        return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      void main() {

        vec3 direction = normalize( vWorldPosition - cameraPos );

      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
        float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
        float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
        float sR = rayleighZenithLength * inverse;
        float sM = mieZenithLength * inverse;

      // combined extinction factor
        vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
        float cosTheta = dot( direction, vSunDirection );

        float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
        vec3 betaRTheta = vBetaR * rPhase;

        float mPhase = hgPhase( cosTheta, mieDirectionalG );
        vec3 betaMTheta = vBetaM * mPhase;

        vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
        Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
        float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
        float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
        vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
        vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
        float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
        L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

        vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

        vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

        gl_FragColor = vec4( retColor, 1.0 );

      #include <tonemapping_fragment>
      #include <${J>=154?"colorspace_fragment":"encodings_fragment"}>

      }
    `},i=new G({name:"SkyShader",fragmentShader:t.fragmentShader,vertexShader:t.vertexShader,uniforms:z.clone(t.uniforms),side:I,depthWrite:!1});class o extends N{constructor(){super(new W(1,1,1),i)}}return k(o,"SkyShader",t),k(o,"material",i),o})();function H(t,i,o=new S){const r=Math.PI*(t-.5),l=2*Math.PI*(i-.5);return o.x=Math.cos(l),o.y=Math.sin(r),o.z=Math.sin(l),o}const q=c.forwardRef(({inclination:t=.6,azimuth:i=.1,distance:o=1e3,mieCoefficient:r=.005,mieDirectionalG:l=.8,rayleigh:m=.5,turbidity:s=10,sunPosition:h=H(t,i),...u},a)=>{const g=c.useMemo(()=>new S().setScalar(o),[o]),[v]=c.useState(()=>new X);return c.createElement("primitive",O({object:v,ref:a,"material-uniforms-mieCoefficient-value":r,"material-uniforms-mieDirectionalG-value":l,"material-uniforms-rayleigh-value":m,"material-uniforms-sunPosition-value":h,"material-uniforms-turbidity-value":s,scale:g},u))}),P=[{id:"letterforest",name:"Bosque de Letras",color:"#27AE60",lightColor:"#A8E6CF",pos:[-30,0,-30],emoji:"🌳",description:"¡Aprende las letras!"},{id:"numbers",name:"Playa de Números",color:"#F39C12",lightColor:"#FFE4A0",pos:[32,0,-28],emoji:"🔢",description:"¡Suma y resta!"},{id:"mountain",name:"Montaña Mágica",color:"#9B59B6",lightColor:"#D7BDE2",pos:[35,0,28],emoji:"⛰️",description:"¡Rompecabezas!"},{id:"village",name:"Aldea Musical",color:"#E74C3C",lightColor:"#FADBD8",pos:[-28,0,32],emoji:"🎵",description:"¡Música y ritmo!"},{id:"garden",name:"Jardín Mágico",color:"#FF69B4",lightColor:"#FFD1E8",pos:[0,0,-45],emoji:"🌺",description:"¡Palabras y lectura!"},{id:"river",name:"Río del Tiempo",color:"#3498DB",lightColor:"#AED6F1",pos:[45,0,0],emoji:"🌊",description:"¡Comprensión!"},{id:"castle",name:"Castillo del Arte",color:"#E67E22",lightColor:"#FAD7A0",pos:[0,0,45],emoji:"🏰",description:"¡Colores y arte!"},{id:"home",name:"Mi Casa",color:"#16A085",lightColor:"#A2D9CE",pos:[-45,0,0],emoji:"🏠",description:"¡Tu hogar!"}];function Y(){return e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.1,0],receiveShadow:!0,children:[e.jsx("planeGeometry",{args:[200,200]}),e.jsx("meshLambertMaterial",{color:"#4CAF50"})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.05,0],children:[e.jsx("planeGeometry",{args:[6,200]}),e.jsx("meshLambertMaterial",{color:"#D4A96A"})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.05,0],children:[e.jsx("planeGeometry",{args:[200,6]}),e.jsx("meshLambertMaterial",{color:"#D4A96A"})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.04,0],children:[e.jsx("circleGeometry",{args:[10,32]}),e.jsx("meshLambertMaterial",{color:"#C8A96A"})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.08,0],children:[e.jsx("ringGeometry",{args:[98,100,64]}),e.jsx("meshLambertMaterial",{color:"#2E7D32"})]})]})}function Q({position:t}){return e.jsxs("group",{position:t,children:[e.jsxs("mesh",{position:[0,.8,0],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.22,.3,1.6,6]}),e.jsx("meshLambertMaterial",{color:"#6D4C41"})]}),e.jsxs("mesh",{position:[0,2.4,0],castShadow:!0,children:[e.jsx("dodecahedronGeometry",{args:[1.4,0]}),e.jsx("meshLambertMaterial",{color:"#388E3C"})]}),e.jsxs("mesh",{position:[0,3.4,0],castShadow:!0,children:[e.jsx("dodecahedronGeometry",{args:[.9,0]}),e.jsx("meshLambertMaterial",{color:"#43A047"})]})]})}function ee({zone:t}){const[i,o]=c.useState(!1),r=c.useRef();return C(l=>{r.current&&(r.current.position.y=Math.sin(l.clock.getElapsedTime()*1.5+t.pos[0])*.08)}),e.jsxs("group",{position:[t.pos[0],0,t.pos[2]],children:[e.jsxs("mesh",{position:[0,.5,0],castShadow:!0,receiveShadow:!0,children:[e.jsx("boxGeometry",{args:[14,1.2,14]}),e.jsx("meshLambertMaterial",{color:t.color})]}),e.jsxs("mesh",{position:[0,1.15,0],children:[e.jsx("boxGeometry",{args:[14.4,.3,14.4]}),e.jsx("meshLambertMaterial",{color:t.lightColor})]}),e.jsxs("mesh",{position:[0,2.2,0],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.15,.15,1.8,6]}),e.jsx("meshLambertMaterial",{color:"#8D6E63"})]}),e.jsxs("mesh",{ref:r,position:[0,3.4,0],children:[e.jsx("boxGeometry",{args:[4.5,1.4,.2]}),e.jsx("meshLambertMaterial",{color:t.lightColor})]}),[[-5.5,0,-5.5],[5.5,0,-5.5],[-5.5,0,5.5],[5.5,0,5.5]].map(([l,m,s],h)=>e.jsxs("mesh",{position:[l,1.5,s],castShadow:!0,children:[e.jsx("boxGeometry",{args:[.8,3.2,.8]}),e.jsx("meshLambertMaterial",{color:t.color})]},h)),e.jsx(te,{emoji:t.emoji,position:[0,5.2,0]})]})}function te({emoji:t,position:i}){const o=c.useRef();return C(r=>{o.current&&(o.current.position.y=i[1]+Math.sin(r.clock.getElapsedTime()*2)*.2,o.current.rotation.y=r.clock.getElapsedTime()*.5)}),e.jsx("group",{ref:o,position:i,children:e.jsxs("mesh",{children:[e.jsx("boxGeometry",{args:[1.4,1.4,1.4]}),e.jsx("meshLambertMaterial",{color:"rgba(255,255,200,0.9)",transparent:!0,opacity:.85})]})})}function oe(){const t=c.useRef();return C(i=>{t.current&&(t.current.rotation.y=i.clock.getElapsedTime()*.3)}),e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,.3,0],children:[e.jsx("cylinderGeometry",{args:[3,3.5,.6,16]}),e.jsx("meshLambertMaterial",{color:"#B0BEC5"})]}),e.jsxs("mesh",{position:[0,1.2,0],children:[e.jsx("cylinderGeometry",{args:[.4,.4,1.8,8]}),e.jsx("meshLambertMaterial",{color:"#90A4AE"})]}),e.jsxs("group",{ref:t,position:[0,2.5,0],children:[e.jsxs("mesh",{children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshLambertMaterial",{color:"#FFD700"})]}),e.jsxs("mesh",{rotation:[0,Math.PI/4,0],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshLambertMaterial",{color:"#FFB300"})]})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.02,0],children:[e.jsx("circleGeometry",{args:[2.8,32]}),e.jsx("meshLambertMaterial",{color:"#29B6F6",transparent:!0,opacity:.7})]})]})}function re(){const t=[],i=(()=>{let o=42;return()=>(o=o*1664525+1013904223&4294967295,(o>>>0)/4294967295)})();for(let o=0;o<80;o++){const r=i()*Math.PI*2,l=12+i()*82,m=Math.cos(r)*l,s=Math.sin(r)*l,h=P.some(a=>Math.hypot(m-a.pos[0],s-a.pos[2])<12),u=Math.abs(m)<5||Math.abs(s)<5;!h&&!u&&l<95&&t.push([m,0,s])}return e.jsx(e.Fragment,{children:t.map((o,r)=>e.jsx(Q,{position:o},r))})}function ie({playerRef:t,onZoneEnter:i}){const o=c.useRef({}),r=c.useRef({x:0,z:0}),l=c.useRef(!1),m=M(h=>h.player),{camera:s}=V();return c.useEffect(()=>{const h=a=>{o.current[a.key]=!0},u=a=>{o.current[a.key]=!1};return window.addEventListener("keydown",h),window.addEventListener("keyup",u),()=>{window.removeEventListener("keydown",h),window.removeEventListener("keyup",u)}},[]),c.useEffect(()=>(window.__playerMove=(h,u)=>{r.current.x+=h*.18,r.current.z+=u*.18},()=>{delete window.__playerMove}),[]),C((h,u)=>{const a=o.current,g=7*u;let v=0,y=0;(a.w||a.W||a.ArrowUp)&&(y-=g),(a.s||a.S||a.ArrowDown)&&(y+=g),(a.a||a.A||a.ArrowLeft)&&(v-=g),(a.d||a.D||a.ArrowRight)&&(v+=g),r.current.x=r.current.x*.82+v,r.current.z=r.current.z*.82+y;const j=Math.abs(r.current.x)>.004||Math.abs(r.current.z)>.004;if(l.current=j,t.current){const E=t.current.position.x+r.current.x,w=t.current.position.z+r.current.z,b=94;if(t.current.position.x=Math.max(-b,Math.min(b,E)),t.current.position.z=Math.max(-b,Math.min(b,w)),j){const x=Math.atan2(r.current.x,r.current.z)+Math.PI;t.current.rotation.y+=(x-t.current.rotation.y)*.18}const A=new S(t.current.position.x,t.current.position.y+10,t.current.position.z+14);s.position.lerp(A,.08),s.lookAt(t.current.position.x,t.current.position.y+1.5,t.current.position.z);for(const x of P)if(Math.hypot(t.current.position.x-x.pos[0],t.current.position.z-x.pos[2])<8){i(x);return}i(null)}}),e.jsx("group",{ref:t,position:[0,.1,0],children:e.jsx($,{skinTone:m.skinTone||"#FFDABB",hairColor:m.hairColor||"#4A2800",hairStyle:m.hairStyle||"short",clothesColor:m.clothesColor||"#4A90D9",hatStyle:m.hatStyle||"none",isMoving:!0})})}function ne({playerRef:t,onZoneEnter:i}){return e.jsxs(e.Fragment,{children:[e.jsx(q,{sunPosition:[100,50,100],turbidity:6,rayleigh:.5}),e.jsx("ambientLight",{intensity:.9,color:"#fff8f0"}),e.jsx("directionalLight",{position:[30,50,20],intensity:1.4,castShadow:!0,"shadow-mapSize":[2048,2048],"shadow-camera-far":200,"shadow-camera-left":-100,"shadow-camera-right":100,"shadow-camera-top":100,"shadow-camera-bottom":-100}),e.jsx("hemisphereLight",{skyColor:"#87CEEB",groundColor:"#4CAF50",intensity:.6}),e.jsxs(c.Suspense,{fallback:null,children:[e.jsx(Y,{}),e.jsx(re,{}),P.map(o=>e.jsx(ee,{zone:o},o.id)),e.jsx(oe,{}),e.jsx(ie,{playerRef:t,onZoneEnter:i})]})]})}function ce(){const t=M(n=>n.setScreen),i=M(n=>n.player),o=M(n=>n.coins),r=M(n=>n.level),{speak:l}=B(),m=c.useRef(),[s,h]=c.useState(null),[u,a]=c.useState(null),g=n=>{(n==null?void 0:n.id)!==(u==null?void 0:u.id)?(h(n),a(n),n&&l(`${n.name}. ${n.description}`)):!n&&u&&(h(null),a(null))},v=()=>{if(s){if(s.id==="home"){t("home");return}if(s.id==="letterforest"){t("letterforest");return}l(`¡Entrando a ${s.name}!`)}},y=c.useRef(null),[j,E]=c.useState(!1),w=c.useRef(null),b=n=>{var d;const p=((d=n.changedTouches)==null?void 0:d[0])||n;w.current=p.identifier??0,E(!0)},A=n=>{if(!j)return;const p=Array.from(n.touches||[]).find(L=>L.identifier===w.current);if(!p||!y.current)return;const d=y.current.getBoundingClientRect(),f=d.left+d.width/2,R=d.top+d.height/2,T=(p.clientX-f)/(d.width/2),_=(p.clientY-R)/(d.height/2);window.__playerMove&&window.__playerMove(T*.4,_*.4)},x=()=>{E(!1),w.current=null};return e.jsxs("div",{style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",background:"#87CEEB"},children:[e.jsx(Z,{shadows:!0,camera:{position:[0,10,14],fov:60,near:.1,far:500},style:{width:"100%",height:"100%"},gl:{antialias:!0},children:e.jsx(ne,{playerRef:m,onZoneEnter:g})}),e.jsxs("div",{style:{position:"absolute",top:70,right:16,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",borderRadius:18,padding:"10px 16px",display:"flex",flexDirection:"column",gap:6,border:"2px solid rgba(255,255,255,0.15)"},children:[e.jsxs("div",{style:{color:"#FFD700",fontSize:18,fontWeight:900,fontFamily:"Nunito, sans-serif"},children:["🪙 ",o]}),e.jsxs("div",{style:{color:"#A8E6CF",fontSize:14,fontWeight:800,fontFamily:"Nunito, sans-serif"},children:["⭐ Nivel ",r]}),e.jsx("div",{style:{color:"rgba(255,255,255,0.7)",fontSize:12,fontFamily:"Nunito, sans-serif"},children:i.name||"Jugador"})]}),e.jsx("div",{style:{position:"absolute",bottom:130,right:16,background:"rgba(0,0,0,0.45)",borderRadius:12,padding:"8px 12px",color:"rgba(255,255,255,0.6)",fontSize:12,fontFamily:"Nunito, sans-serif",fontWeight:700},children:"WASD / ↑↓←→ para moverse"}),s&&e.jsxs("div",{style:{position:"absolute",bottom:130,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)",borderRadius:24,padding:"16px 28px",textAlign:"center",border:`3px solid ${s.color}`,boxShadow:`0 0 30px ${s.color}88`,animation:"slide-up 0.3s ease-out",maxWidth:"80vw"},children:[e.jsx("div",{style:{fontSize:36,marginBottom:4},children:s.emoji}),e.jsx("div",{style:{color:"white",fontSize:20,fontWeight:900,fontFamily:"Nunito, sans-serif",marginBottom:4},children:s.name}),e.jsx("div",{style:{color:"rgba(255,255,255,0.7)",fontSize:14,fontFamily:"Nunito, sans-serif",marginBottom:12},children:s.description}),e.jsxs("button",{onClick:v,style:{background:s.color,border:"none",borderRadius:14,padding:"11px 28px",color:"white",fontSize:17,fontWeight:900,fontFamily:"Nunito, sans-serif",cursor:"pointer",boxShadow:`0 4px 16px ${s.color}88`,animation:"pulse-glow 1.5s ease-in-out infinite"},children:["¡Entrar! ",s.emoji]})]}),e.jsx("div",{ref:y,onTouchStart:b,onTouchMove:A,onTouchEnd:x,onTouchCancel:x,style:{position:"absolute",bottom:24,left:24,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"3px solid rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.3)",cursor:"pointer",touchAction:"none"},children:e.jsx("div",{style:{width:46,height:46,borderRadius:"50%",background:j?"rgba(255,215,0,0.7)":"rgba(255,255,255,0.3)",border:"2px solid rgba(255,255,255,0.5)",transition:"background 0.1s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"white"},children:"🕹️"})}),e.jsx("div",{style:{position:"absolute",bottom:24,left:160,display:"flex",flexDirection:"column",alignItems:"center",gap:4},children:[["↑",0,-1],["↓",0,1]].map(([n,p,d])=>e.jsx("button",{onTouchStart:()=>{var f;return(f=window.__playerMove)==null?void 0:f.call(window,p*.5,d*.5)},onClick:()=>{var f;return(f=window.__playerMove)==null?void 0:f.call(window,p*.5,d*.5)},style:F,children:n},n))}),e.jsx("div",{style:{position:"absolute",bottom:58,left:160,display:"flex",gap:4},children:[["←",-1,0],["→",1,0]].map(([n,p,d])=>e.jsx("button",{onTouchStart:()=>{var f;return(f=window.__playerMove)==null?void 0:f.call(window,p*.5,d*.5)},onClick:()=>{var f;return(f=window.__playerMove)==null?void 0:f.call(window,p*.5,d*.5)},style:F,children:n},n))})]})}const F={width:44,height:44,borderRadius:10,border:"2px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.15)",color:"white",fontSize:20,fontWeight:900,cursor:"pointer",touchAction:"manipulation",display:"flex",alignItems:"center",justifyContent:"center"};export{ce as GameWorld};
