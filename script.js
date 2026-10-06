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

/* RENIVA checkout navigation: never rely on hash scrolling. */
function goToCheckout(){
  const target=document.getElementById("order");
  if(!target)return false;
  target.style.contentVisibility="visible";
  target.style.contain="none";
  const top=Math.max(0,target.getBoundingClientRect().top+window.pageYOffset-8);
  window.scrollTo(0,top);
  requestAnimationFrame(()=>{
    const y=Math.max(0,target.getBoundingClientRect().top+window.pageYOffset-8);
    window.scrollTo(0,y);
  });
  setTimeout(()=>{
    const y=Math.max(0,target.getBoundingClientRect().top+window.pageYOffset-8);
    window.scrollTo(0,y);
  },120);
  return true;
}

document.addEventListener("click",event=>{
  const link=event.target.closest("a[data-order-link]");
  if(!link)return;
  event.preventDefault();
  event.stopPropagation();
  goToCheckout();
  history.replaceState(null,"","#order");
},true);