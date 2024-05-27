document.addEventListener('DOMContentLoaded', () => {
    loadProgress();

    // Check every minute if a new day has started
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            createNewDay();
        }
    }, 60000);
});

function loadProgress() {
    document.querySelectorAll('.item .value').forEach(el => {
        const id = el.id;
        const value = localStorage.getItem(id);
        if (value) {
            el.textContent = value;
        }
    });

    const focusStatus = localStorage.getItem('focusStatus');
    if (focusStatus === 'running') {
        startFocusTimer();
    }
}

function saveProgress(id, value) {
    localStorage.setItem(id, value);
}

function increment(id) {
    const el = document.getElementById(id);
    let current = parseInt(el.textContent) || 0;
    current += 250;
    el.textContent = current + ' kr.';
    saveProgress(id, el.textContent);
}

function incrementWater() {
    const el = document.getElementById('water');
    let details = el.textContent.split(' ');
    let liters = parseFloat(details[3]);
    if (liters < 3.8) {
        liters += 0.25;
        const percent = Math.round((liters / 3.8) * 100);
        const newValue = `${percent}% (i alt ${liters.toFixed(1)} liter)`;
        el.textContent = newValue;
        saveProgress('water', newValue);
    }
}

function incrementMinutes(id, incrementBy, maxMinutes) {
    const el = document.getElementById(id);
    let [current, total] = el.textContent.split('/').map(s => s.split(' ')[0]).map(Number);
    if (current < total) {
        current += incrementBy;
        if (current > maxMinutes) {
            current = maxMinutes;
        }
        const newValue = `${current}/${total} min`;
        el.textContent = newValue;
        saveProgress(id, newValue);
    }
}

function setOfferSent() {
    increment('offerSent');
}

let focusInterval;
let focusTime = 0;

function startFocusTimer() {
    const el = document.getElementById('focus');
    const dot = document.getElementById('focus-dot');

    focusTime = parseInt(localStorage.getItem('focusTime')) || 0;
    dot.classList.add('blink');
    focusInterval = setInterval(() => {
        focusTime++;
        if (focusTime <= 120) {
            const newValue = `${focusTime}/120 min.`;
            el.textContent = newValue;
            saveProgress('focus', newValue);
            saveProgress('focusTime', focusTime);
        } else {
            clearInterval(focusInterval);
        }
    }, 60000);

    localStorage.setItem('focusStatus', 'running');
}

function stopFocusTimer() {
    clearInterval(focusInterval);
    document.getElementById('focus-dot').classList.remove('blink');
    localStorage.setItem('focusStatus', 'stopped');
}

function toggleFocus() {
    const dot = document.getElementById('focus-dot');
    if (dot.classList.contains('blink')) {
        stopFocusTimer();
    } else {
        startFocusTimer();
    }
}

function createNewDay() {
    localStorage.clear();
    document.querySelectorAll('.item .value').forEach(el => {
        const id = el.id;
        if (id === 'water') {
            el.textContent = '0% (i alt 0.0 liter)';
        } else if (id === 'focus') {
            el.textContent = '0/120 min.';
        } else if (id === 'mindfulness') {
            el.textContent = '0/45 min';
        } else if (id === 'offerSent') {
            el.textContent = '0 kr.';
        } else {
            el.textContent = '0';
        }
    });
    focusTime = 0;
    localStorage.setItem('focusTime', '0');
}
