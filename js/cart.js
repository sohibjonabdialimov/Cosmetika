document.querySelector('#replaceHome').addEventListener('click', () => {
  location.replace('./index.html');
});


let selectedCartLists = JSON.parse(localStorage.getItem('selectedCartLists'));
document.getElementById('header__cart').innerHTML = selectedCartLists.length;
let sum = 0;

console.log(selectedCartLists);

renderCartElements();

function renderCartElements() {
  let result = selectedCartLists.map(item => {
    sum += item.cost * item.count;
    let element = `
    <tr>
              <td class="big__image">
                <img class="table__big__image" src="${item.img__url}" alt="">
              </td>
              <td class="table__title">${item.title}</td>
              <td class="table__stock"><span>In Stock</span></td>
              <td class="table__input">
                <input type="number" class="changeInput" name="" id="${item.id}" value="${item.count}" min="0">
              </td>
              <td class="table__price">$${item.cost * item.count}</td>
              <td class="small__img">
                <img class="table__small__image" onclick="deleteItem(${item.ok})" src="img/main-delete.svg" alt="">
              </td>
              <td class="button__table">
                <button>Add to cart</button>
              </td>
            </tr>
    `

    return element;
  }).join(' ');

  document.querySelector('tbody').innerHTML = result;
}

document.getElementById('fromUserToAdmin').addEventListener('click', () => {
  location.replace('./registr.html');
})
document.querySelectorAll('.changeInput').forEach(item => {
  item.addEventListener('change', (e) => {
    let findedElementIndex = selectedCartLists.findIndex(item => item.id == e.target.id);
    
    selectedCartLists[findedElementIndex].count = +e.target.value;
    renderCartElements();
    document.getElementById('full__total').innerHTML = '$' + sum;
  })
})
document.getElementById('full__total').innerHTML = '$' + sum;
function deleteItem(ok){
  selectedCartLists = selectedCartLists.filter(item => item.ok !== ok);
  renderCartElements();
}
