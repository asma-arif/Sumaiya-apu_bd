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
    setupMicrophoneBlow();
});

// Candle Data
const candleSteps = [
    { title: "First Birthday Candle 🎂", hint: "🎙️ Blow into microphone or tap to make a wish!" },
    { title: "Second Birthday Candle 🎂", hint: "🕯️ Blow or tap for endless joy & peace!" },
    { title: "Final Birthday Candle 🎂", hint: "✨ Blow or tap to unlock your Special Letter!" }
];

function blowCurrentCandle() {
    candleFlame.style.display = 'none';
    triggerFireworks();

    setTimeout(() => {
        currentStep++;
        if (currentStep > 3) {
            candleStage.classList.remove('active');
            letterStage.classList.add('active');
            startTypewriterLetter();
        } else {
            candleFlame.style.display = 'block';
            candleTitle.innerText = candleSteps[currentStep - 1].title;
            candleHint.innerText = candleSteps[currentStep - 1].hint;
            blowBtn.innerText = `🎂 Blow / Tap Candle (${currentStep}/3)`;
        }
    }, 800);
}

blowBtn.addEventListener('click', blowCurrentCandle);

// --- Real Microphone Blow Sensor ---
function setupMicrophoneBlow() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const micAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const mic = micAudioCtx.createMediaStreamSource(stream);
            const analyser = micAudioCtx.createAnalyser();
            analyser.fftSize = 256;
            mic.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            function checkBlow() {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
                let average = sum / bufferLength;

                if (average > 65 && candleFlame.style.display !== 'none') {
                    blowCurrentCandle();
                }
                requestAnimationFrame(checkBlow);
            }
            checkBlow();
        }).catch(() => {
            // Microphone access declined; tap works as backup
        });
    }
}

// --- Typewriter Effect for Letter ---
const letterText = `Happy Birthday, Sumaiya Apu! ❤️‍d🎂❤️

I honestly don't know where to start, because you are one of those people in my life who mean so much more to me than words can ever explain. Sometimes, I genuinely feel that Allah sends certain people into our lives as a blessing, and you are one of those blessings for me. Alhamdulillah for you. 🥹❤️

Apu, you have such a beautiful heart. The way you care, the way you support me, the way you help me, and the way you make me feel understood mean more to me than you probably realize. You are not just my cousin or someone older than me whom I respect. You are someone I feel deeply connected to, someone I can share things with, someone whose presence makes a difference in my life. And I hope you know that you will always have a very special place in my heart. 🫶🏻

I know life hasn't always been kind to you. Maybe there are days when your heart feels heavier than you let anyone see. Maybe you smile, act strong, and keep so many things to yourself even when you're hurting inside. I may not know every pain you carry, and I may not always know how to make things better for you, but I want you to know one thing: you don't always have to be strong. You don't always have to hide your pain. And you don't have to go through everything alone. You deserve the same care, comfort, kindness, and love that you so freely give to others. 🥺❤️

On your birthday, my biggest wish for you is that Allah gives your heart the peace it has been searching for. May He heal every wound you never talk about, ease every burden you silently carry, and replace your tears with genuine happiness. May Allah bless you with beautiful days, sincere people, endless barakah, and a kind of peace that stays even when life gets difficult. May He give you countless reasons to smile—not just in front of others, but from the deepest part of your heart. Ameen. 🤍✨

And Apu, please never forget that your worth is not defined by how others treat you, what you've been through, or how much pain you've had to endure. You are worthy of love, respect, happiness, and every beautiful thing this world has to offer, simply because you are you. You don't have to prove your strength to anyone, and you don't have to earn the love you deserve.

Thank you for being there for me, for supporting me, for helping me, and for trusting me with the parts of yourself that you don't share with everyone. I value that trust more than you know. I hope I can be someone you can always feel safe with, just as you've been such a special person in my life. ❤️

I pray that this new chapter of your life brings you closer to the happiness you've always deserved. May Allah write so much goodness in your destiny that one day you look back at everything you've been through and realize that there is still so much beauty waiting for you.

Happy Birthday to one of the most special people Allah has blessed my life with. 🥹❤️

I love you so much, Sumaiya Apu. May Allah always protect your beautiful heart, keep you surrounded by genuine love, and grant you a life filled with peace, happiness, and endless blessings. You deserve so much more goodness than words could ever express.

Always remember, no matter what life brings, you have someone in me who genuinely cares about you. Lots and lots of love for you, Apu. 🫂❤️‍d✨`;

function startTypewriterLetter() {
    const letterContainer = document.getElementById('typewriterLetter');
    letterContainer.innerText = '';
    let i = 0;

    function typeChar() {
        if (i < letterText.length) {
            letterContainer.innerText += letterText.charAt(i);
            i++;
            setTimeout(typeChar, 12);
        }
    }
    typeChar();
}

// 4. Done Reading -> Reseal Envelope
doneBtn.addEventListener('click', () => {
    isPlaying = false;
    letterStage.classList.remove('active');
    currentStep = 1;
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