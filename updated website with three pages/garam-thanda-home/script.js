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
