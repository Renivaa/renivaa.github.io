const CONFIG={
  endpoint:"https://script.google.com/macros/s/AKfycbxxBGHE4mZ5iDdplvvaFxVhrHoOMETyRoafg8iG-DGx9vhY27JgFhc3VHFBO22hu4x0w/exec",
  snapPixelId:"233915bf-25f6-4119-9362-701fe3212185",
  sku:"RENIVA",
  product:"RENIVA® Instant Hair Thickener",
  currency:"SAR",
  country:"SA",
  offers:{
    1:{label:"باقة البداية",price:169,duration:"1 عبوة · شهران",backendOffer:1},
    2:{label:"باقة النتيجة الأفضل",price:199,duration:"2 عبوة · 4 أشهر",backendOffer:2},
    3:{label:"باقة العناية الكاملة",price:219,duration:"3 عبوات · 6 أشهر",backendOffer:3}
  }
};

(function initSnap(){
  if(!CONFIG.snapPixelId)return;
  (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s="script";var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,"https://sc-static.net/scevent.min.js");
  window.snaptr("init",CONFIG.snapPixelId);
  window.snaptr("track","PAGE_VIEW",{item_ids:[CONFIG.sku],item_category:"RENIVA"});
})();

const form=document.getElementById("order-form");
if(!form){ /* keep navigation helpers available even if form is absent */ }

const message=document.getElementById("form-message");
const submit=form&&form.querySelector("#submit-order");
const offerInputs=form?[...form.querySelectorAll('input[name="offer"]')]:[];
const nameEl=form&&form.elements.name;
const phoneEl=form&&form.elements.phone;
const cityEl=form&&form.elements.city;
const sticky=document.querySelector(".sticky");
const order=document.getElementById("order");

let checkoutTracked=false;
let contentTracked=false;

function currentOffer(){
  const code=Number(form?new FormData(form).get("offer"):1)||1;
  return {code,...(CONFIG.offers[code]||CONFIG.offers[1])};
}

function utmObject(o){
  const q=Object.fromEntries(new URLSearchParams(window.location.search));
  return {
    utm_source:q.utm_source||"snapchat",
    utm_medium:q.utm_medium||"paid_social",
    utm_campaign:q.utm_campaign||"reniva",
    utm_term:q.utm_term||(o.code===1?"offer-1":o.code===2?"offer-2":"offer-3"),
    utm_content:q.utm_content||"reniva-landing-page",
    gclid:q.gclid||"",
    sc_click_id:q.sc_click_id||q.snap_click_id||""
  };
}

function trackSnap(event,params={}){
  if(typeof window.snaptr!=="function")return;
  try{window.snaptr("track",event,{item_ids:[CONFIG.sku],item_category:"RENIVA",...params});}catch(_){}
}

function trackViewContent(){
  if(contentTracked)return;
  contentTracked=true;
  trackSnap("VIEW_CONTENT",{content_type:"product",price:169,currency:CONFIG.currency});
}

function trackCheckout(){
  if(checkoutTracked)return;
  const o=currentOffer();
  checkoutTracked=true;
  trackSnap("START_CHECKOUT",{price:o.price,currency:CONFIG.currency,number_items:o.code});
}

function setMessage(text,type=""){
  if(!message)return;
  message.textContent=text;
  message.className="form-message"+(type?" "+type:"");
}

function updateOffer(){
  offerInputs.forEach(input=>{
    const card=input.closest(".offer");
    if(card)card.classList.toggle("is-selected",input.checked);
  });
  if(form&&form.querySelector('input[name="offer"]:checked'))setMessage("");
}

function clearErrors(){
  if(!form)return;
  form.querySelectorAll(".has-error").forEach(el=>el.classList.remove("has-error"));
  form.querySelectorAll(".field-error").forEach(el=>el.textContent="");
}

function showError(field,text){
  const label=field&&field.closest("label");
  if(!label)return;
  label.classList.add("has-error");
  const error=label.querySelector(".field-error");
  if(error)error.textContent=text;
}

function normalizeSaudiPhone(value){
  let v=String(value||"").trim()
    .replace(/[٠-٩]/g,d=>String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g,d=>String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[\s()\-\u200e\u200f\u061c]/g,"");
  if(v.startsWith("+966"))v="0"+v.slice(4);
  else if(v.startsWith("00966"))v="0"+v.slice(5);
  else if(v.startsWith("966"))v="0"+v.slice(3);
  else if(/^5\d{8}$/.test(v))v="0"+v;
  return /^05\d{8}$/.test(v)?v:null;
}

function validate(){
  if(!form)return false;
  clearErrors();
  let ok=true;
  const name=String(nameEl.value||"").trim();
  const city=String(cityEl.value||"").trim();
  const phone=normalizeSaudiPhone(phoneEl.value);

  if(name.length<2){showError(nameEl,"أدخل الاسم الكامل.");ok=false;}
  if(!phone){showError(phoneEl,"أدخل رقم جوال سعودي صحيح.");ok=false;}
  if(city.length<2){showError(cityEl,"أدخل اسم المدينة.");ok=false;}

  if(!ok){
    const first=form.querySelector(".has-error input");
    if(first)first.focus({preventScroll:false});
    setMessage("راجع الحقول المحددة ثم حاول مرة أخرى.","error");
  }
  return ok;
}

function createTransactionId(){
  return "RENIVA-"+Date.now()+"-"+Math.random().toString(36).slice(2,8).toUpperCase();
}

