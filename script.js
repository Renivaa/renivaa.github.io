document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("order-form");
  const message=document.getElementById("form-message");

  document.querySelectorAll('input[name="offer"]').forEach(input=>{
    input.addEventListener("change",()=>{
      document.querySelectorAll('input[name="offer"]').forEach(other=>{
        other.closest(".offer")?.classList.toggle("is-selected",other===input && other.checked);
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

/* Same first-tap checkout navigation pattern used on XCORE FIT.
   The click is intercepted immediately, the browser does not animate through
   the page, and the target position is re-checked after layout settles. */
function scrollToOrderStart(){
  const target=document.getElementById("order");
  if(!target)return;
  const top=Math.max(0,window.pageYOffset+target.getBoundingClientRect().top-8);
  window.scrollTo({top,left:0,behavior:"auto"});
}

document.addEventListener("click",event=>{
  const link=event.target.closest('a[href="#order"], a[href="/#order"]');
  if(!link)return;
  event.preventDefault();
  scrollToOrderStart();
  requestAnimationFrame(()=>requestAnimationFrame(scrollToOrderStart));
  setTimeout(scrollToOrderStart,180);
  setTimeout(scrollToOrderStart,480);
},{capture:true});
