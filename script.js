let products = [
  {
    id: 1,
    name: "Special Atta Suji Lambi Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1601050690597-df056fb1779f?auto=format&fit=crop&q=80&w=800&v=1",
    label: "Atta Suji"
  },
  {
    id: 2,
    name: "Only Maida Lambi Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1626132646529-5003375a9541?auto=format&fit=crop&q=80&w=800&v=1",
    label: "Maida Special"
  },
  {
    id: 3,
    name: "Maida Suji Lambi Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1589113103503-49453730c91d?auto=format&fit=crop&q=80&w=800&v=1",
    label: "Maida Suji"
  },
  {
    id: 4,
    name: "Masala Kaju",
    price: 270,
    img: "masala-kaju.png?v=1",
    label: "Masala Kaju"
  },
  {
    id: 5,
    name: "Simple Kaju",
    price: 270,
    img: "simple-kaju.png?v=1",
    label: "Simple Kaju"
  },
  {
    id: 6,
    name: "Special Methi Lambi Mathri",
    price: 270,
    img: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=800&v=1",
    label: "Methi Special"
  }
];

const API_BASE_URL = "http://localhost:5000/api";

async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        products = data;
        init(); // Re-init grid with API data
      }
    }
  } catch (error) {
    console.warn("API Offline, using local product data.");
  }
}

let cart = [];
let totalAmount = 0;

function updateQty(id, change) {
    const input = document.getElementById(`qty-${id}`);
    if (!input) return;
    let currentVal = parseInt(input.value) || 0;
    let newVal = currentVal + change;
    if (newVal < 0) newVal = 0;
    if (newVal > 20) newVal = 20; // Limit per individual product selection
    input.value = newVal;

    // Direct sync with cart so it shows immediately
    syncCartItem(id, newVal);
}

