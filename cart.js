// Cart creation
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadCartItems();
    setupEventListeners();
    updateCartCount();
});

const bookImages = {
    "WE WHO WILL DIE": "Images/f1.png",
    "AN ARCANE INHERITANCE": "Images/f2.png",
    "CANTICLE": "Images/f3.png",
    "TAILORED REALITIES": "Images/f4.png",
    "PERSEPHONE'S CURSE": "Images/f5.png",
    "SOMETHING WICKED": "Images/f6.png",
    "AN ARCHIVE OF ROMANCE": "Images/f7.png",
    "THE LIBRARY OF FATES": "Images/f8.png",
    "SEEING OTHER PEOPLE": "Images/f9.png",
    "THE LAST VAMPIRE": "Images/f10.png",
    "HER TIME TRAVELING DUKE": "Images/f11.png",
    "ONCE UPON A BROKEN HEART": "Images/f12.png",
    "SHIELD OF SPARROWS": "Images/f13.png",
    "THE BALLAD OF NEVER AFTER": "Images/f14.png",
    "A CURSE FOR TRUE LOVE": "Images/f15.png",
    "LIGHTLARK": "Images/f16.png",
    "ASSISTANT TO THE VILLAIN": "Images/f17.png",
    "TWICE": "Images/f18.png",
    "DIVINE RIVALS": "Images/f19.png",
    "HEARTLESS HUNTER": "Images/f20.png",
    "SPARK OF THE EVERFLAME": "Images/f21.png",
    "RECKLESS": "Images/r7.png",
    "GLOW OF THE EVERFLAME": "Images/f23.png",
    "TRESS OF THE EMERALD SEA": "Images/f24.png",
    "REMAIN": "Images/f25.png",
    "HARRY POTTER AND THE SORCERER'S STONE": "Images/f26.png",
    "HARRY POTTER AND THE CHAMBER OF SECRETS": "Images/f27.png",
    "HARRY POTTER AND THE PRISONER OF AZKABAN": "Images/f29.png",
    "HARRY POTTER AND THE GOBLET OF FIRE": "Images/f30.png",
    "HARRY POTTER AND THE ORDER OF THE PHOENIX": "Images/f31.png",
    "HARRY POTTER AND THE HALF-BLOOD PRINCE": "Images/f32.png",
    "HARRY POTTER AND THE DEATHLY HALLOWS": "Images/f33.png",
    "UNDER THE EARTH,OVER THE SKY": "Images/F51.png",
    "THE FALLEN AND THE KISS OF DUSK": "Images/f46.png",
    "CHILDREN OF ANGUISH AND ANARCHY": "Images/f47.png",
    "THE HOBBIT": "Images/f28.png",
    "A GAME OF THRONES": "Images/f34.png",
    "THE FELLOWSHIP OF THE RING": "Images/f35.png",
    "THRONE OF GLASS": "Images/f36.png",
    "MISTBORN-THE FINAL EMPIRE": "Images/f37.png",
    "SIX OF CROWS": "Images/f38.png",
    "THE CRUEL PRINCE": "Images/f39.png",
    "WHAT THE RIVER KNOWS": "Images/f40.png",
    "BABEL": "Images/f41.png",
    "A COURT OF THORNS AND ROSES": "Images/botw1.jpg",
    "POWERLESS": "Images/sp1.jpg",
    "THE CITY WE BECAME": "Images/f43.png",
    "KEEPER OF ENCHANTED ROOMS": "Images/f44.png",
    "SWORD CATCHER": "Images/f45.png",
    "BRIGANDS AND BREADKNIVES": "Images/f48.png",
    "CARAVAL": "Images/f49.png",
    "THE FLAWS OF GRAVITY": "Images/f50.png",
    "ON WINGS OF BLOOD": "Images/f52.png",
    "BONES": "Images/f53.png",
    "THE NIGHT ENDS WITH FIRE": "Images/f42.png",
    "default": "Images/placeholder.jpg"
};

let currentDiscount = 0;

function getBookImage(bookName) {
    const cleanName = bookName.trim();
    
    if (bookImages[cleanName]) return bookImages[cleanName];
    
    for (const key in bookImages) {
        if (key.toLowerCase() === cleanName.toLowerCase()) {
            return bookImages[key];
        }
    }
    
    for (const key in bookImages) {
        if (cleanName.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(cleanName.toLowerCase())) {
            return bookImages[key];
        }
    }
    
    return bookImages["default"];
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        
        if (window.location.pathname.includes('cart.html')) {
            alert('Please login to view your cart!');
            window.location.href = 'login.html';
        }
    }
}

