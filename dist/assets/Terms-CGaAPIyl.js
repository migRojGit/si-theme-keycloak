import{n as h,h as l,j as t,M as C}from"./index-CbVhUqln.js";import{c as m}from"./useGetClassName-SAC52WvF.js";import{h as g}from"./index-5csviorj.js";import{u as w}from"./useGetClassName-BbdUG_W5.js";function M(i){const{kcContext:e,i18n:a,doUseDefaultCss:n,Template:d,classes:r}=i,{getClassName:s}=w({doUseDefaultCss:n,classes:r}),{msg:u,msgStr:o}=a;h({kcContext:e,downloadTermMarkdown:async({currentLanguageTag:f})=>{const p=(()=>{switch(f){case"fr":return"/terms/fr.md";default:return"/terms/en.md"}})();return await fetch(p).then(x=>x.text())}}),g.useRerenderOnStateChange(l);const{url:k}=e,c=l.state;return c===void 0?null:t.jsxs(d,{kcContext:e,i18n:a,doUseDefaultCss:n,classes:r,displayMessage:!1,headerNode:u("termsTitle"),children:[t.jsx("div",{id:"kc-terms-text",children:t.jsx(C,{children:c})}),t.jsxs("form",{className:"form-actions",action:k.loginAction,method:"POST",children:[t.jsx("input",{className:m(s("kcButtonClass"),s("kcButtonClass"),s("kcButtonClass"),s("kcButtonPrimaryClass"),s("kcButtonLargeClass")),name:"accept",id:"kc-accept",type:"submit",value:o("doAccept")}),t.jsx("input",{className:m(s("kcButtonClass"),s("kcButtonDefaultClass"),s("kcButtonLargeClass")),name:"cancel",id:"kc-decline",type:"submit",value:o("doDecline")})]}),t.jsx("div",{className:"clearfix"})]})}export{M as default};
//# sourceMappingURL=Terms-CGaAPIyl.js.map
