document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  const message=document.getElementById("form-message");
  const nameEl=document.getElementById("selected-offer-name");
  const durationEl=document.getElementById("selected-offer-duration");
  const priceEl=document.getElementById("selected-offer-price");
  if(!form)return;

  const updateOffer=()=>{
    form.querySelectorAll(".offer").forEach(card=>{
      const input=card.querySelector('input[name="offer"]');
      card.classList.toggle("is-selected",!!input?.checked);
    });
    const selected=form.querySelector('input[name="offer"]:checked');
    if(selected){
      if(nameEl)nameEl.textContent=selected.dataset.label||"";
      if(durationEl)durationEl.textContent=selected.dataset.duration||"";
      if(priceEl)priceEl.textContent=selected.dataset.price||"";
    }
  };

  form.querySelectorAll('input[name="offer"]').forEach(input=>input.addEventListener("change",updateOffer));
  updateOffer();

  form.addEventListener("submit",event=>{
    event.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    message.textContent="تم التحقق من بيانات الطلب. سنتواصل معك لتأكيده قبل الشحن.";
    message.className="form-message success";
  });
});

function goToCheckout(){
  const target=document.getElementById("order");
  if(!target)return false;
  target.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"});
  return true;
}

document.addEventListener("click",event=>{
  const link=event.target.closest("a[data-order-link]");
  if(!link)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  goToCheckout();
},true);

const sticky=document.querySelector(".sticky");
const order=document.getElementById("order");
if(sticky&&order){
  let dismissed=false;
  const hide=()=>{if(dismissed)return;dismissed=true;sticky.classList.add("is-hidden");};
  const check=()=>{
    if(dismissed)return;
    const r=order.getBoundingClientRect();
    const vh=window.visualViewport?window.visualViewport.height:window.innerHeight;
    if(r.top<=vh*.88)hide();
  };
  sticky.addEventListener("click",event=>{event.preventDefault();hide();goToCheckout();});
  order.addEventListener("focusin",hide);
  order.addEventListener("pointerdown",hide,{passive:true});
  window.addEventListener("scroll",check,{passive:true});
  window.addEventListener("resize",check,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener("resize",check,{passive:true});
    window.visualViewport.addEventListener("scroll",check,{passive:true});
  }
  requestAnimationFrame(check);
}
