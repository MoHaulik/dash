document.addEventListener('DOMContentLoaded', () => {
    loadProgress();

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
}

function saveProgress(id, value) {
    localStorage.setItem(id, value);
}

function increment(id) {
    const el = document.getElementById(id);
    let current = parseInt(el.textContent);
    current++;
    const newValue = current;
    el.textContent = newValue;
    saveProgress(id, newValue);
}

function incrementWater() {
    const el = document.getElementById('water');
    let [percent, details] = el.textContent.split(' ');
    let liters = parseFloat(details.match(/[\d.]+/)[0]);
    if (liters < 3.8) {
        liters += 0.25;
        percent = Math.round((liters / 3.8) * 100);
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
    const newOffer = prompt("Indtast tilbudsbeløb (kr):", "0");
    if (newOffer !== null) {
        const newValue = `${newOffer} kr.`;
        document.getElementById('offerSent').textContent = newValue;
        saveProgress('offerSent', newValue);
    }
}

let focusInterval;

function toggleFocus() {
    const el = document.getElementById('focus');
    const dot = document.getElementById('focus-dot');
    let [current, total] = el.textContent.split('/').map(s => s.split(' ')[0]).map(Number);
    if (!dot.classList.contains('blink')) {
        dot.classList.add('blink');
        focusInterval = setInterval(() => {
            if (current < total) {
                current++;
                const newValue = `${current}/120 min.`;
                el.textContent = newValue;
                saveProgress('focus', newValue);
            }
        }, 60000);
    } else {
        clearInterval(focusInterval);
        dot.classList.remove('blink');
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
}