function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    if (cartItems.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartContainer.innerHTML = '';
        cartContainer.appendChild(emptyCartMessage);
        document.getElementById('checkoutBtn').disabled = true;
        updateTotals(0);
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    let cartHTML = '';
    let subtotal = 0;
    
    const itemQuantities = {};
    cartItems.forEach(item => {
        itemQuantities[item] = (itemQuantities[item] || 0) + 1;
    });
    
    Object.keys(itemQuantities).forEach(bookName => {
        const quantity = itemQuantities[bookName];
        const price = getBookPrice(bookName);
        const itemTotal = price * quantity;
        subtotal += itemTotal;
        const imageUrl = getBookImage(bookName);
        
        cartHTML += `
            <div class="cart-item" data-book="${bookName}">
                <div class="d-flex">
                    <img src="${imageUrl}" class="book-image-small" alt="${bookName}" 
                         onerror="this.src='Images/placeholder.jpg'">
                    <div class="book-info">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="book-title">${bookName}</h5>
                                <p class="book-meta">Rs ${price} each | Qty: ${quantity}</p>
                            </div>
                            <span class="price">Rs ${itemTotal}</span>
                        </div>
                        
                        <div class="actions-row">
                            <div class="quantity-control">
                                <button class="quantity-btn" onclick="updateQuantity('${bookName.replace(/'/g, "\\'")}', -1)">-</button>
                                <span class="quantity-display">${quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity('${bookName.replace(/'/g, "\\'")}', 1)">+</button>
                            </div>
                            <button class="remove-btn" onclick="removeFromCart('${bookName.replace(/'/g, "\\'")}')">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    updateTotals(subtotal);
    document.getElementById('checkoutBtn').disabled = false;
}

function getBookPrice(bookName) {
    const priceMap = {
        "WE WHO WILL DIE": 500,
        "AN ARCANE INHERITANCE": 500,
        "CANTICLE": 500,
        "TAILORED REALITIES": 500,
        "PERSEPHONE'S CURSE": 500,
        "SOMETHING WICKED": 500,
        "AN ARCHIVE OF ROMANCE": 700,
        "THE LIBRARY OF FATES": 500,
        "SEEING OTHER PEOPLE": 500,
        "THE LAST VAMPIRE": 700,
        "HER TIME TRAVELING DUKE": 500,
        "ONCE UPON A BROKEN HEART": 700,
        "SHIELD OF SPARROWS": 700,
        "THE BALLAD OF NEVER AFTER": 500,
        "A CURSE FOR TRUE LOVE": 650,
        "LIGHTLARK": 650,
        "ASSISTANT TO THE VILLAIN": 650,
        "TWICE": 650,
        "DIVINE RIVALS": 650,
        "HEARTLESS HUNTER": 650,
        "SPARK OF THE EVERFLAME": 650,
        "RECKLESS": 700,
        "GLOW OF THE EVERFLAME": 650,
        "TRESS OF THE EMERALD SEA": 650,
        "REMAIN": 500,
        "HARRY POTTER AND THE SORCERER'S STONE": 500,
        "HARRY POTTER AND THE CHAMBER OF SECRETS": 500,
        "HARRY POTTER AND THE PRISONER OF AZKABAN": 700,
        "HARRY POTTER AND THE GOBLET OF FIRE": 700,
        "HARRY POTTER AND THE ORDER OF THE PHOENIX": 700,
        "HARRY POTTER AND THE HALF-BLOOD PRINCE": 700,
        "HARRY POTTER AND THE DEATHLY HALLOWS": 700,
        "UNDER THE EARTH,OVER THE SKY": 700,
        "THE FALLEN AND THE KISS OF DUSK": 650,
        "CHILDREN OF ANGUISH AND ANARCHY": 650,
        "THE HOBBIT": 700,
        "A GAME OF THRONES": 700,
        "THE FELLOWSHIP OF THE RING": 700,
        "THRONE OF GLASS": 700,
        "MISTBORN-THE FINAL EMPIRE": 650,
        "SIX OF CROWS": 650,
        "THE CRUEL PRINCE": 650,
        "WHAT THE RIVER KNOWS": 650,
        "BABEL": 650,
        "A COURT OF THORNS AND ROSES": 650,
        "POWERLESS": 650,
        "THE CITY WE BECAME": 650,
        "KEEPER OF ENCHANTED ROOMS": 650,
        "SWORD CATCHER": 650,
        "BRIGANDS AND BREADKNIVES": 700,
        "CARAVAL": 700,
        "THE FLAWS OF GRAVITY": 700,
        "ON WINGS OF BLOOD": 700,
        "BONES": 700,
        "THE NIGHT ENDS WITH FIRE": 650,
        "default": 500
    };
    
    for (const key in priceMap) {
        if (bookName.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(bookName.toLowerCase())) {
            return priceMap[key];
        }
    }
    
    return priceMap["default"];
}

function updateQuantity(bookName, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (change === -1) {
        const index = cartItems.indexOf(bookName);
        if (index > -1) cartItems.splice(index, 1);
    } else if (change === 1) {
        cartItems.push(bookName);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCartItems();
    updateCartCount();
}

function removeFromCart(bookName) {
    if (confirm(`Remove "${bookName}" from cart?`)) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item !== bookName);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        loadCartItems();
        updateCartCount();
    }
}

function updateTotals(subtotal) {
    const shipping = 100;
    const tax = (subtotal - (subtotal * (currentDiscount / 100))) * 0.05;
    const discountAmount = subtotal * (currentDiscount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const total = discountedSubtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `Rs ${subtotal}`;
    document.getElementById('tax').textContent = `Rs ${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `Rs ${total.toFixed(2)}`;
    
 
    const summary = document.querySelector('.summary-details');
    let discountElement = summary.querySelector('.discount-row');
    
    if (currentDiscount > 0) {
        if (!discountElement) {
            discountElement = document.createElement('div');
            discountElement.className = 'd-flex justify-content-between mb-2 text-success discount-row';
            summary.insertBefore(discountElement, summary.children[0]);
        }
        discountElement.innerHTML = `
            <span>Discount (${currentDiscount}%):</span>
            <span>-Rs ${discountAmount.toFixed(2)}</span>
        `;
    } else if (discountElement) {
        discountElement.remove();
    }
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = cartItems.length;
    document.getElementById('cartCount').textContent = cartCount;
}

function setupEventListeners() {
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const total = document.getElementById('totalAmount').textContent;
        
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        if (confirm(`Proceed to checkout? Total: ${total}`)) {
            alert('Checkout successful! Thank you for your purchase.');
            localStorage.removeItem('cartItems');
            currentDiscount = 0;
            loadCartItems();
            updateCartCount();
        }
    });
    
    document.getElementById('applyDiscount').addEventListener('click', applyDiscountCode);
    
    document.getElementById('discountCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyDiscountCode();
        }
    });
    
    document.getElementById('logoutLink').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('userEmail');
            alert('Logged out successfully!');
            window.location.href = 'login.html';
        }
    });
}

