let display = document.getElementById('display');
let currentValue = '0';
let deferredPrompt;
let installBtn = document.getElementById('installBtn');

function appendNumber(num) {
    if (currentValue === '0' || currentValue === 'Error') {
        currentValue = num;
    } else {
        currentValue += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentValue === 'Error') {
        currentValue = '0';
    }
    const lastChar = currentValue[currentValue.length - 1];
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentValue = currentValue.slice(0, -1) + op;
    } else {
        currentValue += op;
    }
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        const result = eval(currentValue.replace(/×/g, '*').replace(/−/g, '-'));
        currentValue = String(result);
        updateDisplay();
    } catch (e) {
        currentValue = 'Error';
        updateDisplay();
    }
}

function updateDisplay() {
    display.textContent = currentValue;
}

// PWA Installation
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'flex';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installBtn.style.display = 'none';
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}