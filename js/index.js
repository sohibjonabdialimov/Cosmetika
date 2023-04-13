let allBooks = [];
let allBooks1 = [];
const pagesLists = document.getElementById('pagesLists');
const pagesLists1 = document.getElementById('pagesLists1');
// Pagination
let url = new URLSearchParams(window.location.search);
let step = 4;
let page = url.get('page') || 1;

let url1 = new URLSearchParams(window.location.search);
let step1 = 4;
let page1 = url.get('page1') || 1;
let productArray = [];
let onsaleArray = [];
let upcomeArray = [];
const header__cart = document.getElementById('header__cart');
let addToCartNumberArr = JSON.parse(localStorage.getItem('addToCartNumberArr')) || [];

function getAllBooks() {
  fetch('https://cosmetika-58c07-default-rtdb.firebaseio.com/cosmetika.json').then(res => {
      if (!res.ok) throw new Error('Xatolik bor')
      return res.json();
    })
    .then(res => {
      allBooks = Object.keys(res || {}).map(item => {
        return {
          ...res[item],
          id: item,
          ok: +Math.random().toFixed(15),
        }
      })
      productArray = allBooks.filter(item => {
        return item.category === 'new';
      });
      onsaleArray = allBooks.filter(item => {
        return item.category === 'onsale';
      });
      upcomeArray = allBooks.filter(item => {
        return item.category === 'upcome';
      });

      renderPagination(productArray.length);
      renderHtmlElements(choppedPagination(productArray));
    }).catch(err => {
      console.log(err.message);
    }).finally(() => {})
}

document.getElementById('newProducts').addEventListener('click', () => {
  page = url.get('page') || 1;
  searchElements(page);
  renderPagination(productArray.length);
  renderHtmlElements(choppedPagination(productArray));
})
document.getElementById('onsale').addEventListener('click', () => {
  page = url.get('page') || 1;
  searchElements(page);
  renderPagination(onsaleArray.length);
  renderHtmlElements(choppedPagination(onsaleArray));
})
document.getElementById('soon').addEventListener('click', () => {
  page = url.get('page') || 1;
  searchElements(page);
  renderPagination(upcomeArray.length);
  renderHtmlElements(choppedPagination(upcomeArray));
})


function getAllBooks1() {
  fetch('https://cosmetika-58c07-default-rtdb.firebaseio.com/cosmetika.json').then(res => {
      if (!res.ok) throw new Error('Xatolik bor')
      return res.json();
    })
    .then(res => {
      allBooks1 = Object.keys(res || {}).map(item => {
        return {
          ...res[item],
          id: item,
          ok: +Math.random().toFixed(15),
        }
      })
      renderPagination1(allBooks1.length);
      renderHtmlElements1(choppedPagination1(allBooks1));
    }).catch(err => {
      console.log(err.message);
    }).finally(() => {
      // loading.style.display = 'none';
    })
}
getAllBooks();
getAllBooks1();

function renderHtmlElements(books) {
  let result = books.map((item, index) => {
    let element = `
    <div class="product__card">
          <img src="${item.img__url}" alt="">
          <div class="product__desc">
            <h4>${item.title}</h4>
            <div class="cart__success">
              <h4 id="product__price">$${item.cost}</h4>
              <div class="cart__cicrle" onclick="addToCartNumberFunc(${item.ok})">
                <ion-icon name="add-circle-outline"></ion-icon>
              </div>
              <div class="cart__plus__minus">
                <button class="cartAddMinus" onclick="decrement(${item.ok})">-</button>
                <button class="cartAddValue" id="${item.id}">1</button>
                <button class="cartAddPlus" onclick="increment(${item.ok})">+</button>
              </div>
            </div>
          </div>
          <div id="cart__mark">${item.category}</div>
        </div>
    `

    return element;
  }).join(' ');
  document.querySelector('.products__cards').innerHTML = result;
}



