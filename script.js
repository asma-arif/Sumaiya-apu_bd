// --- Web Audio API Atmospheric Synth (Spirit Movie Theme Vibe) ---
let audioCtx = null;
let isPlaying = false;

function playSpiritSoundtrack() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    isPlaying = true;
    const notes = [220, 277.18, 329.63, 440, 329.63, 277.18];
    let idx = 0;

    const interval = setInterval(() => {
        if (!isPlaying) { clearInterval(interval); return; }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[idx], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.2);
        idx = (idx + 1) % notes.length;
    }, 650);
}

// --- Flow Logic & Elements ---
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelopeContainer = document.getElementById('envelopeContainer');
const transitionStage = document.getElementById('transitionStage');
const toCandlesBtn = document.getElementById('toCandlesBtn');
const candleStage = document.getElementById('candleStage');
const letterStage = document.getElementById('letterStage');
const doneBtn = document.getElementById('doneBtn');

const candleTitle = document.getElementById('candleTitle');
const candleFlame = document.getElementById('candleFlame');
const candleHint = document.getElementById('candleHint');
const blowBtn = document.getElementById('blowBtn');
const cakeSvg = document.getElementById('cakeSvg');

let currentStep = 1;

// 1. Open Envelope
envelopeContainer.addEventListener('click', () => {
    envelopeWrapper.style.display = 'none';
    transitionStage.classList.add('active');
    playSpiritSoundtrack();
});

// 2. Click Proceed -> Start Candles
toCandlesBtn.addEventListener('click', () => {
    transitionStage.classList.remove('active');
    candleStage.classList.add('active');
});

// Candle Steps Data
const candleSteps = [
    { title: "First Birthday Candle 🎂", hint: "🕯️ Tap the candle to blow it out & make a wish!" },
    { title: "Second Birthday Candle 🎂", hint: "🕯️ Tap to blow it out for endless joy & peace!" },
    { title: "Final Birthday Candle 🎂", hint: "✨ Tap the last candle to unlock your Special Letter!" }
];

function blowCurrentCandle() {
    candleFlame.style.display = 'none';
    triggerFireworks();

    setTimeout(() => {
        currentStep++;
        if (currentStep > 3) {
            candleStage.classList.remove('active');
            letterStage.classList.add('active');
        } else {
            candleFlame.style.display = 'block';
            candleTitle.innerText = candleSteps[currentStep - 1].title;
            candleHint.innerText = candleSteps[currentStep - 1].hint;
            blowBtn.innerText = `🎂 Tap to Blow Candle (${currentStep}/3)`;
        }
    }, 800);
}

// Click/Tap Handlers
blowBtn.addEventListener('click', blowCurrentCandle);
cakeSvg.addEventListener('click', blowCurrentCandle);

// 3. Done Reading -> Reseal Envelope
doneBtn.addEventListener('click', () => {
    isPlaying = false;
    letterStage.classList.remove('active');
    currentStep = 1;
    candleFlame.style.display = 'block';
    candleTitle.innerText = candleSteps[0].title;
    candleHint.innerText = candleSteps[0].hint;
    blowBtn.innerText = `🎂 Tap to Blow Candle (1/3)`;
    setTimeout(() => {
        envelopeWrapper.style.display = 'flex';
    }, 400);
});

// --- Particle FX & Fireworks ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor(x, y, isExplosion = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedY = isExplosion ? (Math.random() - 0.5) * 8 : -Math.random() * 1.5 - 0.5;
        this.speedX = isExplosion ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.color = Math.random() > 0.3 ? '#ff2a2a' : '#ffcc00';
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.005;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function triggerFireworks() {
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(canvas.width / 2, canvas.height / 2, true));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, idx) => {
        p.update();
        p.draw();
        if (p.opacity <= 0) particles.splice(idx, 1);
    });

    if (particles.length < 50) particles.push(new Particle());
    requestAnimationFrame(animate);
}
animate();