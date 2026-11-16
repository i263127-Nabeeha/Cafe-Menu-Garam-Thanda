// Garam Thanda — shared mobile navigation and menu-page interactions.
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    navToggle.textContent = isOpen ? '×' : '☰';
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
      navToggle.textContent = '☰';
    });
  });
}

// The menu search and category filters only run on menu.html.
const menuSearch = document.querySelector('#menu-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');
const menuEmpty = document.querySelector('#menu-empty');
let activeCategory = 'all';

function updateMenu() {
  if (!menuSearch) return;
  const term = menuSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  menuItems.forEach((item) => {
    const categoryMatches = activeCategory === 'all' || item.dataset.category === activeCategory;
    const searchText = `${item.dataset.name} ${item.textContent}`.toLowerCase();
    const searchMatches = !term || searchText.includes(term);
    const visible = categoryMatches && searchMatches;
    item.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  document.querySelectorAll('.menu-category-heading').forEach((heading) => {
    let next = heading.nextElementSibling;
    let hasVisibleItem = false;
    while (next && next.classList.contains('menu-card-grid')) {
      if (next.querySelector('.menu-item:not([hidden])')) hasVisibleItem = true;
      next = next.nextElementSibling;
    }
    heading.hidden = !hasVisibleItem;
  });
  if (menuEmpty) menuEmpty.hidden = visibleCount !== 0;
}

if (menuSearch) menuSearch.addEventListener('input', updateMenu);
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    filterButtons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle('active', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    updateMenu();
  });
});


// A small interactive button for the menu page (Lab 11: window.alert).
const surpriseButton = document.querySelector('#menu-surprise-btn');
if (surpriseButton) {
  surpriseButton.addEventListener('click', () => {
    window.alert('A little suggestion from Garam Thanda: try our Chicken Biryani with a cup of Classic Doodh Patti Chai!');
  });
}


// Lab 11 practice: buttons on the home and Our Story pages use window.alert().
const homeAlertButton = document.querySelector('#home-alert-btn');
if (homeAlertButton) {
  homeAlertButton.addEventListener('click', () => {
    window.alert('Chai tastes better when shared! Welcome to Garam Thanda — your little corner of desi comfort.');
  });
}

const storyAlertButton = document.querySelector('#story-alert-btn');
if (storyAlertButton) {
  storyAlertButton.addEventListener('click', () => {
    window.alert('A message from our kitchen: Every recipe carries a memory, every cup brings people closer, and every guest is part of the Garam Thanda story.');
  });
}

// ORDER PAGE — front-end demo cart. No payment or order is sent to a server.
const orderProducts = {
  'halwa-puri': { name: 'Halwa Puri', price: 350 },
  'chicken-biryani': { name: 'Chicken Biryani', price: 420 },
  'zinger-burger': { name: 'Zinger Burger', price: 520 },
  'loaded-fries': { name: 'Loaded Fries', price: 450 },
  'daal-chawal': { name: 'Daal Chawal', price: 300 },
  'doodh-patti': { name: 'Classic Doodh Patti', price: 150 },
  'chicken-samosa': { name: 'Chicken Samosa', price: 180 },
  'gulab-jamun': { name: 'Gulab Jamun', price: 160 }
};
const orderCart = {};
const cartItemsElement = document.querySelector('#cart-items');
const cartCountElement = document.querySelector('#cart-count');
const cartSubtotalElement = document.querySelector('#cart-subtotal');
const cartTotalElement = document.querySelector('#cart-total');
const placeOrderButton = document.querySelector('#place-order-btn');
const checkoutForm = document.querySelector('#checkout-form');
const orderConfirmation = document.querySelector('#order-confirmation');

function formatRupees(amount) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

function renderOrderCart() {
  if (!cartItemsElement) return;
  const entries = Object.entries(orderCart);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => sum + orderProducts[id].price * quantity, 0);

  cartCountElement.textContent = itemCount;
  cartSubtotalElement.textContent = formatRupees(subtotal);
  cartTotalElement.textContent = formatRupees(subtotal);
  placeOrderButton.disabled = itemCount === 0;

  if (entries.length === 0) {
    cartItemsElement.innerHTML = '<div class="cart-empty"><span>🧺</span><b>Your basket is waiting</b><p>Add something delicious to get started.</p></div>';
    return;
  }

  cartItemsElement.innerHTML = entries.map(([id, quantity]) => {
    const product = orderProducts[id];
    return `<div class="cart-line">
      <div><div class="cart-line-name">${product.name}</div><div class="cart-line-price">${formatRupees(product.price * quantity)}</div></div>
      <div class="cart-line-controls" aria-label="Quantity controls for ${product.name}">
        <button class="qty-btn" type="button" data-cart-action="decrease" data-id="${id}" aria-label="Decrease ${product.name}">−</button>
        <span class="qty-number">${quantity}</span>
        <button class="qty-btn" type="button" data-cart-action="increase" data-id="${id}" aria-label="Increase ${product.name}">+</button>
        <button class="remove-line" type="button" data-cart-action="remove" data-id="${id}" aria-label="Remove ${product.name}">×</button>
      </div>
    </div>`;
  }).join('');
}

document.querySelectorAll('[data-add]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.add;
    orderCart[id] = (orderCart[id] || 0) + 1;
    if (orderConfirmation) orderConfirmation.hidden = true;
    renderOrderCart();
    button.innerHTML = 'Added <span>✓</span>';
    window.setTimeout(() => { button.innerHTML = 'Add to order <span>+</span>'; }, 900);
  });
});

if (cartItemsElement) {
  cartItemsElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;
    const { id, cartAction } = button.dataset;
    if (cartAction === 'increase') orderCart[id] = (orderCart[id] || 0) + 1;
    if (cartAction === 'decrease') {
      orderCart[id] = (orderCart[id] || 0) - 1;
      if (orderCart[id] <= 0) delete orderCart[id];
    }
    if (cartAction === 'remove') delete orderCart[id];
    renderOrderCart();
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const entries = Object.entries(orderCart);
    if (entries.length === 0) return;
    const formData = new FormData(checkoutForm);
    const customer = formData.get('customerName').trim();
    const phone = formData.get('customerPhone').trim();
    const address = formData.get('customerAddress').trim();
    const total = entries.reduce((sum, [id, quantity]) => sum + orderProducts[id].price * quantity, 0);
    const summary = entries.map(([id, quantity]) => `${orderProducts[id].name} x ${quantity}`).join(', ');
    const message = `Thank you, ${customer}! Your sample order is ready for review. Items: ${summary}. Total: ${formatRupees(total)}. This is a website demo only — no order has been sent. Phone: ${phone}. Address: ${address}.`;
    orderConfirmation.textContent = `Thank you, ${customer}! Your sample order contains ${summary}. Estimated total: ${formatRupees(total)}. No real order or payment has been submitted.`;
    orderConfirmation.hidden = false;
    window.alert(message);
  });
}

if (cartItemsElement) renderOrderCart();
