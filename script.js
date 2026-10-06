document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  const message=document.getElementById("form-message");
  const selected=document.getElementById("selected-offer");
  const offers={
    "1":"169 ريال — شهران",
    "2":"199 ريال — 4 أشهر",
    "3":"219 ريال — 6 أشهر"
  };
  document.querySelectorAll('input[name="offer"]').forEach(input=>{
    input.addEventListener("change",()=>{
      selected.textContent=offers[input.value]||offers["1"];
    });
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    message.textContent="تم استلام البيانات. سيتم تأكيد الطلب معك قبل الشحن.";
    message.scrollIntoView({behavior:"smooth",block:"nearest"});
  });
  document.querySelectorAll('a[href="#offers"]').forEach(a=>a.addEventListener("click",()=>{
    const sticky=document.querySelector(".sticky");
    if(sticky) sticky.style.transform="translate(-50%,130%)";
    setTimeout(()=>{if(sticky) sticky.style.transform="translate(-50%,0)"},1200);
  }));
});