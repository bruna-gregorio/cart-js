const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

function onLoadCart() {
  const numberCart = document.querySelector(".number-cart")

  numberCart.innerText = carrinho.length
}

onLoadCart()

function showItensCart() {
  const tableProduct = document.querySelector(".tableProduct")
  tableProduct.innerHTML = carrinho.map(car => {
    return `
      <tr>
        <td class="imgProd">
          <img src="${car.image}" alt="" class="imgProduct">
        </td>
        <td>
          <p>${car.name}</p>
          <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}</span>
        </td>
        <td>
          <span>${car.amount}</span>
        </td>
        <td>
          <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price * car.amount)}</span>
        </td>
        <td>
          <img src="./assets/trash.svg" alt="deletar" onclick="handleRemoveCartProduct(${car.id})" class="delete">
        </td>
      </tr>
    `
  }).join('')
}

showItensCart()

function handleAddCart(id) {
  const product = products.find(item => item.id === id)

  const item = carrinho.find(prod => prod.id === product.id)
  if (item) {
    item.amount += 1
    localStorage.setItem("carrinho", JSON.stringify(carrinho))
    showItensCart()
    totalValue()
    return
  }
  carrinho.push(product)
  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  showItensCart()
  onLoadCart()
  totalValue()
}


function handleRemoveCartProduct(id) {
  const itemIndex = carrinho.findIndex(item => item.id === id)

  carrinho.splice(itemIndex, 1)
  itemIndex.amount = 0
  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  showItensCart()
  onLoadCart()
  totalValue()
}


function reduceCart(id) {
  const product = products.find(item => item.id === id)
  const item = carrinho.find(prod => prod.id === product.id)

  item.amount -= 1
  if (item.amount < 1) {
    item.amount = 1
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  showItensCart()
  totalValue()
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




const cepNumber = document.querySelector(".cep")
cepNumber.oninput = function () {
  if (this.value.length > 8) {
    this.value = this.value.slice(0, 8);
  }
}

function consultarCep() {
  const cepNumber = document.querySelector(".cep")
  let number = cepNumber.value
  console.log(number);

  if (number === '' || number.length < 8) {
    alert('Digite um CEP valido!')
    cepNumber.value = ''
  } else {
    const i = carrinho.map(carrinho => carrinho.price * carrinho.amount)
    sum = i.reduce((total, value) => {
      return total + value
    }, Math.random() * 4.50)

    const calculoFrete = document.querySelector(".calculo-frete")
    calculoFrete.innerHTML = `
    <h3>Total com Frete:</h3>
    <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sum)}</span>
    `
    cepNumber.value = ''
  }
}
