
/* ==========================================
   NEON ARCADE — MATRIX HACKER MODE 💚
========================================== */

let score = 0;
let hackerMode = false;

const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");

const pointsBtn = document.getElementById("pointsBtn");
const fireworksBtn = document.getElementById("fireworksBtn");
const hackerBtn = document.getElementById("hackerBtn");

const fireCanvas = document.getElementById("fireworks");
const fireCtx = fireCanvas.getContext("2d");

// ===== MATRIX CANVAS =====

const matrixCanvas = document.createElement("canvas");
matrixCanvas.id = "matrix";
document.body.prepend(matrixCanvas);

const matrixCtx = matrixCanvas.getContext("2d");

let matrixWidth = 0;
let matrixHeight = 0;
let fontSize = 16;
let columns = 0;
let drops = [];
let matrixAnimation = null;

function resizeMatrix() {
    const dpr = window.devicePixelRatio || 1;

    matrixWidth = window.innerWidth;
    matrixHeight = window.innerHeight;

    matrixCanvas.width = matrixWidth * dpr;
    matrixCanvas.height = matrixHeight * dpr;

    matrixCanvas.style.width = matrixWidth + "px";
    matrixCanvas.style.height = matrixHeight + "px";

    matrixCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(matrixWidth / fontSize);

    drops = Array.from(
        { length: columns },
        () => Math.random() * (matrixHeight / fontSize)
    );
}

resizeMatrix();

window.addEventListener("resize", () => {
    resizeMatrix();
    resizeFireworks();
});

// ===== MATRIX ANIMATION =====

function drawMatrix() {
    if (!hackerMode) {
        matrixAnimation = null;
        return;
    }

    // Przyciemnianie poprzedniej klatki tworzy ślad cyfr
    matrixCtx.fillStyle = "rgba(0, 8, 0, 0.09)";
    matrixCtx.fillRect(0, 0, matrixWidth, matrixHeight);

    matrixCtx.font = `bold ${fontSize}px Consolas, monospace`;

    const characters = "01010101010101";

    for (let i = 0; i < drops.length; i++) {
        const char = characters[
            Math.floor(Math.random() * characters.length)
        ];

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Losowe jaśniejsze cyfry
        if (Math.random() > 0.97) {
            matrixCtx.fillStyle = "#d6ffdf";
            matrixCtx.shadowColor = "#00ff41";
            matrixCtx.shadowBlur = 15;
        } else {
            matrixCtx.fillStyle = "#00ff41";
            matrixCtx.shadowColor = "#00ff41";
            matrixCtx.shadowBlur = 5;
        }

        matrixCtx.fillText(char, x, y);

        // Losowe resetowanie kolumn
        if (
            y > matrixHeight &&
            Math.random() > 0.975
        ) {
            drops[i] = 0;
        } else {
            drops[i] += Math.random() * 0.7 + 0.4;
        }
    }

    matrixCtx.shadowBlur = 0;

    matrixAnimation = requestAnimationFrame(drawMatrix);
}

// ===== WŁĄCZANIE I WYŁĄCZANIE MATRIXA =====

function enableHackerMode() {
    hackerMode = true;

    document.body.classList.add("hacker-mode");

    // Czyścimy poprzedni obraz
    matrixCtx.clearRect(0, 0, matrixWidth, matrixHeight);

    // Reset kolumn, żeby efekt ruszył od razu
    drops = Array.from(
        { length: columns },
        () => Math.random() * (matrixHeight / fontSize)
    );

    hackerBtn.textContent = "🔓 WYŁĄCZ TRYB HAKERA";

    setMessage("ACCESS GRANTED // MATRIX ONLINE...");

    if (matrixAnimation === null) {
        drawMatrix();
    }
}

function disableHackerMode() {
    hackerMode = false;

    document.body.classList.remove("hacker-mode");

    if (matrixAnimation !== null) {
        cancelAnimationFrame(matrixAnimation);
        matrixAnimation = null;
    }

    matrixCtx.clearRect(0, 0, matrixWidth, matrixHeight);

    hackerBtn.textContent = "👾 TRYB HAKERA";

    setMessage("SYSTEM PRZYWRÓCONY // WITAJ PONOWNIE!");
}

hackerBtn.addEventListener("click", () => {
    if (hackerMode) {
        disableHackerMode();
    } else {
        enableHackerMode();
    }
});

// ===== PUNKTY =====

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function setMessage(text) {
    messageElement.textContent = text;
}

pointsBtn.addEventListener("click", () => {
    const gained = Math.floor(random(10, 51));

    score += gained;
    scoreElement.textContent = score;

    setMessage(`⚡ +${gained} PUNKTÓW! ŚWIETNA ROBOTA!`);
});

// ===== FAJERWERKI =====

let particles = [];
let fireAnimation = null;

function resizeFireworks() {
    const dpr = window.devicePixelRatio || 1;

    fireCanvas.width = window.innerWidth * dpr;
    fireCanvas.height = window.innerHeight * dpr;

    fireCanvas.style.width = window.innerWidth + "px";
    fireCanvas.style.height = window.innerHeight + "px";

    fireCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeFireworks();

function createFirework(x, y) {
    const colors = [
        "#00eaff",
        "#ff4dff",
        "#00ff9d",
        "#ffff00",
        "#ff7043"
    ];

    const color = colors[
        Math.floor(Math.random() * colors.length)
    ];

    for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = random(1.5, 7);

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: random(0.008, 0.02),
            size: random(1.5, 4),
            color
        });
    }
}

function animateFireworks() {
    fireCtx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    particles = particles.filter(p => p.life > 0);

    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += 0.035;

        p.life -= p.decay;

        fireCtx.globalAlpha = Math.max(0, p.life);
        fireCtx.fillStyle = p.color;
        fireCtx.shadowBlur = 15;
        fireCtx.shadowColor = p.color;

        fireCtx.beginPath();
        fireCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fireCtx.fill();
    }

    fireCtx.globalAlpha = 1;
    fireCtx.shadowBlur = 0;

    if (particles.length > 0) {
        fireAnimation = requestAnimationFrame(animateFireworks);
    } else {
        fireAnimation = null;
        fireCtx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
    }
}

function launchFirework(x, y) {
    createFirework(x, y);

    if (fireAnimation === null) {
        fireAnimation = requestAnimationFrame(animateFireworks);
    }
}

fireworksBtn.addEventListener("click", () => {
    launchFirework(
        random(100, Math.max(101, window.innerWidth - 100)),
        random(100, Math.max(101, window.innerHeight - 150))
    );

    score += 5;
    scoreElement.textContent = score;

    setMessage("🎆 BOOM! NEONOWA EKSPLOZJA!");
});

// Kliknięcie poza przyciskami = fajerwerk
document.addEventListener("click", event => {
    if (event.target.closest("button")) {
        return;
    }

    launchFirework(event.clientX, event.clientY);
});

// ===== START SYSTEMU =====

setMessage("SYSTEM ONLINE // GOTOWY DO DZIAŁANIA ⚡");

console.log("NEON ARCADE ONLINE!");
console.log("HACKER MODE: READY");
