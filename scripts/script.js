const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

const products = []

async function getData() {
  const response = await fetch("http://localhost:3333/products")
  const data = await response.json()
  products.push(...data)

  render(products)
}

async function filter(category) {
  if (!category) {
    return render(products)
  }

  const productsFilter = products.filter(item => item.category === category)
  return render(productsFilter)
}

getData()



// function changeClass(buttonToActivate) {
//   let buttons = document.querySelectorAll(".color-span")

//   buttons.forEach(function (btn) {
//     btn.classList.remove('active');
//   });

//   buttonToActivate.classList.toggle('active');
// }

// function filterColor(elm, color) {
//   let noFilter = document.querySelector(".no-filter")

//   if (!color) {
//     noFilter.style.display = 'none'

//     return render(products)
//   }

//   // changeClass(elm)

//   noFilter.style.display = 'block'

//   const productsFilter = products.filter(item => item.color === color)
//   return render(productsFilter)
// }

// function toggleClass(buttons, buttonToActivate) {
//   buttons.forEach(function (btn) {
//     btn.classList.remove('active');
//   });
//   buttonToActivate.classList.add('active');
// }
let buttons = document.querySelectorAll(".color-span")

buttons.forEach(function (button) {
  button.addEventListener('click', function () {
    toggleClass(buttons, this);
  });
});

function toggleClass(buttons, buttonToActivate) {
  buttons.forEach(function (btn) {
    btn.classList.remove('active');
  });
  buttonToActivate.classList.add('active');
}

function filterColor(color) {
  let noFilter = document.querySelector(".no-filter")
  let buttons = document.querySelectorAll(".color-span")

  if (!color) {
    noFilter.style.display = 'none'

    buttons.forEach(function (btn) {
      btn.classList.remove('active');
    });

    return render(products)
  }

  noFilter.style.display = 'block'

  const productsFilter = products.filter(item => item.color === color)
  return render(productsFilter)
}


async function render(data) {
  const productsContainer = document.querySelector(".products")
  productsContainer.innerHTML = data.map(item => {
    let amount = numberProductOnCart(item.id)
    return `
      <div class="card" onclick="singleProductDetails(${item.id})">
          <img src="${item.image}" alt="imagem">
          <h2>${item.name}</h2>
          <p>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
          <button class="btn">
            <div class="btnCart">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="numberProductOnCart">${amount}</span>
            </div>
            <div class="btnBuy">
              Comprar
            </div>
          </button>
      </div>
    `
  }).join('')
}


function onLoadCart() {
  const numberCart = document.querySelector(".number-cart")

  numberCart.innerText = carrinho.length
}

onLoadCart()

function showItensCart() {
  const cartShopping = document.querySelector(".cart-shopping")
  const totalValue = document.querySelector(".total-value")
  const concludeBuy = document.querySelector(".concludeBuy")

  if (carrinho.length === 0) {
    messageCartEmpty()
  } else {
    totalValue.style.display = 'flex'
    concludeBuy.style.display = 'flex'

    cartShopping.innerHTML = carrinho.map(car => {
      return `
          <div class="productOne">
              <img src="${car.image}" alt="" class="imgProduct">
              <div class="info">
                <p>${car.name}</p>
                <span class="price">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}</span>
                <span class="qtd">Qtd: <button onclick="reduceCart(${car.id})" class="btnLess">-</button>${car.amount}<button onclick="handleAddCart(${car.id})">+</button></span>
              </div>
              <div class="subtotal">
                <p>Subtotal</p>
                <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.amount * car.price)}</span>
              </div>
              <img src="./assets/trash.svg" alt="deletar" onclick="handleRemoveCartProduct(${car.id})" class="delete">
          </div>
      `
    }).join('')
  }
}

showItensCart()

function handleAddCart(id) {
  const product = products.find(item => item.id === id)

  const item = carrinho.find(prod => prod.id === product.id)
  if (item) {
    item.amount += 1
    localStorage.setItem("carrinho", JSON.stringify(carrinho))

    toastShow()
    showItensCart()
    totalValue()
    render(products)
    return
  }
  carrinho.push(product)
  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  toastShow()
  showItensCart()
  onLoadCart()
  totalValue()
  render(products)
}


function handleRemoveCartProduct(id) {
  const itemIndex = carrinho.findIndex(item => item.id === id)

  carrinho.splice(itemIndex, 1)
  itemIndex.amount = 0
  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  showItensCart()
  onLoadCart()
  totalValue()
  render(products)
}


