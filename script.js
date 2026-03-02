const products = [
  {
    id: 1,
    name: "Atta Suji Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1626132646529-5003375a9541?auto=format&fit=crop&q=80&w=600",
    label: "Atta Suji"
  },
  {
    id: 2,
    name: "Only Maida Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1601050690597-df056fb1779f?auto=format&fit=crop&q=80&w=600",
    label: "Maida Special"
  },
  {
    id: 3,
    name: "Maida Suji Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1589113103503-49453730c91d?auto=format&fit=crop&q=80&w=600",
    label: "Maida Suji"
  },
  {
    id: 4,
    name: "Masala Kaju",
    price: 270,
    img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=600",
    label: "Masala Kaju"
  },
  {
    id: 5,
    name: "Simple Kaju",
    price: 270,
    img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600",
    label: "Simple Kaju"
  },
  {
    id: 6,
    name: "Methi Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=600",
    label: "Methi Special"
  }
];

let cart = [];
let totalAmount = 0;

function updateQty(id, change) {
  const input = document.getElementById(`qty-${id}`);
  let currentVal = parseInt(input.value);
  let newVal = currentVal + change;
  if (newVal < 0) newVal = 0;
  if (newVal > 20) newVal = 20; // Limit per individual product selection
  input.value = newVal;
}

function init() {
  const grid = document.getElementById("homepage-products");
  const fullGrid = document.getElementById("products-grid");

  if (grid) {
    grid.innerHTML = "";
    products.slice(0, 4).forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "product-card-photo reveal";
      card.style.transitionDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="product-card-label">${p.label}</div>
        <div style="padding: 15px;">
          <h3 style="margin-bottom: 5px; font-size: 1.1rem;">${p.name}</h3>
          <p style="font-weight: bold; margin-bottom: 10px; color: var(--primary);">₹${p.price} per 1Kg</p>
          
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQty(${p.id}, -1)">-</button>
            <input type="number" id="qty-${p.id}" class="qty-input" value="0" readonly>
            <button class="qty-btn" onclick="updateQty(${p.id}, 1)">+</button>
          </div>

          <div style="display: flex; gap: 5px;">
            <button class="btn-red" style="padding: 10px 10px; font-size: 0.8rem; flex: 1;" onclick="addToCart(${p.id})">Add to Cart</button>
            <button class="btn-red" style="padding: 10px 10px; font-size: 0.8rem; flex: 1; background: #25d366; border-color: #25d366;" onclick="buyOnWhatsApp(${p.id})"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  if (fullGrid) {
    fullGrid.innerHTML = "";
    products.forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "product-card-photo reveal";
      card.style.transitionDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
          <div class="product-card-label" style="align-self: flex-start; margin-bottom: 5px;">${p.label}</div>
          <h3 style="margin-bottom: 2px; font-size: 1.2rem;">${p.name}</h3>
          <p style="font-weight: bold; color: var(--primary); font-size: 1.1rem;">₹${p.price} per 1Kg</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; min-width: 150px;">
          <div class="qty-control" style="margin-bottom: 0;">
            <button class="qty-btn" onclick="updateQty(${p.id}, -1)">-</button>
            <input type="number" id="qty-${p.id}" class="qty-input" value="0" readonly>
            <button class="qty-btn" onclick="updateQty(${p.id}, 1)">+</button>
          </div>
          <div style="display: flex; gap: 5px;">
            <button class="btn-red" style="padding: 8px 10px; font-size: 0.8rem; flex: 1;" onclick="addToCart(${p.id})">Add to Cart</button>
            <button class="btn-red" style="padding: 8px 10px; font-size: 0.8rem; flex: 1; background: #25d366; border-color: #25d366;" onclick="buyOnWhatsApp(${p.id})"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
          </div>
        </div>
      `;
      fullGrid.appendChild(card);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Slider Logic
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 0) {
    setInterval(nextSlide, 5000); // Change image every 5 seconds
  }

  const cartBtn = document.querySelector('.cart-icon');
  if (cartBtn) {
    cartBtn.onclick = openCartModal;
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const qtyInput = document.getElementById(`qty-${productId}`);
  const quantityToAdd = parseInt(qtyInput.value) || 0;

  if (quantityToAdd <= 0) {
    showToast("Pehle quantity select karein! 🛒");
    return;
  }

  // Calculate current total units in cart
  const currentTotalInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (currentTotalInCart + quantityToAdd > 20) {
    showToast("Aap total 20 unit se zyada order nahi kar sakte! ❌");
    return;
  }

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    cart.push({ ...product, quantity: quantityToAdd });
  }

  // Recalculate Total
  totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  updateCartBadge();
  showToast(`Added ${quantityToAdd} ${product.name}! 😋`);

  // Reset input back to 0
  if (qtyInput) qtyInput.value = 0;

  // Open the Cart Modal so user can see Online Payment options immediately
  openCartModal();
}

function updateCartBadge() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.innerText = totalQty;
    countEl.classList.add('pulse');
    setTimeout(() => countEl.classList.remove('pulse'), 500);
  }
}

function openCartModal() {
  if (cart.length === 0) {
    showToast("Cart is empty! 🛒");
    return;
  }

  const modal = document.getElementById('cartModal');
  const list = document.getElementById('cart-items-list');
  const totalModal = document.getElementById('cart-total-modal');

  if (list) {
    list.innerHTML = cart.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: #fdfaf0; border-radius: 8px; border-left: 4px solid var(--primary);">
        <div>
          <h4 style="margin: 0;">${item.name}</h4>
          <p style="margin: 0; font-size: 0.85rem; color: #666;">Quantity: ${item.quantity} kg</p>
        </div>
        <div style="font-weight: bold; color: var(--primary);">₹${item.price * item.quantity}</div>
      </div>
    `).join('');
  }

  if (totalModal) {
    totalModal.innerText = `₹${totalAmount}`;
  }

  if (modal) modal.classList.add('show');
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('show');
}

