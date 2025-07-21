const currentProductDateOrdered = localStorage.getItem('currentProductDateOrdered');
const url = new URL(window.location.href)
const cartCount = localStorage.getItem('cartCount')
const productId = parseInt(url.searchParams.get('productId'))
const orderedProducts = JSON.parse(localStorage.getItem('orderedProducts'))
const findProduct = orderedProducts.orderedProducts.find(product => product.id === productId)
const deliveredDate = dayjs(findProduct.shippingDate + ", " + dayjs().year()).toDate()
const orderContents = document.querySelector('.order .order-contents')
console.log(deliveredDate < dayjs().toDate())
const parseDate = dayjs(currentProductDateOrdered, 'dddd, MMMM D, YYYY')
    document.querySelector('header .cart span:nth-child(2)').textContent = `${cartCount ?? 0}`
const id = setInterval(() => {
  if(parseDate.add(30, 'minute').format('hh:mm:ss A') <= dayjs().format('hh:mm:ss A')){
    document.querySelector('.order .order-progress .progress .order-preparation-progress').classList.remove('animate')
    document.querySelector('.order .order-progress .progress .order-preparation-progress').style.width = '50%'
    const successMessage = document.createElement('div')
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
     <ion-icon name="checkmark-circle"></ion-icon>
     <span>Shipped Successfully</span>
    `
    if(document.querySelectorAll('.success-message').length >= 1){
        document.querySelector('.success-message').remove()
    }else{
 document.body.querySelector('script').insertAdjacentElement('beforebegin', successMessage)
    }
   clearInterval(id)
}else{  
        document.querySelector('.order .order-progress .progress .order-preparation-progress').classList.add('animate')
}

}, 1000)

const id2 = setInterval(() => {
       if(deliveredDate <= dayjs().format('MMMM D, YYYY')){
    document.querySelector('.order .order-progress .progress .order-preparation-progress').classList.remove('animate')
    document.querySelector('.order .order-progress .progress .order-preparation-progress').style.width = '100%'
    const filteredOrderedProducts = orderedProducts.orderedProducts.filter(product => product.id !== productId)
    localStorage.setItem('orderedProducts', JSON.stringify(filteredOrderedProducts))
     const successMessage = document.createElement('div')
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
     <ion-icon name="checkmark-circle"></ion-icon>
     <span>Delivered Successfully</span>
    `
    if(document.querySelectorAll('.success-message').length >= 1){
        document.querySelector('.success-message').remove()
    }else{
 document.body.querySelector('script').insertAdjacentElement('beforebegin', successMessage)
    }
    clearInterval(id2)
}
},1000)


function displayProduct(){
   orderContents.innerHTML = ""

   orderedProducts.orderedProducts.forEach(product => {
      if(product.id === productId){
         orderContents.innerHTML = `
         <h1>Arriving on ${product.shippingDate}</h1>
         <div class="order-details">
            <p>${product.name}</p>
            <p>Quantity: ${product.quantity}</p>
            </div>
            <img src="./${product.image}" alt="" width="200">
         `
      }
   })
}

displayProduct()

console.log(orderContents)