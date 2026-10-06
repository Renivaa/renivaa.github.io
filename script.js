document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  const message=document.getElementById("form-message");
  const offers={
    "1":"169 ريال — عبوة واحدة · تكفيك شهرين",
    "2":"199 ريال — عبوتان · تكفيك 4 أشهر",
    "3":"219 ريال — 3 عبوات · تكفيك 6 أشهر"
  };

  document.querySelectorAll('a[href="#order"]').forEach(link=>{
    link.addEventListener("click",event=>{
      const target=document.getElementById("order");
      if(!target) return;
      event.preventDefault();
      history.pushState(null,"","#order");
      target.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });

  document.querySelectorAll('input[name="offer"]').forEach(input=>{
    input.addEventListener("change",()=>{
      if(input.checked) input.closest(".offer")?.classList.add("is-selected");
      document.querySelectorAll('input[name="offer"]').forEach(other=>{
        if(other!==input) other.closest(".offer")?.classList.remove("is-selected");
      });
    });
  });

  form?.addEventListener("submit",event=>{
    event.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    message.textContent="تم التحقق من البيانات. سيتم تأكيد الطلب معك قبل الشحن.";
    message.className="form-message success";
  });
});