function syncCartItem(productId, qty) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);

    if (qty > 0) {
        if (existingIndex > -1) {
            cart[existingIndex].quantity = qty;
        } else {
            cart.push({ ...product, quantity: qty });
        }
    } else {
        if (existingIndex > -1) {
            cart.splice(existingIndex, 1);
        }
    }

    // Recalculate Total
    totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateCartBadge();
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
    const isLoggedIn = localStorage.getItem('mumma_user_name');
    if (!isLoggedIn) {
        showToast("Pehle Login karein! ❤️");
        openLoginModal();
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const qtyInput = document.getElementById(`qty-${productId}`);
    const qty = parseInt(qtyInput.value) || 0;

    if (qty <= 0) {
        showToast("Pehle quantity select karein! 🛒");
        return;
    }

    showToast(`Items added to cart! 😋`);
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
      <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px; padding: 12px; background: #fffcf5; border-radius: 12px; border: 1px solid #f0e6cc; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: all 0.3s ease;">
        <img src="${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">
        <div style="flex: 1;">
          <h4 style="margin: 0; color: var(--secondary); font-size: 1.1rem;">${item.name}</h4>
          <p style="margin: 3px 0 0; font-size: 0.9rem; color: #777;">Quantity: <strong>${item.quantity} kg</strong></p>
        </div>
        <div style="font-weight: 800; color: var(--primary); font-size: 1.1rem; min-width: 60px; text-align: right;">₹${item.price * item.quantity}</div>
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
  const isLoggedIn = localStorage.getItem('mumma_user_name');
  if (!isLoggedIn) {
    showToast("Pehle Login karein! ❤️");
    openLoginModal();
    return;
  }

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

  const vpa = "9694847778@ptaxis";
  const name = "The Mumma's Mathri";
  const upiLink = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${totalAmount}&cu=INR`;

  showToast("Opening Payment App... 📱");

  // Show the QR code section in the modal as well
  const qrSection = document.getElementById('qr-payment-section');
  if (qrSection) qrSection.style.display = 'block';

  window.location.href = upiLink;

  setTimeout(() => {
    showToast("Payment ke baad screenshot WhatsApp par bhej dein! ✅");
  }, 3000);
}

function toggleQRCode() {
  const qrSection = document.getElementById('qr-payment-section');
  if (qrSection) {
    qrSection.style.display = qrSection.style.display === 'block' ? 'none' : 'block';
  }
}

function openWhatsAppOrder() {
  const isLoggedIn = localStorage.getItem('mumma_user_name');
  if (!isLoggedIn) {
    showToast("Pehle Login karein! ❤️");
    openLoginModal();
    return;
  }

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

  // LOG ORDER TO API
  try {
    fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName,
        userPhone,
        items: cart,
        totalAmount,
        orderDate: new Date().toISOString()
      })
    });
  } catch (err) {
    console.error("Order logging failed, but proceeding to WhatsApp.");
  }

  showToast(`Order Sent! ✅ Admin (98876 56441) se sampark karein! ❤️`);

  // SHOW BILL TO CUSTOMER
  showBillModal({
    userName,
    userPhone,
    items: [...cart],
    totalAmount
  });

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

// BILL GENERATION SYSTEM
function showBillModal(order) {
    const modal = document.getElementById('billModal');
    const content = document.getElementById('bill-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="invoice-container">
            <div class="invoice-header">
                <div class="brand">
                    <h1 style="color: var(--primary); margin: 0; font-weight: 800;">THE MUMMA'S MATHRI</h1>
                    <p style="color: #666; font-size: 0.9rem;">Delicious Traditional Snacks</p>
                </div>
                <div class="invoice-details" style="text-align: right;">
                    <h2 style="margin: 0;">INVOICE</h2>
                    <p style="margin: 5px 0;">#${order.id || 'NEW-ORDER'}</p>
                    <p style="margin: 5px 0; font-size: 0.8rem;">Date: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div style="margin: 20px 0; border-top: 2px solid #eee; padding-top: 15px; display: flex; justify-content: space-between;">
                <div>
                    <h4 style="margin-bottom: 5px; color: #333;">BILL TO:</h4>
                    <p style="margin: 2px 0; font-weight: 600;">${order.userName || 'Customer'}</p>
                    <p style="margin: 2px 0; color: #666;">Phone: ${order.userPhone || 'N/A'}</p>
                </div>
                <div style="text-align: right;">
                    <h4 style="margin-bottom: 5px; color: #333;">PAY TO:</h4>
                    <p style="margin: 2px 0; font-weight: 600;">The Mumma's Mathri</p>
                    <p style="margin: 2px 0; color: #666;">UPI: 9694847778@ptaxis</p>
                </div>
            </div>

            <table class="invoice-table" style="width: 100%; border-collapse: collapse; margin: 25px 0;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 12px; border-bottom: 2px solid #eee; background: #f8f9fa;">Item Description</th>
                        <th style="text-align: center; padding: 12px; border-bottom: 2px solid #eee; background: #f8f9fa;">Qty</th>
                        <th style="text-align: right; padding: 12px; border-bottom: 2px solid #eee; background: #f8f9fa;">Rate</th>
                        <th style="text-align: right; padding: 12px; border-bottom: 2px solid #eee; background: #f8f9fa;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(i => `
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #eee;">${i.name}</td>
                            <td style="text-align: center; padding: 12px; border-bottom: 1px solid #eee;">${i.quantity} kg</td>
                            <td style="text-align: right; padding: 12px; border-bottom: 1px solid #eee;">₹${i.price}</td>
                            <td style="text-align: right; padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">₹${i.price * i.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="invoice-footer" style="display: flex; justify-content: space-between; margin-top: 30px; align-items: flex-end;">
                <div class="thanks">
                    <p style="margin-bottom: 5px;">Thank you for your order! ❤️</p>
                    <p style="color: #999; font-size: 0.75rem;">FSSAI Licensed: 22223062000578</p>
                </div>
                <div class="totals" style="min-width: 200px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Subtotal</span>
                        <span>₹${order.totalAmount}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Delivery</span>
                        <span>Free</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 10px; font-size: 1.2rem; font-weight: 800; color: var(--primary);">
                        <span>GRAND TOTAL</span>
                        <span>₹${order.totalAmount}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

function closeBillModal() {
    const modal = document.getElementById('billModal');
    if (modal) modal.classList.remove('show');
}

function printBill() {
    const printContent = document.getElementById('bill-content').innerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>Print Bill</title>');
    win.document.write('<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">');
    win.document.write('<style>');
    win.document.write(':root { --primary: #7c2214; }');
    win.document.write('body { font-family: "Outfit", sans-serif; padding: 40px; }');
    win.document.write('.invoice-container { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.05); }');
    win.document.write('.invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }');
    win.document.write('.invoice-footer { display: flex; justify-content: space-between; margin-top: 40px; align-items: flex-end; }');
    win.document.write('</style></head><body>');
    win.document.write(printContent);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => {
        win.print();
        win.close();
    }, 500);
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

  // LOG INQUIRY TO API
  try {
    fetch(`${API_BASE_URL}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, message, date: new Date().toISOString() })
    });
  } catch (err) {
    console.error("Inquiry logging failed.");
  }

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
  fetchProducts(); // GET DATA FROM API
  document.querySelectorAll('form').forEach(form => {
    if (form.closest('.contact-section-photo') || form.closest('.contact-gold-container')) {
      form.onsubmit = handleContactSubmit;
    }
  });

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('SW Registered'))
        .catch(err => console.log('SW Error:', err));
    });
  }
});