function applyDiscountCode() {
    const codeInput = document.getElementById('discountCode');
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        alert('Please enter a discount code');
        return;
    }
    
    const validCodes = {
        'WELCOME10': 10,
        'MEMBER15': 15
    };
    
    if (validCodes[code]) {
        currentDiscount = validCodes[code];
        loadCartItems(); 
        alert(`Discount applied! ${currentDiscount}% off your order.`);
        codeInput.value = '';
    } else {
        alert('Invalid discount code. Please try again.');
    }
}

window.clearCart = function() {
    if (confirm('Clear all items from cart?')) {
        localStorage.removeItem('cartItems');
        currentDiscount = 0;
        loadCartItems();
        updateCartCount();
        alert('Cart cleared!');
    }
};


// calculator creation
let displayValue = '0';
let previousValue = '';
let operator = '';
let calculationHistory = [];

function updateDisplay() {
    const display = document.getElementById('display');
    display.textContent = displayValue;
}

function appendNumber(number) {
    if (displayValue === '0' || displayValue === 'Error') {
        displayValue = number;
    } else {
        displayValue += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

function appendOperator(op) {
    if (displayValue !== 'Error') {
        previousValue = displayValue;
        operator = op;
        displayValue = '0';
        updateDisplay();
    }
}

function calculate() {
    if (previousValue && operator && displayValue !== 'Error') {
        let result;
        const prev = parseFloat(previousValue);
        const current = parseFloat(displayValue);
        
        try {
            switch(operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    result = prev / current;
                    break;
                default:
                    result = current;
            }
            
            const calculation = `${previousValue} ${operator} ${displayValue} = ${result}`;
            calculationHistory.unshift(calculation);
            if (calculationHistory.length > 5) {
                calculationHistory.pop();
            }
            updateHistory();
            
            displayValue = result.toString();
            previousValue = '';
            operator = '';
            updateDisplay();
            
        } catch (error) {
            displayValue = 'Error';
            updateDisplay();
        }
    }
}

function quickCalculate(price, quantity) {
    const total = price * quantity;
    appendNumber(total.toString());
}

function clearDisplay() {
    displayValue = '0';
    previousValue = '';
    operator = '';
    updateDisplay();
}

function backspace() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = '';
    
    calculationHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item text-muted small';
        div.textContent = item;
        historyElement.appendChild(div);
    });
}