function buyOnWhatsApp(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const qtyInput = document.getElementById(`qty-${productId}`);
  const qty = parseInt(qtyInput.value) || 0;

  if (qty <= 0) {
    showToast("Pehle quantity select karein! 🛒");
    return;
  }

  const message = `🟢 *DIRECT ORDER: THE MUMMA'S MATHRI* 🟢\n` +
    `----------------------------------\n` +
    `Hello, I want to order this item directly:\n\n` +
    `📦 *Item:* ${product.name}\n` +
    `⚖️ *Quantity:* ${qty} kg\n` +
    `💰 *Price:* ₹${product.price * qty}\n` +
    `----------------------------------\n` +
    `Please confirm my order! ❤️`;

  window.open(`https://wa.me/919887656441?text=${encodeURIComponent(message)}`, '_blank');
}

function payOnline() {
  if (totalAmount <= 0) return;

  const vpa = "9887656441@ybl";
  const name = "The Mumma's Mathri";
  const upiLink = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${totalAmount}&cu=INR`;

  showToast("Opening Payment App... 📱");

  window.location.href = upiLink;

  setTimeout(() => {
    showToast("Payment ke baad screenshot WhatsApp par bhej dein! ✅");
  }, 3000);
}

function openWhatsAppOrder() {
  if (cart.length === 0) {
    showToast("Cart is empty! 🛒");
    return;
  }

  const userName = localStorage.getItem('mumma_user_name') || "Customer";
  const userPhone = localStorage.getItem('mumma_user_phone') || "";

  let productLines = cart.map(item => `   - ${item.name} (${item.quantity} kg)`).join("\n");

  let message = `🔴 *NEW ORDER: THE MUMMA'S MATHRI* 🔴\n` +
    `----------------------------------\n` +
    `👤 *Name:* ${userName}\n` +
    `📱 *Phone:* ${userPhone}\n` +
    `----------------------------------\n\n` +
    `🛍️ *ITEMS ORDERED:*\n` +
    `${productLines}\n\n` +
    `----------------------------------\n` +
    `💰 *TOTAL BILL:* ₹${totalAmount}\n` +
    `----------------------------------\n\n` +
    `Please confirm my order. Thank you! ❤️`;

  let encodedMessage = encodeURIComponent(message);

  showToast(`Order Sent! ✅ Admin (98876 56441) se sampark karein! ❤️`);

  window.open(`https://wa.me/919887656441?text=${encodedMessage}`, '_blank');

  setTimeout(() => {
    cart = [];
    totalAmount = 0;
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = '0';
    document.querySelectorAll('.qty-input').forEach(input => input.value = 0);
    closeCartModal();
    updateCartBadge();
  }, 1000);
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Login Modal Logic
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.add('show');
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('show');
}

