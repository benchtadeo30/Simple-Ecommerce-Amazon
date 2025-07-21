let cartProducts = JSON.parse(localStorage.getItem('cartProducts'))
const products = JSON.parse(localStorage.getItem('products'))
const orderLists = document.querySelector('.orders .order-container .order-review-lists')
const orderSummary = document.querySelector('.orders .order-container .order-summary')
const s = new Date();

function displayAllOrders(){
    const date1 = new Date();
    const date2 = new Date();
    const date3 = new Date();

    date1.setDate(date1.getDate() + 10);
    date2.setDate(date2.getDate() + 5);
    date3.setDate(date2.getDate() + 2);

    const freeShipping = date1.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: 'numeric'
    });

    const shipping1 = date2.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: 'numeric'
    });

     const shipping2 = date3.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: 'numeric'
    });

    orderLists.innerHTML = ""

    cartProducts.forEach(cartProduct => {
        orderLists.innerHTML += `
        <div class="order-card" data-id="${cartProduct.id}">
                    <div class="order-details">
                      <div class="order-delivery-date">Delivery date: ${freeShipping.slice(0, freeShipping.lastIndexOf(",")).trim()}</div>
                       <div class="order-delivery-details">
                         <img src="./${cartProduct.image}" alt="" width="200">
                            <div class="order-description">
                                <h4>${cartProduct.name.length > 40 ? cartProduct.name.slice(0,41) + '...' : cartProduct.name}</h4>
                                <span>$${cartProduct.price}</span>
                                <div class="order-quantity-btns">
                                    <p>Quantity: <span>${cartProduct.quantity}</span></p>
                                    <div class="order-buttons">
                                        <button>Update</button>
                                        <button>Delete</button>
                                    </div>
                                </div>
                            </div>
                       </div>
                    </div>
                    <div class="order-delivery-options">
                        <h2>Choose a delivery option:</h2>
                        <div class="order-choose-option">
                            <label class="order-options" data-id=${cartProduct.id}>
                            <input type="radio" value="0" name="order${cartProduct.id}" ${cartProduct.shippingFee === 0 ? 'checked' : ''}>
                            <div class="order-options-details">
                                <p>${freeShipping.slice(0, freeShipping.lastIndexOf(",")).trim()}</p>
                                <span>FREE Shipping</span>
                            </div>
                        </label>
                        <label class="order-options" data-id=${cartProduct.id}>
                            <input type="radio" value="4.99" name="order${cartProduct.id}" ${cartProduct.shippingFee === 4.99 ? 'checked' : ''}>
                            <div class="order-options-details">
                                <p>${shipping1.slice(0, shipping1.lastIndexOf(",")).trim()}</p>
                                <span>$4.99 - Shipping</span>
                            </div>
                        </label>
                        <label class="order-options" data-id=${cartProduct.id}>
                            <input type="radio" value="9.99" name="order${cartProduct.id}" ${cartProduct.shippingFee === 9.99 ? 'checked' : ''}>
                            <div class="order-options-details">
                                <p>${shipping2.slice(0, shipping2.lastIndexOf(",")).trim()}</p>
                                <span>$9.99 - Shipping</span>
                            </div>
                        </label>
                        </div>
                    </div>
                </div>
        `
    });

     const priceTotal = cartProducts.reduce((acc, {price, quantity}) => (acc + price) * quantity, 0)
     const shippingFee = cartProducts.reduce((acc, curr) => acc + curr.shippingFee, 0)
     const calculatePrice = (priceTotal + shippingFee)
     const estimatedPriceTax = ((priceTotal + shippingFee) * 0.1)
     const totalPriceTax = (calculatePrice + estimatedPriceTax).toFixed(2)
      orderSummary.querySelector('.order-summary-details .order-summary-details-shiptotal .order-summary-details-items span:nth-child(2)').textContent = `$${priceTotal.toFixed(2)}`
    orderSummary.querySelector('.order-summary-details .order-summary-taxtotal .order-summary-details-tax span:nth-child(2)').textContent = `$${calculatePrice.toFixed(2)}`
    orderSummary.querySelector('.order-summary-details .order-summary-details-shiptotal .order-summary-details-shipping-handling span:nth-child(2)').textContent = `$${shippingFee.toFixed(2)}`
     orderSummary.querySelector('.order-summary-details .order-summary-taxtotal .order-summary-details-estimated-tax span:nth-child(2)').textContent = `$${estimatedPriceTax.toFixed(2)}`
    orderSummary.querySelector('.order-summary-details .order-summary-total span:nth-child(2)').textContent = `$${totalPriceTax}`
    document.querySelector('header .checkout p').textContent = `${cartProducts.length} items`
    localStorage.setItem('totalPriceTax', totalPriceTax)
    }

displayAllOrders()


