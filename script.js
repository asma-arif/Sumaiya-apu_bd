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

// --- Flow Logic ---
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelopeContainer = document.getElementById('envelopeContainer');
const transitionStage = document.getElementById('transitionStage');
const toCandlesBtn = document.getElementById('toCandlesBtn');
const candleStage = document.getElementById('candleStage');
const candleCardBox = document.getElementById('candleCardBox');
const letterStage = document.getElementById('letterStage');
const doneBtn = document.getElementById('doneBtn');

// 1. Open Envelope -> Transition Screen & Music start
envelopeContainer.addEventListener('click', () => {
    envelopeWrapper.style.display = 'none';
    transitionStage.classList.add('active');
    playSpiritSoundtrack();
});

// 2. Click Proceed -> Go to Candles
toCandlesBtn.addEventListener('click', () => {
    transitionStage.classList.remove('active');
    candleStage.classList.add('active');
    loadCandleStage(1);
});

// 3. Three Consecutive Candle Blows
const candleSteps = [
    {
        step: 1,
        title: "First Birthday Candle 🎂",
        msg: "🕯️ Blow or tap the 1st candle to make your first wish!"
    },
    {
        step: 2,
        title: "Second Birthday Candle 🎂",
        msg: "🕯️ Blow or tap the 2nd candle for happiness and peace!"
    },
    {
        step: 3,
        title: "Final Birthday Candle 🎂",
        msg: "🕯️ Blow or tap the final candle to unlock your Special Wish Letter!"
    }
];

function loadCandleStage(num) {
    if (num > 3) {
        candleStage.classList.remove('active');
        letterStage.classList.add('active');
        return;
    }

    const current = candleSteps[num - 1];
    candleCardBox.innerHTML = `
        <h3 style="font-family: 'Cinzel', serif; color: var(--gold); margin-bottom: 12px;">${current.title}</h3>
        <p style="color: #ccc; margin-bottom: 15px; font-size: 1.1rem;">${current.msg}</p>
        <div class="candle-box" id="blowBtn">🎂 Blow Candle (${num}/3)</div>
    `;

    document.getElementById('blowBtn').addEventListener('click', () => {
        loadCandleStage(num + 1);
    });
}

// 4. Done Reading -> Reseal Envelope
doneBtn.addEventListener('click', () => {
    isPlaying = false;
    letterStage.classList.remove('active');
    setTimeout(() => {
        envelopeWrapper.style.display = 'flex';
    }, 400);
});

// --- Particle FX ---
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
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedY = -Math.random() * 1.5 - 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.color = Math.random() > 0.3 ? '#ff2a2a' : '#ffcc00';
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.004;
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