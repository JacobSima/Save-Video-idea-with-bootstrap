
document.addEventListener('DOMContentLoaded',()=>{ 
  const alertArr = document.querySelectorAll('.alert')
  const alertT = Array.from(alertArr)
  function alertIterator(arr){
    return {
      next:function(){
        const alert = document.querySelector('.alert')
        alert.remove()
        arr.shift()
      }
    }
  }
 const le = alertIterator(alertT)
 const timing=setInterval(()=>{
    le.next()
    if(alertT.length===0){clearInterval(timing)}
  },2000)
})