function reduceCart(id) {
  const product = products.find(item => item.id === id)
  const item = carrinho.find(prod => prod.id === product.id)

  item.amount -= 1
  if (item.amount < 1) {
    item.amount = 1

    document.querySelector(".btnLess").disabled = true
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  showItensCart()
  totalValue()
  render(products)
}



function totalValue() {
  const i = carrinho.map(carrinho => carrinho.price * carrinho.amount)
  sum = i.reduce((total, value) => {
    return total + value
  }, 0)

  const totalValue = document.querySelector(".total-value")
  totalValue.innerHTML = `
    <h3>Total:</h3>
    <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sum)}</span>
  `
}

totalValue()



function numberProductOnCart(id) {
  const item = carrinho.find(prod => prod.id === id)

  if (!item) {
    return 0
  }
  return item.amount
}


function pricesInAscendingOrder() {
  const orderedProducts = products.sort((a, b) => {
    if (a.price > b.price) {
      return 1;
    }
    if (a.price < b.price) {
      return -1;
    }
    return 0;
  })
  render(orderedProducts)
}

function pricesInDecreasingOrder() {
  const orderedProducts = products.sort((a, b) => {
    if (a.price > b.price) {
      return -1;
    }
    if (a.price < b.price) {
      return 1;
    }
    return 0;
  })
  render(orderedProducts)
}

function orderPriceLessThan100() {
  const orderedProducts = products.filter(item => item.price <= 100)

  if (orderedProducts.length === 0) {
    messageProductNotFound()
  } else {
    render(orderedProducts)
  }
}

function orderPriceBetween100and200() {
  const orderedProducts = products.filter(item => (item.price >= 100 && item.price <= 200))

  if (orderedProducts.length === 0) {
    messageProductNotFound()
  } else {
    render(orderedProducts)
  }
}

function orderPriceBetween200and300() {
  const orderedProducts = products.filter(item => (item.price >= 200 && item.price <= 300))

  if (orderedProducts.length === 0) {
    messageProductNotFound()
  } else {
    render(orderedProducts)
  }
}

function orderPriceBetween300and400() {
  const orderedProducts = products.filter(item => (item.price >= 300 && item.price <= 400))

  if (orderedProducts.length === 0) {
    messageProductNotFound()
  } else {
    render(orderedProducts)
  }
}

function orderPriceAbove400() {
  const orderedProducts = products.filter(item => item.price >= 400)

  if (orderedProducts.length === 0) {
    messageProductNotFound()
  } else {
    render(orderedProducts)
  }
}


function messageProductNotFound() {
  const productsContainer = document.querySelector(".products")
  productsContainer.innerHTML = `
    <div class="message-not-found">
      <img src="./assets/search.svg" alt="">
      <p>Desculpa, nenhum produto com esse filtro foi encontrado!</p>
    </div>
  `
}


function toastShow() {
  messageContainer = document.querySelector(".message-sucess")
  messageContainer.classList.add("message-sucess--visible")

  setTimeout(function () {
    messageContainer.classList.remove("message-sucess--visible")
  }, 3000)
}

function messageCartEmpty() {
  const cartShopping = document.querySelector(".cart-shopping")
  cartShopping.innerHTML = `
    <div class="messageEmpty">
      <p>O carrinho está vazio!</p>
      <button onclick="Aside.close()">Começar a comprar</button>
    </div>
  `

  const totalValue = document.querySelector(".total-value")
  totalValue.style.display = 'none'

  const concludeBuy = document.querySelector(".concludeBuy")
  concludeBuy.style.display = 'none'
}



function singleProductDetails(id) {
  const open = document.querySelector(".modal-overlay").classList.add("active")
  const product = products.find(item => item.id === id)

  console.log(product)

  const prodSingleModal = document.querySelector(".modal-overlay")
  prodSingleModal.innerHTML = `
    <div class="modal">
      <div class="imgBx">
        <div class="photos">
          <div class="btn-image" onclick="changeImage(${JSON.stringify(product.image).split('"').join("&quot;")})">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="btn-image" onclick="changeImage(${JSON.stringify(product.photo2).split('"').join("&quot;")})">
            <img src="${product.photo2}" alt="${product.name}">
          </div>
          <div class="btn-image" onclick="changeImage(${JSON.stringify(product.photo3).split('"').join("&quot;")})">
            <img src="${product.photo3}" alt="${product.name}">
          </div>
          <div class="btn-image" onclick="changeImage(${JSON.stringify(product.photo4).split('"').join("&quot;")})">
            <img src="${product.photo4}" alt="${product.name}">
          </div>
        </div>
        <div class="image">
          <img src="${product.image}" alt="${product.name}" id="changedImg">
        </div>
      </div>

      <div class="product-details">
        <img src="./assets/x.svg" alt="" onclick="Modal.close()" class="close">
        <h1>${product.name}</h1>
        <p class="price">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>

        <p class="description">${product.description}</p>

        <div class="color">
          <h3>Cor :</h3>
          <span>${product.color}</span>
        </div>

        <div class="btnAdd">
          <button onclick="handleAddCart(${product.id})">Adicionar no carrinho</button>
        </div>
      </div>
    </div>
  `
}

function changeImage(image) {
  document.querySelector("#changedImg").src = image
}

