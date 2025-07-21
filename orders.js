const orderedProductss = JSON.parse(localStorage.getItem('orderedProducts'))
const cartProducts = JSON.parse(localStorage.getItem('cartProducts'))
let totalPriceTax = JSON.parse(localStorage.getItem('totalPriceTax'))
const orderLists = document.querySelector('.orders-product .orders-container .orders-contents')
const orderHeading = document.querySelector('.orders-product .orders-container .order-heading')
const currentProductDateOrdered = localStorage.getItem('currentProductDateOrdered')
const cartCount = localStorage.getItem('cartCount')

function displayAllProducts(filteredProducts = []){
    const isProductsEmpty = filteredProducts.length > 0 ? filteredProducts : orderedProductss.orderedProducts
    orderLists.innerHTML = ""

    isProductsEmpty.forEach(orderedProduct => {
        orderLists.innerHTML += `
         <div class="order-product" data-id=${orderedProduct.id}>
            <div class="order-product-description">
                <div class="order-product-image">
                    <img src="${orderedProduct.image}" alt="product" width="160">
                </div>
                <div class="order-product-details">
                    <h3>${orderedProduct.name.length > 60 ? orderedProduct.name.slice(0, 61) + "..." : orderedProduct.name}</h3>
                    <p>Arriving on: ${orderedProduct.shippingDate}</p>
                    <span>Quantity: ${orderedProduct.quantity}</span>
                    <button><span class="material-symbols-outlined">shopping_bag</span>Buy it again</button>
                </div>
                </div>
                    <div class="order-track-package">
                        <button>Track package</button>
                    </div>
                </div>
        `
    });
}

function displayDatePrice(){
    orderHeading.querySelector('.order-date-price .order-date span').textContent = `${currentProductDateOrdered.slice(currentProductDateOrdered.indexOf(',') + 1, currentProductDateOrdered.lastIndexOf(",")).trim() ?? "No date published."}`
    orderHeading.querySelector('.order-date-price .order-price span').textContent = `$${totalPriceTax ?? 0}`
    document.querySelector('header .cart span:nth-child(2)').textContent = `${cartCount ?? 0}`
    orderHeading.querySelector('.order-id span:nth-child(2)').textContent = `$${orderedProductss.orderId}`
}

displayDatePrice()

displayAllProducts()

orderLists.addEventListener('click', e => {
    if(e.target.tagName === "BUTTON" && e.target.textContent == 'shopping_bagBuy it again'){
        const products = orderedProductss.orderedProducts
        const id = parseInt(e.target.closest('.order-product').dataset.id)
        let getProduct = products.find(product => product.id === id)
        let getCartProduct = JSON.parse(localStorage.getItem('cartProducts'))
        let updateQuantityCartProduct = getCartProduct.find(product => product.id === id)
        updateQuantityCartProduct.quantity+=1;
        getProduct.quantity+=1;
        if(getProduct.quantity > 5 && updateQuantityCartProduct.quantity > 5){
            updateQuantityCartProduct.quantity = 1;
        getProduct.quantity = 1;
        alert('the limit has been exceeded.')
        
        }
         const getAllShippingFeeTotal = orderedProductss.orderedProducts.reduce((acc, {shippingFee}) => acc + shippingFee , 0)
        const priceTotal = orderedProductss.orderedProducts.reduce((acc, {price, quantity}) => (acc + price) * quantity, 0)
        const calculatePriceTax = (getAllShippingFeeTotal + priceTotal)
         const estimatedPriceTax = ((priceTotal + getAllShippingFeeTotal) * 0.1)
         const updatingtotalPriceTax = (calculatePriceTax + estimatedPriceTax).toFixed(2)
         totalPriceTax = updatingtotalPriceTax
        localStorage.setItem('totalPriceTax', totalPriceTax)
        localStorage.setItem('cartProducts', JSON.stringify(getCartProduct))
        localStorage.setItem('orderedProducts', JSON.stringify(orderedProductss))
        displayAllProducts()
        displayDatePrice()
        console.log(JSON.parse(localStorage.getItem('cartProducts')))
        
    }

    if(e.target.tagName === 'BUTTON' && e.target.textContent === 'Track package'){
       const id = parseInt(e.target.closest('.order-product').dataset.id)

       window.location.href = `./tracking.html?orderId=${orderedProductss.orderId}&productId=${id}`
    }
})

document.querySelector('header .search-input input').addEventListener('input', e => {
    const searchProduct = e.target.value.trim()
    const filteredProducts = orderedProductss.orderedProducts.filter(product => product.name.toLowerCase().includes(searchProduct))
    displayAllProducts(filteredProducts)
})