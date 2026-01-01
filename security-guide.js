/* ============================================
   Security Guide - Interactive Logic
   Matrix Rain, SQLi Sim, Hashing
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMatrixRain();
});

/* ----------------------------------------------------------------
   1. Matrix Rain Background
   ---------------------------------------------------------------- */
function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    // Full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];

    // Initialize drops
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    const draw = () => {
        // Black with slight opacity for trail effect
        ctx.fillStyle = 'rgba(2, 2, 2, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Hacker Green
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    setInterval(draw, 30);

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/* ----------------------------------------------------------------
   2. SQL Injection Visualizer
   ---------------------------------------------------------------- */
function simulateSQL() {
    const input = document.getElementById('sqlInput').value;
    const output = document.getElementById('sqlOutput');
    const resultBox = document.getElementById('sqlResult');

    // Construct the query visually
    const baseQuery = "SELECT * FROM users WHERE user_id = '";
    const endQuery = "';";

    // Highlight the dangerous part
    // If input contains ' OR, it breaks the string
    let highlightedInput = input.replace(/'/g, "<span class='text-red'>'</span>");

    // logic detection
    const isVulnerable = input.includes("'") && (input.toUpperCase().includes("OR") || input.includes("--"));

    output.innerHTML = `${baseQuery}<span style="color: #fff; font-weight: bold;">${highlightedInput}</span>${endQuery}`;

    resultBox.style.display = 'block';
    if (isVulnerable) {
        resultBox.innerHTML = `
            <span class="text-red">> ALERT: SQL INJECTION DETECTED</span><br>
            > DUMPING ALL USER DATA...<br>
            > admin, user1, user2... (ACCESS GRANTED)
        `;
        resultBox.style.borderColor = '#ff003c';
        output.classList.add('attack-anim');
        setTimeout(() => output.classList.remove('attack-anim'), 500);
    } else {
        resultBox.innerHTML = `> Query executed. Finding user with ID: ${input}`;
        resultBox.style.borderColor = '#0f0';
    }
}

/* ----------------------------------------------------------------
   3. Hashing Visualizer (SHA-256 Simulation)
   ---------------------------------------------------------------- */
async function updateHash() {
    const input = document.getElementById('hashInput').value;
    const output = document.getElementById('hashOutput');

    if (input.length === 0) {
        output.textContent = "Waiting for input...";
        return;
    }

    // SHA-256 Implementation
    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    output.innerHTML = `
        <span style="color: #707070;">INPUT:</span> "${input}"<br>
        <span style="color: #707070;">HASH:</span> <span class="text-green">${hashHex.substring(0, 32)}...</span>
    `;

    // Visual Pulse for "Avalanche Effect"
    output.style.textShadow = '0 0 10px #00e5ff';
    setTimeout(() => output.style.textShadow = 'none', 200);
}
