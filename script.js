document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  const message=document.getElementById("form-message");
  if(!form)return;

  form.querySelectorAll('input[name="offer"]').forEach(input=>{
    input.addEventListener("change",()=>{
      form.querySelectorAll(".offer").forEach(card=>card.classList.toggle("is-selected",card.querySelector('input[name="offer"]')?.checked===true));
    });
  });

  form.addEventListener("submit",event=>{
    event.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    message.textContent="تم استلام بياناتك. سنتواصل معك لتأكيد الطلب قبل الشحن.";
    message.className="form-message success";
  });
});

/* RENIVA checkout navigation — same interaction model as the Cosma checkout. */
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
