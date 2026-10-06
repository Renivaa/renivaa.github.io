document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  const selected=document.getElementById("selected-offer");
  const message=document.getElementById("form-message");
  const offers={
    "1":"169 ريال — عبوة واحدة · تكفيك شهرين",
    "2":"199 ريال — عبوتان · تكفيك 4 أشهر",
    "3":"219 ريال — 3 عبوات · تكفيك 6 أشهر"
  };
  document.querySelectorAll('input[name="offer"]').forEach(input=>{
    input.addEventListener("change",()=>{
      selected.textContent=offers[input.value] || offers["1"];
    });
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    message.textContent="تم التحقق من البيانات. سيتم تأكيد الطلب معك قبل الشحن.";
    message.className="form-message success";
  });
});