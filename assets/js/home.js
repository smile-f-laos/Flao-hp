// 主な活動：スクロールに合わせて円周上のカードを切り替える。
(()=>{const section=document.querySelector('.orbit-section'),stage=section.querySelector('.orbit-stage'),windowEl=section.querySelector('.orbit-window'),disk=section.querySelector('.orbit-disk'),cards=[...section.querySelectorAll('.orbit-card')],buttons=[...section.querySelectorAll('[data-orbit]')],count=section.querySelector('#orbit-current'),desc=section.querySelector('.orbit-description'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
const descriptions=['ラオスのフェアトレードコーヒーを届け、売上の一部を教育支援につなげています。','今年は食育・衛生・環境をテーマに、子どもたちが学ぶテキストブックを制作しています。','学校やコーヒー農家を訪ね、出会いと学びを、次の活動へとつなげます。'];
let last=-1,scheduled=false;
function render(){scheduled=false;
section.style.setProperty('--screen-width',document.documentElement.clientWidth+'px');
if(reduced.matches){cards.forEach(c=>{c.removeAttribute('tabindex');
c.removeAttribute('aria-hidden')});
return;
}const rect=section.getBoundingClientRect(),h=stage.clientHeight,travel=section.offsetHeight-h,p=Math.max(0,Math.min(2,-rect.top/Math.max(1,travel)*2)),selected=Math.round(p),w=stage.clientWidth,mobile=w<=760,r=mobile?w*1.3:w*.47,cx=mobile?w*1.8:w*1.18,cy=mobile?h*.65:h*.5,windowRect=windowEl.getBoundingClientRect(),stageRect=stage.getBoundingClientRect(),offsetX=windowRect.left-stageRect.left,offsetY=windowRect.top-stageRect.top;
disk.style.width=r*2+'px';
disk.style.height=r*2+'px';
disk.style.left=cx+'px';
disk.style.top=cy+'px';
cards.forEach((card,i)=>{const delta=i-p,angle=(180+delta*(mobile?68:Math.min(68,2*Math.asin(Math.min(.95,335/r))*180/Math.PI)))*Math.PI/180,x=cx+Math.cos(angle)*r-offsetX,y=cy+Math.sin(angle)*r-offsetY,opacity=Math.max(0,1-Math.abs(delta)/.67);
card.style.transform='translate('+x+'px,'+y+'px) translate(-50%,-50%) rotate('+(-delta*22)+'deg)';
card.style.opacity=opacity;
card.style.visibility=opacity<.01?'hidden':'visible';
card.style.zIndex=i===selected?4:2;
card.style.pointerEvents=i===selected?'auto':'none';
card.tabIndex=i===selected?0:-1;
card.setAttribute('aria-hidden',i===selected?'false':'true');
});
if(selected!==last){count.textContent=String(selected+1).padStart(2,'0');
desc.textContent=descriptions[selected];
buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));
last=selected;
}}function schedule(){if(!scheduled){scheduled=true;
requestAnimationFrame(render)}}buttons.forEach((b,i)=>b.addEventListener('click',()=>window.scrollTo({top:scrollY+section.getBoundingClientRect().top+(section.offsetHeight-stage.clientHeight)*i/2,behavior:reduced.matches?'instant':'smooth'})));
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule);
reduced.addEventListener('change',schedule);
render()})();


// トップ写真：5秒間隔、一時停止と動きを減らす設定に対応。
(()=>{const root=document.querySelector(".hero-slideshow"),slides=[...root.querySelectorAll(".hero-photo-slide")],button=document.querySelector(".hero-photo-pause"),counter=document.querySelector(".hero-photo-count"),reduce=matchMedia("(prefers-reduced-motion:reduce)");
let current=0,paused=reduce.matches;
function label(){button.textContent=paused?"再生":"一時停止";
}function next(){if(paused||document.hidden)return;
slides[current].classList.remove("is-active");
slides[current].setAttribute("aria-hidden","true");
current=(current+1)%slides.length;
slides[current].classList.add("is-active");
slides[current].removeAttribute("aria-hidden");
counter.textContent=String(current+1).padStart(2,"0")+" / 06";
}button.addEventListener("click",()=>{paused=!paused;
label()});
reduce.addEventListener("change",()=>{paused=reduce.matches;
label()});
label();
setInterval(next,5000);
})();

