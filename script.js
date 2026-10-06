document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  const selected=document.getElementById("selected-offer");
  const message=document.getElementById("form-message");
  const offers={
    "1":"169 ريال — شهران",
    "2":"199 ريال — 4 أشهر",
    "3":"219 ريال — 6 أشهر"
  };
  document.querySelectorAll('input[name="offer"]').forEach(input=>{
    input.addEventListener("change",()=>{
      selected.textContent=offers[input.value] || offers["1"];
    });
  });
  document.querySelectorAll('a[href="#order"]').forEach(a=>{
    a.addEventListener("click",()=>{
      const sticky=document.querySelector(".sticky");
      if(sticky) sticky.classList.add("is-hidden");
      window.setTimeout(()=>sticky && sticky.classList.remove("is-hidden"),900);
    });
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    message.textContent="سيتم تفعيل الإرسال بعد ربط بوابة الطلب الخاصة بـ RENIVA.";
    message.className="form-message pending";
  });
});