function handleLogin(event) {
  event.preventDefault();
  const name = document.getElementById('userName').value;
  const phone = document.getElementById('userPhone').value;

  localStorage.setItem('mumma_user_name', name);
  localStorage.setItem('mumma_user_phone', phone);

  updateAccountUI();
  showToast(`Welcome, ${name}! ❤️`);
  closeLoginModal();
}

// Account & Login Persistence
function updateAccountUI() {
  const userName = localStorage.getItem('mumma_user_name');
  const userPhone = localStorage.getItem('mumma_user_phone');
  const navName = document.getElementById('nav-user-name');
  const dropdownInfo = document.getElementById('dropdown-user-info');

  if (userName && navName) {
    navName.innerText = `Hi, ${userName.split(' ')[0]}`;
    if (dropdownInfo) {
      dropdownInfo.innerHTML = `<strong>${userName}</strong><br>${userPhone}`;
    }
  } else if (navName) {
    navName.innerText = 'Login';
  }
}

function toggleAccountMenu() {
  const isLoggedIn = localStorage.getItem('mumma_user_name');
  if (!isLoggedIn) {
    openLoginModal();
  } else {
    const menu = document.getElementById('account-menu');
    if (menu) menu.classList.toggle('show');
  }
}

function handleLogout() {
  localStorage.removeItem('mumma_user_name');
  localStorage.removeItem('mumma_user_phone');
  sessionStorage.removeItem('loginDismissed');
  location.reload();
}

window.addEventListener('click', (e) => {
  const menu = document.getElementById('account-menu');
  const profile = document.getElementById('user-profile');
  if (menu && !menu.contains(e.target) && profile && !profile.contains(e.target)) {
    menu.classList.remove('show');
  }
});

// Show popup after 10 seconds
setTimeout(() => {
  const isDismissed = sessionStorage.getItem('loginDismissed');
  const isLoggedIn = localStorage.getItem('mumma_user_name');

  if (!isDismissed && !isLoggedIn) {
    openLoginModal();
    sessionStorage.setItem('loginDismissed', 'true');
  }
}, 10000);

// Contact Form Logic
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name')?.value || document.getElementById('contact-name-page')?.value;
  const phone = document.getElementById('contact-phone')?.value || document.getElementById('contact-phone-page')?.value;
  const email = document.getElementById('contact-email')?.value || document.getElementById('contact-email-page')?.value;
  const message = document.getElementById('contact-message')?.value || document.getElementById('contact-message-page')?.value;
  if (!name || !phone) return;
  const waMessage = `✨ *New Inquiry from Website* ✨\n\n👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n📧 *Email:* ${email}\n💬 *Message:* ${message}`;
  const encodedMessage = encodeURIComponent(waMessage);
  window.open(`https://wa.me/919887656441?text=${encodedMessage}`, '_blank');
  showToast("Opening WhatsApp to send your message! ❤️");
  event.target.reset();
}

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
  init();
  updateAccountUI();
  document.querySelectorAll('form').forEach(form => {
    if (form.closest('.contact-section-photo') || form.closest('.contact-gold-container')) {
      form.onsubmit = handleContactSubmit;
    }
  });
});