orderLists.addEventListener('click', e => {
    if(e.target.matches('button')){
        const id = parseInt(e.target.closest('.order-card').dataset.id)
        const updateProduct = cartProducts.find(product => product.id === id)
        const updateAllProducts = products.find(product => product.id === id)

       if(e.target.textContent === 'Update'){
        if(updateProduct){
            const inputQuantity = document.createElement('select')
            inputQuantity.id = 'quantity'
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement('option')
                option.value = i
                option.textContent = i
                inputQuantity.appendChild(option)
            }
            inputQuantity.value = e.target.closest('.order-quantity-btns').querySelector('span').textContent
            e.target.textContent = 'Save'
            e.target.closest('.order-quantity-btns').querySelector('span').replaceWith(inputQuantity)
            
        }else{
            alert('Cannot find a product.')
        }
       }else if(e.target.textContent === 'Save'){
            e.target.textContent = 'Update'
            const quanVal = parseInt(e.target.closest('.order-quantity-btns').querySelector('select').value)
            updateProduct.quantity = quanVal
            updateAllProducts.quantity = quanVal
            const QuantityValue = document.createElement('span')
            QuantityValue.textContent = quanVal
            e.target.closest('.order-quantity-btns').querySelector('select').replaceWith(QuantityValue)
            alert('Product Updated Successfully!')
            displayAllOrders()
       }else if(e.target.textContent === 'Delete'){
        const isDeleted = confirm("Are you sure you want to delete this item?")

        if(isDeleted){
            cartProducts = cartProducts.filter(product => product.id !== id)
        localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
        let cartCount = parseInt(localStorage.getItem('cartCount'))
        const productId = JSON.parse(localStorage.getItem('productId'))
        const filteredProductId = productId.filter(product => product !== id)
        cartCount-=1;
        updateAllProducts.quantity = 1
        localStorage.setItem('cartCount', cartCount)
        localStorage.setItem('productId', JSON.stringify(filteredProductId))
        console.log(localStorage.getItem('cartCount'), JSON.parse(localStorage.getItem('productId')))
        alert('Product has been deleted successfully.')
        displayAllOrders()
        }else{
            alert('Delete Cancelled.')
        }
       }

       localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
       localStorage.setItem('products', JSON.stringify(products))
       console.log(JSON.parse(localStorage.getItem('products')))
    }

    if(e.target.matches('input[type="radio"]')){
      const date = e.target.closest('.order-options').querySelector('p').textContent
      e.target.closest('.order-card').querySelector('.order-details .order-delivery-date').textContent = `Delivery date: ${date}`
      const option = e.target.closest('.order-options').querySelector('span').textContent
     const shippingFee = isNaN(parseFloat(option.slice(1, option.indexOf(" ")))) ? 0 : parseFloat(option.slice(1, option.indexOf(" ")))
        orderSummary.querySelector('.order-summary-details .order-summary-details-shiptotal .order-summary-details-shipping-handling span:nth-child(2)').textContent = `$${shippingFee.toFixed(2)}`
        const id = parseInt(e.target.closest('.order-card').dataset.id)
        const updateShippingFee = cartProducts.find(product => product.id === id)
        if(updateShippingFee){
        updateShippingFee.shippingFee = shippingFee
        const getAllShippingFeeTotal = cartProducts.reduce((acc, {shippingFee}) => acc + shippingFee , 0)
        const priceTotal = cartProducts.reduce((acc, {price, quantity}) => (acc + price) * quantity, 0)
        localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
        const calculatePriceTax = (getAllShippingFeeTotal + priceTotal)
        const estimatedPriceTax = ((priceTotal + getAllShippingFeeTotal) * 0.1)
        const totalPriceTax = (calculatePriceTax + estimatedPriceTax).toFixed(2)
        orderSummary.querySelector('.order-summary-details .order-summary-details-shiptotal .order-summary-details-shipping-handling span:nth-child(2)').textContent = `$${cartProducts.reduce((acc, curr) => acc + curr.shippingFee, 0).toFixed(2)}`
        orderSummary.querySelector('.order-summary-details .order-summary-taxtotal .order-summary-details-tax span:nth-child(2)').textContent = `$${calculatePriceTax.toFixed(2)}`
        orderSummary.querySelector('.order-summary-details .order-summary-taxtotal .order-summary-details-estimated-tax span:nth-child(2)').textContent = `$${estimatedPriceTax.toFixed(2)}`
         orderSummary.querySelector('.order-summary-details .order-summary-total span:nth-child(2)').textContent = `$${totalPriceTax}`
         localStorage.setItem('totalPriceTax', totalPriceTax)
        }
       
    }
})
function randomId(length){
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+"
    let result = ""
    for (let i = 1; i <= length; i++) {
        result += chars[Math.floor(Math.random() * length)]
    }
    return result
}

let orderedProducts = {orderId: randomId(40), orderedProducts: []};
console.log(orderedProducts)
orderSummary.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
      const optionsDate = document.querySelectorAll('.orders .order-container .order-review-lists .order-card .order-delivery-options .order-choose-option .order-options input')
      optionsDate.forEach((options, index) => {
        if(options.checked) {
        const dateSelected = options.closest('.order-options').querySelector('.order-options-details p').textContent
        const id = parseInt(options.closest('.order-options').dataset.id)
        cartProducts.forEach(product => {
            if(product.id === id) product['shippingDate'] = dateSelected
        })
        orderedProducts.orderedProducts = cartProducts.map(product => ({...product}))
        localStorage.setItem('orderedProducts', JSON.stringify(orderedProducts))

        const currentProductDateOrdered = dayjs().format('dddd, MMMM D, YYYY hh:mm:ss')
        localStorage.setItem('currentProductDateOrdered', currentProductDateOrdered)
        }
      })
      alert('Ordered Successfully!')
      window.location.href = "./orders.html"
    }
})