function showSuccessConfirmation(o){
  let modal=document.getElementById("order-success-modal");
  if(!modal){
    modal=document.createElement("div");
    modal.id="order-success-modal";
    modal.className="order-success-modal";
    modal.setAttribute("role","dialog");
    modal.setAttribute("aria-modal","true");
    modal.setAttribute("aria-labelledby","order-success-title");
    modal.innerHTML='<div class="order-success-card"><div class="order-success-check">✓</div><h2 id="order-success-title">تم استلام طلبك</h2><p>طلبك وصل بنجاح. سنتواصل معك على رقم الجوال لتأكيد البيانات قبل الشحن.</p><div class="order-success-summary"><span>الباقة</span><strong id="order-success-offer"></strong><span>الإجمالي</span><strong id="order-success-price"></strong></div><button type="button" class="order-success-close">تم</button></div>';
    document.body.appendChild(modal);
    modal.querySelector(".order-success-close").addEventListener("click",()=>modal.classList.remove("is-visible"));
  }
  modal.querySelector("#order-success-offer").textContent=o.label;
  modal.querySelector("#order-success-price").textContent=o.price+" ريال";
  modal.classList.add("is-visible");
  const close=modal.querySelector(".order-success-close");
  if(close)close.focus({preventScroll:true});
}

if(form){
  offerInputs.forEach(input=>input.addEventListener("change",()=>{
    updateOffer();
    trackCheckout();
  }));

  [nameEl,phoneEl,cityEl].forEach(field=>{
    if(!field)return;
    field.addEventListener("input",()=>{
      const label=field.closest("label");
      if(label)label.classList.remove("has-error");
      if(message&&message.classList.contains("error"))setMessage("");
    });
    field.addEventListener("blur",()=>{
      if(field===phoneEl&&field.value.trim()&&!normalizeSaudiPhone(field.value)){
        showError(field,"رقم الجوال غير صحيح.");
      }
    });
  });

  form.addEventListener("focusin",trackCheckout,{once:true});

  form.addEventListener("submit",event=>{
    event.preventDefault();
    if(!validate())return;

    const selected=form.querySelector('input[name="offer"]:checked');
    if(!selected)return;
    const o=currentOffer();
    const transactionId=createTransactionId();

    trackSnap("ADD_CART",{price:o.price,currency:CONFIG.currency,number_items:o.code,content_type:"product"});
    submit.disabled=true;
    submit.querySelector("span").textContent="جارٍ إرسال طلبك…";

    const fd=new FormData(form);
    const name=String(fd.get("name")||"").trim();
    const phone=normalizeSaudiPhone(fd.get("phone"));
    const city=String(fd.get("city")||"").trim();

    const payload={
      transactionId,
      product:CONFIG.product,
      sku:CONFIG.sku,
      receiverSku:CONFIG.sku,
      name,
      phone,
      address:city,
      city,
      offerCode:o.backendOffer,
      offer:o.label,
      duration:o.duration,
      price:o.price,
      country:CONFIG.country,
      currency:CONFIG.currency,
      quantity:o.code,
      pageUrl:window.location.href,
      source:"RENIVA Landing Page",
      landingPage:"https://renivaa.github.io/",
      timestamp:new Date().toISOString(),
      utm:utmObject(o)
    };

    const body=JSON.stringify(payload);
    let queued=false;

    try{
      if(navigator.sendBeacon){
        queued=navigator.sendBeacon(CONFIG.endpoint,new Blob([body],{type:"text/plain;charset=utf-8"}));
      }
    }catch(_){}

    if(!queued){
      fetch(CONFIG.endpoint,{
        method:"POST",
        mode:"no-cors",
        keepalive:true,
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body
      }).catch(()=>{});
    }

    // Fire exactly one browser-side Purchase per generated transaction.
    trackSnap("PURCHASE",{
      price:o.price,
      currency:CONFIG.currency,
      transaction_id:transactionId,
      number_items:o.code,
      content_type:"product"
    });

    submit.disabled=true;
    submit.querySelector("span").textContent="تم استلام طلبك ✓";
    setMessage("تم استلام طلبك. سنتواصل معك للتأكيد قبل الشحن.","success");
    if(sticky)sticky.classList.add("is-hidden");
    showSuccessConfirmation(o);
  });

  updateOffer();
  trackViewContent();
}

function goToCheckout(){
  const target=document.getElementById("order");
  if(!target)return false;
  trackCheckout();
  target.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"});
  setTimeout(()=>{
    const first=target.querySelector('input[name="offer"]');
    if(first)first.focus({preventScroll:true});
  },450);
  return true;
}

document.addEventListener("click",event=>{
  const link=event.target.closest("a[data-order-link]");
  if(!link)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  goToCheckout();
},true);

if(sticky&&order){
  const updateSticky=()=>{
    const r=order.getBoundingClientRect();
    const vh=window.visualViewport?window.visualViewport.height:window.innerHeight;
    const inCheckout=r.top<=vh*.88&&r.bottom>=0;
    sticky.classList.toggle("is-hidden",inCheckout);
  };
  sticky.addEventListener("click",event=>{
    event.preventDefault();
    sticky.classList.add("is-hidden");
    goToCheckout();
  });
  order.addEventListener("focusin",()=>sticky.classList.add("is-hidden"));
  window.addEventListener("scroll",updateSticky,{passive:true});
  window.addEventListener("resize",updateSticky,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener("resize",updateSticky,{passive:true});
    window.visualViewport.addEventListener("scroll",updateSticky,{passive:true});
  }
  requestAnimationFrame(updateSticky);
}
