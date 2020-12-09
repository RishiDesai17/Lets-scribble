(this["webpackJsonpreact-client"]=this["webpackJsonpreact-client"]||[]).push([[0],{106:function(e,t,n){},132:function(e,t){},136:function(e,t,n){},141:function(e,t,n){},143:function(e,t,n){},144:function(e,t,n){},145:function(e,t,n){},146:function(e,t,n){},147:function(e,t,n){},148:function(e,t,n){},149:function(e,t,n){},150:function(e,t,n){},151:function(e,t,n){},152:function(e,t,n){},153:function(e,t,n){},154:function(e,t,n){},155:function(e,t,n){},156:function(e,t,n){},157:function(e,t,n){"use strict";n.r(t);var r=n(2),c=n(0),o=n.n(c),a=n(9),s=n.n(a),i=(n(106),n(38)),u=n(12),l=n(23),d=n(20),j=n(40),b=n(32),m=n.n(b),f={isHost:!1,avatar:0,turn:!1,members:[]},h={socket:m.a.Socket,room:"",name:""},O=Object(j.a)((function(e,t){return Object(d.a)(Object(d.a)({},f),{},{setSocket:function(e){return h.socket=e},setRoom:function(e){return h.room=e},setName:function(e){return h.name=e},setMembers:function(t){return e({members:t})},addMember:function(t){return e((function(e){return{members:[].concat(Object(l.a)(e.members),[t])}}))},removeMember:function(t){return e((function(e){var n=e.members;return console.log(t,n),{members:n=n.filter((function(e){return e.socketID!==t}))}}))},setIsHost:function(t){return e({isHost:t})},setAvatar:function(t){return e({avatar:t})},setTurn:function(t){return e({turn:t})},reset:function(){e(Object(d.a)(Object(d.a)({},f),{},{avatar:t().avatar})),h.socket=m.a.Socket,h.room=""},getSocket:function(){return h.socket},getRoom:function(){return h.room},getName:function(){return h.name},getAvatar:function(){return t().avatar},getIsHost:function(){return t().isHost}})})),v=n(192),g=n(35),x=(n(136),function(){var e=O((function(e){return{selectedAvatar:e.avatar,setAvatar:e.setAvatar}})),t=e.selectedAvatar,n=e.setAvatar;return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h1",{id:"avatarsTitle",children:"Choose an Avatar !"}),Object(r.jsx)(v.a,{container:!0,justify:"center",children:g.a.map((function(e,c){var o=t===c;return Object(r.jsx)(v.a,{item:!0,md:2,sm:4,xs:6,onClick:function(){return n(c)},children:Object(r.jsxs)("div",{className:"avatarsContainer",style:{border:o?"2px solid black":""},children:[Object(r.jsx)("div",{style:{paddingBottom:o?0:"1.75em"},children:Object(r.jsx)("img",{src:"/images/".concat(e),className:"avatar"})}),o&&Object(r.jsx)("svg",{width:"1.5em",height:"1.5em",viewBox:"0 0 16 16",fill:"green",xmlns:"http://www.w3.org/2000/svg",children:Object(r.jsx)("path",{"fill-rule":"evenodd",d:"M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"})})]})})}))})]})}),p=n(196),C=n(197),y=n(208),w=n(201),k=n(61),S=(n(140),function(e){k.b.info(e,{position:"top-center",autoClose:2e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0})}),N=function(e){k.b.error(e,{position:"top-center",autoClose:2e3,closeOnClick:!0,hideProgressBar:!0,pauseOnHover:!0,draggable:!0})},R=function(e){return Object(r.jsx)(k.a,{position:"top-center",autoClose:5e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!1,draggable:!0,pauseOnHover:!0})},L=(n(141),function(e){var t=O(Object(c.useCallback)((function(e){return{setSocket:e.setSocket,setRoom:e.setRoom,setName:e.setName,setIsHost:e.setIsHost,setMembers:e.setMembers,getName:e.getName,getAvatar:e.getAvatar}}),[])),n=t.setSocket,o=t.setRoom,a=t.setName,s=t.setIsHost,i=t.setMembers,l=t.getName,d=t.getAvatar,j=Object(c.useRef)(""),b=Object(u.e)(),f=function(e){return""===e?(N("Please enter a name"),!1):!(e.length<3||e.length>15)||(N("Name should be 3-15 characters long"),!1)};return Object(r.jsxs)("div",{id:"home-background",children:[Object(r.jsx)("h1",{id:"title",children:"LETS SCRIBBLE"}),Object(r.jsx)("div",{id:"card-container",children:Object(r.jsx)(p.a,{id:"main-card",children:Object(r.jsx)(C.a,{children:Object(r.jsxs)("form",{noValidate:!0,autoComplete:"off",children:[Object(r.jsx)("div",{id:"name-input-container",children:Object(r.jsx)(y.a,{id:"filled-basic",label:"Enter Name",variant:"filled",defaultValue:l(),onChange:function(e){return a(e.target.value.trim())}})}),Object(r.jsx)(x,{}),Object(r.jsx)("div",{id:"buttons-container",children:Object(r.jsxs)(v.a,{container:!0,children:[Object(r.jsx)(v.a,{item:!0,md:5,sm:12,xs:12,children:Object(r.jsx)(w.a,{id:"create-room-button",variant:"contained",color:"primary",onClick:function(){var e=l(),t=d();if(f(e)){var r=m()("/");n(r),r.on("roomID",(function(n){o(n),s(!0),i([{socketID:r.id,memberDetails:{name:e,avatar:t+1},score:0}]),b.replace("/lobby/".concat(n))})),r.emit("create room",{host_name:e,avatar:t+1})}},children:"Create Private Room"})}),Object(r.jsx)(v.a,{item:!0,md:2,sm:12,xs:12,id:"or",children:"OR"}),Object(r.jsx)(v.a,{item:!0,md:5,sm:12,xs:12,justify:"center",children:Object(r.jsxs)("div",{style:{marginTop:-3},children:[Object(r.jsx)(y.a,{label:"Enter Room URL",variant:"outlined",style:{margin:"0 8px 10px 0"},inputProps:{style:{height:7}},InputLabelProps:{style:{top:-6}},onChange:function(e){j.current=e.target.value}}),Object(r.jsx)(w.a,{variant:"contained",onClick:function(){var e=l();if(f(e)){var t=window.location,n=t.protocol,r=t.hostname,c=t.port;if(""!==window.location.port&&(r+=":"+c),new RegExp("^".concat(n,"//").concat(r,"/lobby/([a-z0-9-])/?")).test(j.current)){var o=j.current.split("/")[4];b.replace("/lobby/".concat(o))}else N("Enter valid room URL")}},children:"Join"})]})})]})})]})})})})]})}),T=n(7),E={myTurn:!1,selectedWord:"",roundLength:30,timeRemaining:30},M=Object(j.a)((function(e,t){return Object(d.a)(Object(d.a)({},E),{},{setMyTurn:function(t){return e({myTurn:t})},setSelectedWord:function(t){return e({selectedWord:t})},setRoundLength:function(t){return e({roundLength:t,timeRemaining:t})},startCountdown:function(n){if(n){var r=t().roundLength-Math.floor(((new Date).getTime()-Date.parse(n))/1e3);e({timeRemaining:r})}else e({timeRemaining:t().roundLength});var c=setInterval((function(){var n=t().timeRemaining;0===n?clearInterval(c):e({timeRemaining:n-1})}),1e3)},getMyTurn:function(){return t().myTurn},resetGameStore:function(){return e(Object(d.a)({},E))}})})),I=n(200),D=n(210),H=n(205),W=n(211),A=(n(143),function(e){var t=e.numMembers,n=e.startGame,o=M(Object(c.useCallback)((function(e){return{roundLength:e.roundLength,setRoundLength:e.setRoundLength}}),[])),a=o.roundLength,s=o.setRoundLength,i=Object(c.useState)(1),u=Object(T.a)(i,2),l=u[0],d=u[1];return Object(r.jsx)("div",{id:"settingsFormContainer",children:Object(r.jsxs)(p.a,{children:[Object(r.jsx)("h2",{id:"settingsTitle",children:"Settings"}),Object(r.jsxs)(C.a,{children:[Object(r.jsx)("div",{className:"fieldsContainer",children:Object(r.jsxs)(I.a,{variant:"outlined",className:"inputs",children:[Object(r.jsx)(D.a,{id:"demo-simple-select-outlined-label",children:"Round length"}),Object(r.jsx)(H.a,{labelId:"demo-simple-select-outlined-label",id:"demo-simple-select-outlined",value:a,onChange:function(e){return s(e.target.value)},label:"Round length",children:[30,60,90,120,150].map((function(e){return Object(r.jsxs)(W.a,{value:e,children:[e," seconds"]})}))})]})}),Object(r.jsx)("div",{className:"fieldsContainer",children:Object(r.jsxs)(I.a,{variant:"outlined",className:"inputs",children:[Object(r.jsx)(D.a,{id:"demo-simple-select-outlined-label",children:"Number of rounds"}),Object(r.jsx)(H.a,{labelId:"demo-simple-select-outlined-label",id:"demo-simple-select-outlined",value:l,onChange:function(e){return d(e.target.value)},label:"Number of rounds",children:[1,2,3,4,5].map((function(e){return Object(r.jsx)(W.a,{value:e,children:e})}))})]})}),Object(r.jsx)("div",{className:"fieldsContainer",children:Object(r.jsx)(w.a,{variant:"contained",color:"primary",onClick:function(){return n({numRounds:l,round_length:a})},disabled:t<2,children:"Start game"})})]})]})})}),P=o.a.memo(A),B=(n(144),function(e){var t=e.members,n=e.isHost,c=e.socketID;return Object(r.jsx)("div",{style:{width:n?"85%":"78%"},children:Object(r.jsx)(p.a,{children:Object(r.jsx)(C.a,{children:Object(r.jsx)(v.a,{container:!0,id:"membersContainer",children:t.map((function(e){return Object(r.jsxs)(v.a,{item:!0,md:n?3:2,sm:4,xs:6,children:[Object(r.jsx)("img",{src:"/images/avatar_".concat(e.memberDetails.avatar,".jpg"),className:"lobbyAvatars"}),Object(r.jsx)("p",{className:"memberName",style:{fontWeight:c===e.socketID?"bold":"normal"},children:e.memberDetails.name})]})}))})})})})}),_=(n(145),function(e){var t=e.modalHandler,n=O(Object(c.useCallback)((function(e){return{getName:e.getName,setName:e.setName}}),[])),o=n.getName,a=n.setName,s=Object(c.useState)(!1),i=Object(T.a)(s,2),u=i[0],l=i[1];return Object(r.jsx)(r.Fragment,{children:Object(r.jsxs)("form",{noValidate:!0,autoComplete:"off",id:"modalContainer",onSubmit:function(e){return function(e){e.preventDefault(),l(!0);var n=o();return""===n?(N("Please enter a name"),void l(!1)):n.length<3||n.length>15?(N("Name should be 3-15 characters long"),void l(!1)):void t()}(e)},children:[Object(r.jsx)(y.a,{id:"standard-basic",label:"Enter name",defaultValue:o(),onChange:function(e){return a(e.target.value.trim())}}),Object(r.jsx)("div",{id:"avatars",children:Object(r.jsx)(x,{})}),Object(r.jsx)(w.a,{type:"submit",id:"submit",disabled:u,children:"Submit"})]})})}),z=n(206),F=n(203),G=n(159),V=n(202),J=n(207),Y=(n(146),Object(V.a)((function(e){return Object(J.a)({modal:{display:"flex",alignItems:"center",justifyContent:"center"},paper:{backgroundColor:"#f5f5f5",border:"2px solid #000",boxShadow:e.shadows[5],padding:e.spacing(2,4,3)}})}))),U=function(e){var t=O(Object(c.useCallback)((function(e){return{isHost:e.isHost,members:e.members,setSocket:e.setSocket,setRoom:e.setRoom,setMembers:e.setMembers,addMember:e.addMember,removeMember:e.removeMember,setIsHost:e.setIsHost,getSocket:e.getSocket,getRoom:e.getRoom,getName:e.getName,getAvatar:e.getAvatar}}),[])),n=t.isHost,o=t.members,a=t.setSocket,s=t.setRoom,i=t.setMembers,l=t.addMember,d=t.removeMember,j=t.setIsHost,b=t.getSocket,f=t.getRoom,h=t.getName,g=t.getAvatar,x=M(Object(c.useCallback)((function(e){return{setSelectedWord:e.setSelectedWord,setRoundLength:e.setRoundLength,startCountdown:e.startCountdown}}),[])),p=x.setSelectedWord,C=x.setRoundLength,y=x.startCountdown,w=Object(c.useState)(!1),k=Object(T.a)(w,2),S=k[0],R=k[1],L=Object(u.e)(),E=Object(u.f)().room,I=Y();Object(c.useEffect)((function(){""===f()?(s(E),b().id||""!==h()?(D(),H()):R(!0)):H()}),[]);var D=function(){var e=m()("/");a(e),e.on("members in this room",(function(e,t){if(i(e),t){var n=t.wordLength,r=t.startTime;if(0===n)return void L.replace("/playground");for(var c="",o=0;o<n;o++)c+="_ ";p(c),y(r),L.replace("/playground")}})),e.emit("join room",{roomID:E,name:h(),avatar:g()+1}),e.on("game started",(function(e){C(e),L.replace("/playground")})),e.on("new host",(function(){j(!0)})),e.on("invalid room",(function(){N("Invalid Room"),e.disconnect(),s(""),L.replace("/")}))},H=function(){var e=b();e.on("new member",(function(e){l(e)})),e.on("someone left",(function(e){d(e)})),e.on("something broke",(function(){N("Something went wrong, please try again later")}))};return Object(r.jsxs)("div",{id:"lobbyBackground",children:[Object(r.jsx)("h1",{id:"lobbyTitle",children:"Lobby"}),Object(r.jsxs)(v.a,{container:!0,children:[n&&Object(r.jsx)(v.a,{item:!0,md:4,sm:4,xs:12,style:{display:"flex",justifyContent:"center"},children:Object(r.jsx)(P,{numMembers:o.length,startGame:function(e){var t=e.round_length,n=e.numRounds;b().emit("start game",{round_length:t,numRounds:n}),L.replace("/playground")}})}),Object(r.jsx)(v.a,{item:!0,md:n?8:12,sm:n?8:12,xs:12,style:{display:"flex",justifyContent:"center"},children:""!==h()&&Object(r.jsx)(B,{members:o,isHost:n,socketID:b().id})})]}),Object(r.jsx)(z.a,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",className:I.modal,open:S,closeAfterTransition:!0,BackdropComponent:F.a,BackdropProps:{timeout:500},children:Object(r.jsx)(G.a,{in:S,children:Object(r.jsx)("div",{className:I.paper,children:Object(r.jsx)(_,{modalHandler:function(){R(!1),D(),H()}})})})})]})},X=n(92),q={chats:[]},K=Object(j.a)((function(e,t){return Object(d.a)(Object(d.a)({},q),{},{addChat:function(t){return e((function(e){return{chats:[].concat(Object(l.a)(e.chats),[t])}}))},clearChats:function(){return e(Object(d.a)({},q))}})})),Q=(n(147),function(e){var t=e.memberScores,n=O(Object(c.useCallback)((function(e){return e.getSocket}),[])),o=Object(u.e)();return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h2",{id:"gameOverTitle",children:"Game Over!"}),Object(r.jsx)("div",{id:"resultsContainer",children:Object(r.jsx)("table",{children:t.map((function(e,t){return Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:Object(r.jsxs)("b",{className:"resultContent",children:["#",t+1]})}),Object(r.jsx)("td",{children:Object(r.jsx)("span",{className:"resultContent",children:e.socketID===n().id?"You":e.memberDetails.name})}),Object(r.jsx)("td",{children:Object(r.jsx)("span",{className:"resultContent",children:e.score})})]})}))})}),Object(r.jsx)(w.a,{variant:"contained",color:"primary",onClick:function(){return o.replace("/")},children:"Home"})]})}),Z=n(204),$=(n(148),Object(V.a)((function(e){return{modal:{display:"flex",alignItems:"center",justifyContent:"center"},paper:{backgroundColor:e.palette.background.paper,border:"2px solid #000",boxShadow:e.shadows[5],padding:e.spacing(2,4,3)}}}))),ee=function(e){var t=e.getColor,n=Object(c.useRef)(null),o=Object(c.useRef)(!1),a=Object(c.useRef)({x:0,y:0}),s=Object(c.useRef)([]),i=Object(c.useRef)([]),u=Object(c.useRef)(""),l=Object(c.useState)(500),d=Object(T.a)(l,2),j=d[0],b=d[1],m=Object(c.useState)(!1),f=Object(T.a)(m,2),h=f[0],v=f[1],g=Object(c.useState)(!1),x=Object(T.a)(g,2),p=x[0],C=x[1],y=$(),k=O(Object(c.useCallback)((function(e){return{getSocket:e.getSocket,reset:e.reset}}),[])),N=k.getSocket,R=k.reset,L=K(Object(c.useCallback)((function(e){return{addChat:e.addChat,clearChats:e.clearChats}}),[])),E=L.addChat,I=L.clearChats,D=M(Object(c.useCallback)((function(e){return{myTurn:e.myTurn,setMyTurn:e.setMyTurn,getMyTurn:e.getMyTurn,roundLength:e.roundLength,setSelectedWord:e.setSelectedWord,startCountdown:e.startCountdown}}),[])),H=D.myTurn,W=D.setMyTurn,A=D.getMyTurn,P=D.roundLength,B=D.setSelectedWord,_=D.startCountdown;Object(c.useEffect)((function(){V();var e=setInterval((function(){ne()}),100);return function(){window.removeEventListener("resize",oe),clearInterval(e)}}),[]);var V=function(){if(n.current){var e=N();e.on("receiveStrokes",(function(e){var t,n=Object(X.a)(e);try{for(n.s();!(t=n.n()).done;){var r=t.value,c=r.newCoordinates,o=r.currentCoordinates,a=r.color;te(c,a,o)}}catch(s){n.e(s)}finally{n.f()}})),e.on("turn",(function(e){i.current=e,C(!0),W(!0),ae()})),e.on("someone choosing word",(function(e){u.current="".concat(e," is choosing a word"),v(!0),W(!1),ae()})),e.on("start guessing",(function(){S("start guessing"),v(!1),_()})),e.on("auto-selected",(function(){A()?(C(!1),re(e),B(i.current[0])):S("start guessing"),v(!1),_()})),e.on("guesses",(function(e){E(e)})),e.on("game over",(function(t){S("Game over"),u.current=t,v(!0),W(!1),C(!1),e.disconnect(),R(),I()})),oe(),J()}};Object(c.useEffect)((function(){ce("white")}),[j]);var J=function(){window.addEventListener("resize",oe);var e=n.current;null===e||void 0===e||e.addEventListener("mousedown",Y),null===e||void 0===e||e.addEventListener("mousemove",U),null===e||void 0===e||e.addEventListener("mouseup",q),null===e||void 0===e||e.addEventListener("mouseleave",q),null===e||void 0===e||e.addEventListener("touchstart",Y),null===e||void 0===e||e.addEventListener("touchmove",U),null===e||void 0===e||e.addEventListener("touchend",q),null===e||void 0===e||e.addEventListener("touchcancel",q)},Y=Object(c.useCallback)((function(e){console.log("mousedown"),o.current=!0,ee({e:e,toDraw:!1,setPosition:!0})}),[]),U=function(e){o.current&&(console.log("mousemove true"),ee({e:e,toDraw:!0,setPosition:!0}))},q=function(e){console.log("mouseup"),o.current&&(o.current=!1,ee({e:e,toDraw:!0,setPosition:!1}))},ee=function(e){var r=e.e,c=e.toDraw,o=e.setPosition;if(n.current){var i;if(r instanceof MouseEvent?(i={x:r.pageX-n.current.offsetLeft,y:r.pageY-n.current.offsetTop},console.log(i,n.current.offsetTop,n.current.offsetLeft)):(i={x:r.changedTouches[0].clientX-n.current.offsetLeft,y:r.changedTouches[0].clientY-n.current.offsetTop},console.log(i)),c){var u,l,d=t();te({x:i.x,y:i.y},d),s.current.push({newCoordinates:i,currentCoordinates:{x:(null===(u=a.current)||void 0===u?void 0:u.x)/j,y:(null===(l=a.current)||void 0===l?void 0:l.y)/j},color:d})}o&&(a.current=i)}},te=function(e,t,r){var c,o=e.x,s=e.y,i=null===(c=n.current)||void 0===c?void 0:c.getContext("2d");i&&(i.lineWidth=2,i.strokeStyle=t,i.beginPath(),r?i.moveTo(r.x*j,r.y*j):i.moveTo(a.current.x,a.current.y),i.lineTo(o,s),i.closePath(),i.stroke())},ne=function(){var e=s.current;e.length>0&&(N().emit("drawing",e),s.current=[])},re=function(e){setTimeout((function(){W(!1),e.emit("next turn")}),1e3*P)},ce=function(e){var t,r=null===(t=n.current)||void 0===t?void 0:t.getContext("2d");r&&(r.fillStyle=e,r.fillRect(0,0,j,j))},oe=function(){var e=window.outerWidth;b(e<540?Math.round(.97*e):500)},ae=function(){var e,t=null===(e=n.current)||void 0===e?void 0:e.getContext("2d");t&&(t.clearRect(0,0,j,j),ce("white"))};return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsxs)("div",{id:"canvasContainer",style:{height:j},children:[Object(r.jsx)(Z.a,{in:h,children:Object(r.jsx)("div",{className:"sketchboardLayers",id:"overlay",style:{width:j,height:j},children:Object(r.jsx)("div",{id:"overlayContainer",children:"string"===typeof u.current?Object(r.jsx)("span",{className:"overlayText",children:u.current}):Object(r.jsx)(Q,{memberScores:u.current})})})}),Object(r.jsx)("div",{children:Object(r.jsx)("canvas",{height:j,width:j,ref:n,style:{pointerEvents:H?"auto":"none"}})})]}),Object(r.jsx)(z.a,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",className:y.modal,open:p,closeAfterTransition:!0,BackdropComponent:F.a,BackdropProps:{timeout:500},children:Object(r.jsx)(G.a,{in:p,children:Object(r.jsxs)("div",{className:y.paper,children:[Object(r.jsx)("h2",{id:"chooseWordTitle",children:"Choose a word!"}),i.current.map((function(e){return Object(r.jsx)(w.a,{variant:"contained",color:"primary",style:{marginRight:3,marginLeft:3},onClick:function(){return function(e){var t=N();t.emit("chosen word",e),re(t),C(!1),v(!1),_(),H&&B(e)}(e)},children:e})}))]})})})]})},te=Object(c.memo)(ee),ne=(n(149),function(e){var t=e.setColorInParent,n=Object(c.useState)(g.b[0]),o=Object(T.a)(n,2),a=o[0],s=o[1],i=Object(c.useState)(!1),u=Object(T.a)(i,2),l=u[0],d=u[1];Object(c.useEffect)((function(){return t(a),j(),window.addEventListener("resize",j),function(){window.removeEventListener("resize",j)}}),[]);var j=function(){var e=window.outerWidth;d((function(t){return!(t&&e>=600)&&(!t&&e<600||t)}))};return Object(r.jsx)("div",{id:"paletteContainer",children:Object(r.jsx)(v.a,{container:!0,children:function(){for(var e=[],n=0;n<5;n++){for(var c=[],o=function(e){var n=g.b[e]===a;c.push(Object(r.jsx)("div",{style:{border:n?"1.8px solid white":""},onClick:function(){return n=g.b[e],s(n),void t(n);var n},children:Object(r.jsx)("div",{className:"color",style:{backgroundColor:g.b[e]}})}))},i=5*n;i<5*(n+1);i++)o(i);e.push(Object(r.jsx)(v.a,{item:!0,id:"colorsContainer",style:{justifyContent:l?"center":n%2===0?"flex-end":"flex-start"},md:6,sm:6,xs:12,children:c}))}return e}()})})}),re=(n(150),function(e){var t=O(Object(c.useCallback)((function(e){return{members:e.members,setMembers:e.setMembers,getSocket:e.getSocket}}),[])),n=t.members,o=t.setMembers,a=t.getSocket,s=Object(c.useState)(!1),i=Object(T.a)(s,2),u=i[0],l=i[1];Object(c.useEffect)((function(){return d(),j(),window.addEventListener("resize",j),function(){window.removeEventListener("resize",j)}}),[]);var d=function(){a().on("updated scores",(function(e){o(e)}))},j=function(){var e=window.outerWidth;l((function(t){return!(t&&e>=960)&&(!t&&e<960||t)}))};return Object(r.jsx)("div",{id:"scoreCardContainer",children:Object(r.jsx)(p.a,{id:"scoreCard",children:n.length>0&&Object(r.jsx)(C.a,{id:"scoreCardContent",children:n.map((function(e,t){return u?Object(r.jsxs)("div",{className:"scoreCardSmallScreen",children:[Object(r.jsx)("p",{className:"scoreCardName",children:e.memberDetails.name}),Object(r.jsx)("img",{className:"scoreCardAvatar",src:"/images/avatar_".concat(e.memberDetails.avatar,".jpg")}),Object(r.jsx)("p",{className:"score",children:Object(r.jsx)("b",{children:e.score})})]}):Object(r.jsxs)(r.Fragment,{children:[Object(r.jsxs)("div",{className:"scoreCardBigScreen",children:[Object(r.jsxs)("b",{children:["#",t+1]}),Object(r.jsx)("img",{className:"scoreCardAvatar",src:"/images/avatar_".concat(e.memberDetails.avatar,".jpg")}),Object(r.jsxs)("div",{children:[Object(r.jsx)("p",{className:"scoreCardName",children:e.memberDetails.name}),Object(r.jsxs)("p",{className:"score",children:["Score: ",Object(r.jsx)("b",{children:e.score})]})]})]}),t!==n.length-1&&Object(r.jsx)("hr",{})]})}))})})})}),ce=o.a.memo(re),oe=(n(151),function(e){var t=e.submitGuess,n=Object(c.useState)(""),o=Object(T.a)(n,2),a=o[0],s=o[1];return Object(r.jsxs)("form",{autoComplete:"off",noValidate:!0,id:"guessInputForm",onSubmit:function(e){t(e,a),s("")},children:[Object(r.jsx)(y.a,{id:"standard-basic",label:"Enter guess",value:a,onChange:function(e){return s(e.target.value)}}),Object(r.jsx)(w.a,{type:"submit",variant:"contained",color:"primary",id:"submitGuess",disabled:""===a,children:"Submit"})]})}),ae=(n(152),function(){var e=O(Object(c.useCallback)((function(e){return e.getSocket}),[])),t=M(Object(c.useCallback)((function(e){return e.myTurn}),[])),n=K(Object(c.useCallback)((function(e){return e.chats}),[])),o=Object(c.useRef)(null);Object(c.useEffect)((function(){o.current&&(o.current.scrollTop=o.current.scrollHeight)}),[n]);return Object(r.jsx)(p.a,{children:Object(r.jsxs)(C.a,{id:"chatboxContainer",children:[Object(r.jsx)("div",{id:"chatbox",ref:o,style:{height:t?"100%":"85%"},children:n.map((function(t,n){return Object(r.jsx)("div",{className:"guessContainer",children:Object(r.jsxs)("p",{style:{color:t.color},children:[Object(r.jsx)("b",{children:t.socketID===e().id?"You":t.sender}),": "+t.message]})},n)}))}),!t&&Object(r.jsx)("div",{children:Object(r.jsx)(oe,{submitGuess:function(t,n){t.preventDefault(),e().emit("guess",n)}})})]})})}),se=o.a.memo(ae),ie=function(){var e=M(Object(c.useCallback)((function(e){return e.timeRemaining}),[]));return Object(r.jsx)("span",{style:{fontSize:25,marginLeft:6},children:function(){var t=Math.floor(e/60),n=e-60*t;return n<10&&(n="0"+n.toString()),"".concat(t,":").concat(n)}()})},ue=function(){var e=O((function(e){return e.getSocket})),t=M(Object(c.useCallback)((function(e){return{myTurn:e.myTurn,selectedWord:e.selectedWord,setSelectedWord:e.setSelectedWord}}),[])),n=t.myTurn,o=t.selectedWord,a=t.setSelectedWord;Object(c.useEffect)((function(){s()}),[]);var s=function(){var t=e();t.on("start guessing",(function(e){i(e)})),t.on("auto-selected",(function(e){n||i(e)}))},i=function(e){for(var t="",n=0;n<e;n++)t+="_ ";a(t)};return Object(r.jsx)("div",{children:Object(r.jsx)("p",{style:{fontSize:30,margin:0},children:o})})},le=(n(153),function(e){var t=Object(c.useState)(0),n=Object(T.a)(t,2),o=n[0],a=n[1],s=O((function(e){return e.getSocket}));Object(c.useEffect)((function(){i()}),[]);var i=function(){s().on("your score",(function(e){a((function(t){return t+e}))}))};return Object(r.jsxs)("p",{id:"score",children:["Score: ",Object(r.jsx)("b",{children:o})]})}),de=(n(154),function(){return Object(r.jsx)(p.a,{id:"gameBar",children:Object(r.jsxs)("div",{id:"objectsContainer",children:[Object(r.jsx)(ie,{}),Object(r.jsx)(ue,{}),Object(r.jsx)(le,{})]})})}),je=n(212),be=(n(155),function(e){var t=Object(c.useRef)(""),n=Object(c.useState)(!1),o=Object(T.a)(n,2),a=o[0],s=o[1],i=Object(c.useState)(!1),l=Object(T.a)(i,2),d=l[0],j=l[1],b=O(Object(c.useCallback)((function(e){return e.getRoom}),[])),m=M(Object(c.useCallback)((function(e){return e.myTurn}),[])),f=Object(u.e)();Object(c.useEffect)((function(){h()}),[]);var h=function(){""!==b()?(g(),window.addEventListener("resize",g)):f.replace("/")},g=function(){var e=window.outerWidth;j((function(t){return!(t&&e>=960)&&(!t&&e<960||t)}))};return Object(r.jsxs)("div",{id:"playgroundBackground",children:[Object(r.jsx)("h1",{id:"playgroundTitle",children:"Playground"}),Object(r.jsx)("div",{id:"gameBarContainer",children:Object(r.jsx)("div",{style:{width:"85%"},children:Object(r.jsx)(de,{})})}),Object(r.jsxs)(v.a,{container:!0,children:[Object(r.jsx)(v.a,{item:!0,md:2,sm:12,xs:12,children:Object(r.jsx)(ce,{})}),Object(r.jsxs)(v.a,{item:!0,md:8,sm:12,xs:12,children:[Object(r.jsx)(te,{getColor:function(){return t.current}}),m&&Object(r.jsx)(ne,{setColorInParent:function(e){t.current=e}})]}),!d&&Object(r.jsx)(v.a,{item:!0,md:2,children:Object(r.jsx)("div",{style:{width:"95%"},children:Object(r.jsx)(se,{})})})]}),d&&Object(r.jsxs)("div",{children:[Object(r.jsx)(w.a,{id:"drawerButton",onClick:function(){return s(!0)},children:Object(r.jsx)("svg",{width:"2em",height:"2em",viewBox:"0 0 16 16",fill:"white",xmlns:"http://www.w3.org/2000/svg",children:Object(r.jsx)("path",{"fill-rule":"evenodd",d:"M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"})})}),Object(r.jsx)(je.a,{anchor:"right",open:a,onClose:function(){return s(!1)},children:Object(r.jsx)("div",{id:"drawerChatbox",children:Object(r.jsx)(se,{})})})]})]})}),me=(n(156),function(){return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsxs)(i.a,{children:[Object(r.jsx)(u.a,{exact:!0,path:"/",component:L}),Object(r.jsx)(u.a,{exact:!0,path:"/lobby/:room",component:U}),Object(r.jsx)(u.a,{exact:!0,path:"/playground",component:be})]}),Object(r.jsx)(R,{})]})}),fe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,213)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,o=t.getLCP,a=t.getTTFB;n(e),r(e),c(e),o(e),a(e)}))};s.a.render(Object(r.jsx)(o.a.StrictMode,{children:Object(r.jsx)(me,{})}),document.getElementById("root")),fe()},35:function(e){e.exports=JSON.parse('{"b":["#ff0000","#A0522D","#ff4000","#ff8000","#ffbf00","#ffff00","#bfff00","#80ff00","#40ff00","#00ff00","#00ffbf","#00ffff","#00bfff","#0080ff","#0040ff","#0000ff","#4000ff","#8000ff","#bf00ff","#ff00ff","#ff00bf","#ff0080","#cccccc","#aaaaaa","#000000"],"a":["avatar_1.jpg","avatar_2.jpg","avatar_3.jpg","avatar_4.jpg","avatar_5.jpg","avatar_6.jpg"]}')}},[[157,1,2]]]);
//# sourceMappingURL=main.2e437d94.chunk.js.map