function goToCart() {
    window.location.href = 'cart.html';
}

function setupKeyboardSupport() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            appendNumber(key);
        } else if (key === '.') {
            appendDecimal();
        } else if (key === '+') {
            appendOperator('+');
        } else if (key === '-') {
            appendOperator('-');
        } else if (key === '*') {
            appendOperator('*');
        } else if (key === '/') {
            event.preventDefault();
            appendOperator('/');
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
        } else if (key === 'Escape') {
            clearDisplay();
        } else if (key === 'Backspace') {
            backspace();
        }
    });
}

function initCalculator() {
    updateDisplay();
    setupKeyboardSupport();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
} else {
    initCalculator();
}

//membership creation
// Membership Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Billing Toggle Functionality
    const billingSwitch = document.getElementById('billingSwitch');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    
    if (billingSwitch) {
        billingSwitch.addEventListener('change', function() {
            if (this.checked) {
                // Show monthly prices
                monthlyPrices.forEach(price => {
                    price.classList.remove('d-none');
                });
                yearlyPrices.forEach(price => {
                    price.classList.add('d-none');
                });
            } else {
                // Show yearly prices
                monthlyPrices.forEach(price => {
                    price.classList.add('d-none');
                });
                yearlyPrices.forEach(price => {
                    price.classList.remove('d-none');
                });
            }
        });
    }
    
    // Plan Selection
    const planButtons = document.querySelectorAll('.select-plan');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const card = this.closest('.membership-card');
            const planName = card.querySelector('.card-title').textContent;
            const priceElement = card.querySelector('.monthly-price:not(.d-none)') || 
                               card.querySelector('.yearly-price:not(.d-none)');
            const price = priceElement ? priceElement.textContent.trim() : '';
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
            this.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show confirmation modal
                showPlanConfirmation(planName, price, plan);
                
                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
    
    // Login/Logout functionality
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (userLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
    }
    
    // Logout functionality
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.setItem('userLoggedIn', 'false');
            loginLink.style.display = 'inline';
            logoutLink.style.display = 'none';
            alert('You have been logged out successfully.');
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Show plan confirmation
function showPlanConfirmation(planName, price, planType) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="planModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">🎉 Membership Selected!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                        </div>
                        <h4 class="mb-3">${planName}</h4>
                        <p class="lead">${price}</p>
                        <p>You've selected the perfect plan for your reading journey!</p>
                        <div class="alert alert-info mt-3">
                            <small>
                                <i class="bi bi-info-circle me-2"></i>
                                You will be redirected to the secure checkout page to complete your membership registration.
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continue Browsing</button>
                        <button type="button" class="btn btn-primary" id="proceedToCheckout">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('planModal'));
    modal.show();
    
    // Proceed to checkout button
    document.getElementById('proceedToCheckout').addEventListener('click', function() {
        // In a real application, this would redirect to a checkout page
        // For demo, we'll show a success message
        modal.hide();
        
        // Remove modal from DOM
        setTimeout(() => {
            document.querySelector('#planModal').remove();
        }, 500);
        
        alert(`Redirecting to secure checkout for ${planName}...\n\nIn a real application, this would process your payment and activate your membership.`);
        
        // Store selected plan in localStorage
        localStorage.setItem('selectedPlan', JSON.stringify({
            name: planName,
            price: price,
            type: planType,
            date: new Date().toISOString()
        }));
    });
    
    // Remove modal from DOM when hidden
    document.getElementById('planModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Highlight premium plan on page load
window.addEventListener('load', function() {
    const premiumCard = document.querySelector('.premium-card');
    if (premiumCard) {
        setTimeout(() => {
            premiumCard.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.3)';
            setTimeout(() => {
                premiumCard.style.boxShadow = '';
            }, 2000);
        }, 1000);
    }
});