// Plus Minus ni hisoblash
let selectedCartLists = JSON.parse(localStorage.getItem('selectedCartLists')) || [];

// selectedCartLists.forEach(item => {
//   console.log(document.getElementById(`#${item.id}`).parentNode);
//   document.getElementById(`#${item.id}`)?.parentNode.classList.add('addCardPlusMinus');
//   document.getElementById(`#${item.id}`)?.parentElement.previousElementSibling.classList.add('deleteCardCircle');

// })

function increment(ok) {
  let findedElement = allBooks.find(item => {
    return item.ok === ok;
  })
  let count = JSON.parse(localStorage.getItem('selectedCartLists'))?.find(item => item.ok == findedElement.ok)?.count || 1;

  count += 1;
  let obj = {
    ok: ok,
    id: findedElement.id,
    title: findedElement.title,
    img__url: findedElement.img__url,
    cost: findedElement.cost,
    count: count
  }
  selectedCartLists = selectedCartLists.filter(item => item.id !== obj.id);
  selectedCartLists.push(obj);
  localStorage.setItem('selectedCartLists', JSON.stringify(selectedCartLists));
  document.querySelector(`#${findedElement.id}`).innerHTML = selectedCartLists.find(item => item.id == findedElement.id).count;
  header__cart.innerHTML = selectedCartLists.length;
}

function decrement(ok) {
  let findedElement = allBooks.find(item => {
    return item.ok === ok;
  })
  let count = JSON.parse(localStorage.getItem('selectedCartLists')).find(item => item.ok == findedElement.ok)?.count || 1;
  count -= 1;
  let obj = {
    ok: ok,
    id: findedElement.id,
    title: findedElement.title,
    img__url: findedElement.img__url,
    cost: findedElement.cost,
    count: count
  }

  document.querySelector(`#${obj.id}`);
  if (count == 0) {
    document.querySelector(`#${obj.id}`).parentElement.classList.remove('addCardPlusMinus');
    document.querySelector(`#${obj.id}`).parentElement.previousElementSibling.classList.remove('deleteCardCircle');
  }

  selectedCartLists = selectedCartLists.filter(item => item.id !== obj.id);
  selectedCartLists.push(obj);
  selectedCartLists = selectedCartLists.filter(item => item.count !== 0);
  if (count == 0) {
    count = 1;
  }
  localStorage.setItem('selectedCartLists', JSON.stringify(selectedCartLists));
  document.querySelector(`#${obj.id}`).innerHTML = obj.count;

  header__cart.innerHTML = selectedCartLists.length; 
}

// function plusMinusFunc(selectedCartLists) {
//   selectedCartLists?.forEach(item => {
//     document.querySelector(`#${item.id}`)?.parentElement.classList.add('addCardPlusMinus');
//     document.querySelector(`#${item.id}`)?.parentElement.previousElementSibling.classList.add('deleteCardCircle');
//     renderPagination(productArray.length);
//     renderHtmlElements(choppedPagination(productArray));
//   })
// }
// console.log(selectedCartLists);
// plusMinusFunc(JSON.parse(localStorage.getItem('selectedCartLists')));



function addToCartNumberFunc(ok) {
  document.querySelectorAll('.cart__cicrle').forEach(item => {
    item.addEventListener('click', () => {
      item?.nextElementSibling?.classList?.add('addCardPlusMinus');
      item.classList.add('deleteCardCircle');
    })
  })
}


function renderHtmlElements1(books) {

  let result = books.map((item, index) => {

    let d = new Date(item.published__date);

    let datestring = (d.getDate() <= 9 ? ('0' + d.getDate()) :
        (d.getDate())) +
      "." +
      ((d.getMonth() + 1) <= 9 ? ('0' + ((d.getMonth() + 1))) : (d.getMonth() + 1)) +
      "." +
      d.getFullYear();

    let element = `
    <div class="blog__cart">
          <img src="${item.img__url}" alt="">
          <div class="blog__desc">
            <span id="fashion">${item.category}</span>
            <h4>${item.title}</h4>
            <p>${item.author} by <span>HasTech</span> ${datestring}</p>
          </div>
        </div>
    `

    return element;
  }).join(' ');
  document.querySelector('.blogs__carts').innerHTML = result;
}


