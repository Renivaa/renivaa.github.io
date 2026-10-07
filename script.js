document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  if(!form)return;

  const message=document.getElementById("form-message");
  const submit=form.querySelector("#submit-order");
  const offerInputs=[...form.querySelectorAll('input[name="offer"]')];
  const nameEl=form.elements.name;
  const phoneEl=form.elements.phone;
  const cityEl=form.elements.city;

  const selectedName=document.getElementById("selected-offer-name");
  const selectedDuration=document.getElementById("selected-offer-duration");
  const selectedPrice=document.getElementById("selected-offer-price");

  const setMessage=(text,type="")=>{
    message.textContent=text;
    message.className="form-message"+(type?" "+type:"");
  };

  const updateOffer=()=>{
    offerInputs.forEach(input=>{
      const card=input.closest(".offer");
      if(card)card.classList.toggle("is-selected",input.checked);
    });
    const selected=form.querySelector('input[name="offer"]:checked');
    if(!selected)return;
    selectedName.textContent=selected.dataset.label||"باقة RENIVA";
    selectedDuration.textContent=selected.dataset.duration||"";
    selectedPrice.textContent=selected.dataset.price||"";
    setMessage("");
  };

  const clearErrors=()=>{
    form.querySelectorAll(".has-error").forEach(el=>el.classList.remove("has-error"));
    form.querySelectorAll(".field-error").forEach(el=>el.textContent="");
  };

  const showError=(field,text)=>{
    const label=field.closest("label");
    if(!label)return;
    label.classList.add("has-error");
    const error=label.querySelector(".field-error");
    if(error)error.textContent=text;
  };

  const validate=()=>{
    clearErrors();
    let ok=true;
    const name=nameEl.value.trim();
    const city=cityEl.value.trim();
    const phone=phoneEl.value.trim().replace(/\s+/g,"");

    if(name.length<2){showError(nameEl,"أدخل الاسم الكامل.");ok=false;}
    if(!/^(05\d{8}|\+9665\d{8})$/.test(phone)){
      showError(phoneEl,"أدخل رقم جوال سعودي صحيح مثل 05xxxxxxxx.");ok=false;
    }
    if(city.length<2){showError(cityEl,"أدخل اسم المدينة.");ok=false;}

    if(!ok){
      const first=form.querySelector(".has-error input");
      if(first)first.focus({preventScroll:false});
      setMessage("راجع الحقول المحددة ثم حاول مرة أخرى.","error");
    }
    return ok;
  };

  offerInputs.forEach(input=>input.addEventListener("change",updateOffer));

  [nameEl,phoneEl,cityEl].forEach(field=>{
    field.addEventListener("input",()=>{
      const label=field.closest("label");
      if(label)label.classList.remove("has-error");
      if(message.classList.contains("error"))setMessage("");
    });
    field.addEventListener("blur",()=>{
      if(field===phoneEl){
        const value=field.value.trim().replace(/\s+/g,"");
        if(value && !/^(05\d{8}|\+9665\d{8})$/.test(value))showError(field,"رقم الجوال غير صحيح.");
      }
    });
  });

  form.addEventListener("submit",event=>{
    event.preventDefault();
    if(!validate())return;

    const selected=form.querySelector('input[name="offer"]:checked');
    if(!selected)return;

    submit.disabled=true;
    submit.querySelector("span").textContent="جارٍ تجهيز طلبك…";
    setMessage("تم التحقق من البيانات. سننتقل معك لتأكيد الطلب.","success");

    setTimeout(()=>{
      submit.disabled=false;
      submit.querySelector("span").textContent="تأكيد الطلب — الدفع عند الاستلام";
    },900);
  });

  updateOffer();
});

function goToCheckout(){
  const target=document.getElementById("order");
  if(!target)return false;
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

const sticky=document.querySelector(".sticky");
const order=document.getElementById("order");
if(sticky&&order){
  let dismissed=false;
  const hide=()=>{
    if(dismissed)return;
    dismissed=true;
    sticky.classList.add("is-hidden");
  };
  const check=()=>{
    if(dismissed)return;
    const r=order.getBoundingClientRect();
    const vh=window.visualViewport?window.visualViewport.height:window.innerHeight;
    if(r.top<=vh*.88)hide();
  };
  sticky.addEventListener("click",event=>{
    event.preventDefault();
    hide();
    goToCheckout();
  });
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
