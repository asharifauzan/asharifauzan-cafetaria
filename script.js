const makanan = {
  mieAyam       : ['Mie Ayam', 10000],
  ayamGeprek    : ['Ayam Geprek', 15000],
  burgerCheese  : ['Burger Cheese', 17000],
  kerangDara    : ['Kerang Dara', 20000],
  bistikSapi    : ['Bistik Sapi', 23000]
}
const minuman = {
  esTehManis  : ['Es Teh Manis', 3000],
  esJeruk     : ['Es Jeruk', 3000],
  fanta       : ['Fanta', 5000],
  cocaCola    : ['Coca Cola', 5000]
}
let order     = {};

function loadMenu() {
  // load makanan
  Object.entries(makanan).map(([key, value]) => {
    document.getElementsByClassName('makanan')[0]
    .innerHTML += `<div class='menu'>
                      <div>
                          <h1>${value[0]}</h1>
                          <span>${value[1]}</span>
                      </div>
                      <div class='counter'>
                        <button class='btn minus hide' type='button'>-</button>
                        <p class='quantity'>0</p>
                        <button class='btn plus' type='button'>+</button>
                      </div>
                  </div>`;
  });
  // load minuman
  Object.entries(minuman).map(([key, value]) => {
    document.getElementsByClassName('minuman')[0]
    .innerHTML += `<div class='menu'>
                      <div>
                          <h1>${value[0]}</h1>
                          <span>${value[1]}</span>
                      </div>
                      <div class='counter'>
                        <button class='btn minus hide' type='button'>-</button>
                        <p class='quantity'>0</p>
                        <button class='btn plus' type='button'>+</button>
                      </div>
                  </div>`;
  });
}

function setQuantity() {
  let quantity   = document.getElementsByClassName('quantity');
  let counter    = document.getElementsByClassName('counter');
  let orderName  = document.querySelectorAll('.menu > div > h1');
  let orderPrice = document.querySelectorAll('.menu > div > span');
  for(let i = 0; i < counter.length; i++) {
    counter[i].addEventListener('click', function(e){
      let target = e.target;
      let currQuantity = parseInt(quantity[i].innerHTML);
      // add or substract quantity of order
      if(target.className == 'btn plus'){
        currQuantity += 1;
      } else if(target.className == 'btn minus' || target.className == 'btn minus hide') {
        currQuantity -= 1;
      }
      // set order
      order[orderName[i].innerHTML] = [parseInt(orderPrice[i].innerHTML), currQuantity];
      // minus button will be disabled if quantity is 0 or less
      document.getElementsByClassName('quantity')[i].innerHTML = currQuantity;
      if(currQuantity > 0) {
        document.getElementsByClassName('minus')[i].classList.remove('hide');
      } else {
        document.getElementsByClassName('minus')[i].classList.add('hide');
      }
    });
  }
}

function setOrder() {
  document.getElementById('order')
  .addEventListener('click', function(){
    let totalPrice = 0;
    let orderDetail = Object.entries(order).map(([key, value]) => {
      totalPrice += value[0] * value[1];
      return `${key}: (${value[1]} x ${value[0]})\n`;
    });
    if (totalPrice > 0) {
      displayOrder(orderDetail, totalPrice);
      sendMessages(orderDetail, totalPrice);
    }
  });
}

// display order list & total price
function displayOrder(orderDetail, totalPrice){
  let orderWrapper = document.getElementById('order-status');
  let orderTitle = "<h1>Here are your order</h1>";
  let orderList = '<ul>';
  for(let i = 0; i < orderDetail.length; i++) {
    orderList += `<li>${orderDetail[i]}</li>`;
  }
  orderList += '</ul>';
  orderList += `<span>Total Price: Rp. ${totalPrice}</span>`;
  orderWrapper.innerHTML = orderTitle + orderList;
  orderWrapper.classList.remove('hide');
}

function sendMessages(orderDetail, totalPrice){
  if (!liff.isInClient()) {
      alert("sent message only works in LINE in-app browser.")
  } else {
    let msg = getOrderList(orderDetail, totalPrice);
    liff.sendMessages([{
        'type': 'text',
        'text': msg
    }]).then(function() {
        alert('Pesan terkirim');
    }).catch(function(error) {
        alert('Aduh kok error ya...');
    });
  }
}

function getOrderList(orderDetail, totalPrice){
  let msg = "Hai, we are preparing your orders.\n\n";
  for(let i=0; i < orderDetail.length; i++){
    msg += orderDetail[i];
  }
  msg += `\nTotal Price: Rp. ${totalPrice}`;
  return msg;
}

loadMenu();
setQuantity();
setOrder();