// Pagination 0
function renderPagination(length) {
  let result = '';
  let pageNumber = Math.ceil(length / step);
  localStorage.setItem('key', JSON.stringify(page));
  localStorage.setItem('page', JSON.stringify('page-active'));

  for (let i = 0; i < pageNumber; i++) {
    result += `
      <li class="page__list">
        <button class="page-btn">${i + 1}</button>
      </li>
    `;
  }

  pagesLists.innerHTML = result;
  for (let i = 0; i < Array.from(document.querySelectorAll('.page-btn')).length; i++) {
    document.querySelectorAll('.page-btn').forEach(item => {
      item.classList.remove('page-active');
    })
    Array.from(document.querySelectorAll('.page-btn'))[page - 1]?.classList?.add('page-active');
  }

  document.querySelectorAll('.page-btn').forEach(item => {
    item.addEventListener('click', (e) => {
      page = +e.target.innerHTML;
      searchElements(page);
      getAllBooks();
    })
  })
}

function choppedPagination(books) {
  let start = page * step - step;
  let end = start + step;
  return books.slice(start, end);
}

function searchElements(searchValue) {
  let url = new URL(window.location.href);
  let query = new URLSearchParams();
  query.append('page', searchValue);
  const urlSearchQuery = query.toString();
  url.search = urlSearchQuery;
  window.history.pushState(null, "", url.toString());
}
// Pagination 0

// Pagination 1
function renderPagination1(length) {
  let result = '';
  let pageNumber = Math.ceil(length / step1);
  localStorage.setItem('key1', JSON.stringify(page1));
  localStorage.setItem('page1', JSON.stringify('page-active'));

  for (let i = 0; i < pageNumber; i++) {
    result += `
      <li class="page__list">
        <button class="page-btn1">${i + 1}</button>
      </li>
    `;
  }

  pagesLists1.innerHTML = result;
  for (let i = 0; i < Array.from(document.querySelectorAll('.page-btn1')).length; i++) {
    document.querySelectorAll('.page-btn1').forEach(item => {
      item.classList.remove('page-active');
    })
    Array.from(document.querySelectorAll('.page-btn1'))[page1 - 1].classList.add('page-active');
  }


  document.querySelectorAll('.page-btn1').forEach(item => {
    item.addEventListener('click', (e) => {
      page1 = +e.target.innerHTML;
      searchElements1(page1);
      getAllBooks1();
    })
  })
}

function choppedPagination1(books) {
  let start = page1 * step1 - step1;
  let end = start + step1;
  return books.slice(start, end);
}

function searchElements1(searchValue) {
  let url = new URL(window.location.href);
  let query = new URLSearchParams();
  query.append('page1', searchValue);
  const urlSearchQuery = query.toString();
  url.search = urlSearchQuery;
  window.history.pushState(null, "", url.toString());
}
// Pagination 1

// from User To Admin
document.getElementById('fromUserToAdmin').addEventListener('click', () => {
  location.replace('./registr.html');
})

document.querySelectorAll('.newProduct__btn').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.newProduct__btn').forEach(it => {
      it.classList.remove('btn__active');
    })
    item.classList.add('btn__active');
  })
})


document.querySelector('#replaceCart').addEventListener('click', () => {
  location.replace('./cart.html');
  // selectedCartLists.forEach(item => {
  //   addToCartNumberArr = allBooks.filter(it => it.id == item.id);
  //   localStorage.setItem('addToCartNumberArr', JSON.stringify(addToCartNumberArr));
  // })
});