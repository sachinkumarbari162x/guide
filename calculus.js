/**
 * Calculus Learning Guide - Interactive JavaScript
 * Visualizations for derivatives, integrals, and limits
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initDerivativeCanvas();
    initIntegralCanvas();
    initLimitCanvas();
    initChainRuleDemo();
    initScrollAnimations();
});

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        header.style.background = window.scrollY > 100
            ? 'rgba(10, 10, 18, 0.98)'
            : 'rgba(10, 10, 18, 0.95)';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ============================================
// Tabs
// ============================================

function initTabs() {
    document.querySelectorAll('.tabs').forEach(container => {
        const buttons = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                panels.forEach(p => {
                    p.classList.remove('active');
                    if (p.id === btn.dataset.tab) p.classList.add('active');
                });
            });
        });
    });
}

// ============================================
// Derivative Visualization
// ============================================

function initDerivativeCanvas() {
    const canvas = document.getElementById('derivative-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let func = 'x^2';
    let pointX = 1;
    let showTangent = true;

    // Function definitions
    const functions = {
        'x^2': { f: x => x * x, df: x => 2 * x, label: 'f(x) = x²', dfLabel: "f'(x) = 2x" },
        'sin(x)': { f: x => Math.sin(x), df: x => Math.cos(x), label: 'f(x) = sin(x)', dfLabel: "f'(x) = cos(x)" },
        'x^3': { f: x => x * x * x, df: x => 3 * x * x, label: 'f(x) = x³', dfLabel: "f'(x) = 3x²" },
        'e^x': { f: x => Math.exp(x), df: x => Math.exp(x), label: 'f(x) = eˣ', dfLabel: "f'(x) = eˣ" },
        '1/x': { f: x => 1 / x, df: x => -1 / (x * x), label: 'f(x) = 1/x', dfLabel: "f'(x) = -1/x²" }
    };

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const scale = 40;
        const originX = w / 2;
        const originY = h / 2;

        // Clear
        ctx.fillStyle = '#080810';
        ctx.fillRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(255, 123, 84, 0.1)';
        ctx.lineWidth = 1;
        for (let x = originX % scale; x < w; x += scale) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = originY % scale; y < h; y += scale) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, originY); ctx.lineTo(w, originY);
        ctx.moveTo(originX, 0); ctx.lineTo(originX, h);
        ctx.stroke();

        const currentFunc = functions[func];

        // Draw function curve
        ctx.strokeStyle = '#ff7b54';
        ctx.lineWidth = 3;
        ctx.beginPath();
        let first = true;
        for (let px = 0; px < w; px++) {
            const x = (px - originX) / scale;
            const y = currentFunc.f(x);
            const py = originY - y * scale;

            if (py > -100 && py < h + 100) {
                if (first) { ctx.moveTo(px, py); first = false; }
                else ctx.lineTo(px, py);
            } else {
                first = true;
            }
        }
        ctx.stroke();

        // Point on curve
        const px = originX + pointX * scale;
        const py = originY - currentFunc.f(pointX) * scale;

        ctx.fillStyle = '#ffd93d';
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();

        // Tangent line
        if (showTangent) {
            const slope = currentFunc.df(pointX);
            const tangentLength = 150;

            ctx.strokeStyle = '#6bcbff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(px - tangentLength, py + tangentLength * slope);
            ctx.lineTo(px + tangentLength, py - tangentLength * slope);
            ctx.stroke();
            ctx.setLineDash([]);

            // Slope value
            ctx.fillStyle = '#6bcbff';
            ctx.font = '14px Fira Code';
            ctx.fillText(`Slope = ${slope.toFixed(3)}`, px + 15, py - 15);
        }

        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '14px Inter';
        ctx.fillText(currentFunc.label, 20, 30);
        ctx.fillStyle = '#6bcbff';
        ctx.fillText(currentFunc.dfLabel, 20, 50);
        ctx.fillStyle = '#ffd93d';
        ctx.fillText(`Point: (${pointX.toFixed(2)}, ${currentFunc.f(pointX).toFixed(2)})`, 20, 70);
    }

    // Controls
    const funcSelect = document.getElementById('func-select');
    if (funcSelect) {
        funcSelect.addEventListener('change', (e) => { func = e.target.value; draw(); });
    }

    const pointSlider = document.getElementById('point-x');
    if (pointSlider) {
        pointSlider.addEventListener('input', (e) => {
            pointX = parseFloat(e.target.value);
            document.getElementById('point-x-val').textContent = pointX.toFixed(2);
            draw();
        });
    }

    const tangentBtn = document.getElementById('toggle-tangent');
    if (tangentBtn) {
        tangentBtn.addEventListener('click', () => {
            showTangent = !showTangent;
            tangentBtn.textContent = showTangent ? 'Hide Tangent' : 'Show Tangent';
            draw();
        });
    }

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Integral (Area Under Curve) Visualization
// ============================================

function initIntegralCanvas() {
    const canvas = document.getElementById('integral-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let numRects = 10;
    let method = 'left';
    let a = 0, b = 3;

    const f = x => x * x; // x²

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const scale = 40;
        const originX = 80;
        const originY = h - 60;

        ctx.fillStyle = '#080810';
        ctx.fillRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(255, 123, 84, 0.1)';
        ctx.lineWidth = 1;
        for (let x = originX; x < w; x += scale) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = originY; y > 0; y -= scale) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX - 20, originY); ctx.lineTo(w, originY);
        ctx.moveTo(originX, originY + 20); ctx.lineTo(originX, 20);
        ctx.stroke();

        // Draw rectangles
        const dx = (b - a) / numRects;
        let riemannSum = 0;

        for (let i = 0; i < numRects; i++) {
            let sampleX;
            if (method === 'left') sampleX = a + i * dx;
            else if (method === 'right') sampleX = a + (i + 1) * dx;
            else sampleX = a + (i + 0.5) * dx;

            const height = f(sampleX);
            riemannSum += height * dx;

            const rectX = originX + (a + i * dx) * scale;
            const rectW = dx * scale;
            const rectH = height * scale;

            ctx.fillStyle = 'rgba(107, 203, 255, 0.3)';
            ctx.fillRect(rectX, originY - rectH, rectW, rectH);
            ctx.strokeStyle = '#6bcbff';
            ctx.lineWidth = 1;
            ctx.strokeRect(rectX, originY - rectH, rectW, rectH);
        }

        // Draw curve
        ctx.strokeStyle = '#ff7b54';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let px = originX; px < w; px++) {
            const x = (px - originX) / scale;
            const y = f(x);
            const py = originY - y * scale;
            if (px === originX) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Actual integral
        const actualIntegral = (b * b * b - a * a * a) / 3; // ∫x² dx = x³/3

        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '14px Fira Code';
        ctx.fillText(`f(x) = x²`, 20, 30);
        ctx.fillStyle = '#6bcbff';
        ctx.fillText(`Riemann Sum (n=${numRects}): ${riemannSum.toFixed(4)}`, 20, 50);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`Exact ∫₀³ x² dx = ${actualIntegral.toFixed(4)}`, 20, 70);
        ctx.fillStyle = '#ffd93d';
        ctx.fillText(`Error: ${Math.abs(riemannSum - actualIntegral).toFixed(4)}`, 20, 90);
    }

    // Controls
    const rectsSlider = document.getElementById('num-rects');
    if (rectsSlider) {
        rectsSlider.addEventListener('input', (e) => {
            numRects = parseInt(e.target.value);
            document.getElementById('num-rects-val').textContent = numRects;
            draw();
        });
    }

    const methodBtns = document.querySelectorAll('.method-btn');
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            method = btn.dataset.method;
            draw();
        });
    });

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Limit Visualization
// ============================================

function initLimitCanvas() {
    const canvas = document.getElementById('limit-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let epsilon = 0.5;
    let delta = 0.5;
    const L = 4; // limit value
    const c = 2; // approaching point

    // f(x) = x² (limit as x→2 is 4)
    const f = x => x * x;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const scale = 50;
        const originX = 80;
        const originY = h - 80;

        ctx.fillStyle = '#080810';
        ctx.fillRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(255, 123, 84, 0.1)';
        ctx.lineWidth = 1;
        for (let x = originX; x < w; x += scale) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = originY; y > 0; y -= scale) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Epsilon band (horizontal)
        const epsilonTop = originY - (L + epsilon) * scale;
        const epsilonBottom = originY - (L - epsilon) * scale;
        ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
        ctx.fillRect(0, epsilonTop, w, epsilonBottom - epsilonTop);

        ctx.strokeStyle = '#4ade80';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, epsilonTop); ctx.lineTo(w, epsilonTop);
        ctx.moveTo(0, epsilonBottom); ctx.lineTo(w, epsilonBottom);
        ctx.stroke();
        ctx.setLineDash([]);

        // Delta band (vertical)
        const deltaLeft = originX + (c - delta) * scale;
        const deltaRight = originX + (c + delta) * scale;
        ctx.fillStyle = 'rgba(167, 139, 250, 0.15)';
        ctx.fillRect(deltaLeft, 0, deltaRight - deltaLeft, h);

        ctx.strokeStyle = '#a78bfa';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(deltaLeft, 0); ctx.lineTo(deltaLeft, h);
        ctx.moveTo(deltaRight, 0); ctx.lineTo(deltaRight, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Point c on x-axis
        ctx.strokeStyle = '#ffd93d';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(originX + c * scale, originY);
        ctx.lineTo(originX + c * scale, originY - L * scale);
        ctx.lineTo(originX, originY - L * scale);
        ctx.stroke();
        ctx.setLineDash([]);

        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX - 20, originY); ctx.lineTo(w, originY);
        ctx.moveTo(originX, originY + 20); ctx.lineTo(originX, 20);
        ctx.stroke();

        // Draw function
        ctx.strokeStyle = '#ff7b54';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let px = originX; px < w; px++) {
            const x = (px - originX) / scale;
            const y = f(x);
            const py = originY - y * scale;
            if (py > 0 && py < h) {
                if (px === originX) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
        }
        ctx.stroke();

        // Point at limit
        ctx.fillStyle = '#ffd93d';
        ctx.beginPath();
        ctx.arc(originX + c * scale, originY - L * scale, 8, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '14px Fira Code';
        ctx.fillText('f(x) = x²', 20, 30);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`ε = ${epsilon.toFixed(2)} (vertical band)`, 20, 50);
        ctx.fillStyle = '#a78bfa';
        ctx.fillText(`δ = ${delta.toFixed(2)} (horizontal band)`, 20, 70);
        ctx.fillStyle = '#ffd93d';
        ctx.fillText(`lim(x→${c}) f(x) = ${L}`, 20, 90);

        // Axis labels
        ctx.fillStyle = '#fff';
        ctx.fillText(`c=${c}`, originX + c * scale - 10, originY + 20);
        ctx.fillText(`L=${L}`, originX - 35, originY - L * scale + 5);
    }

    // Controls
    const epsilonSlider = document.getElementById('epsilon-slider');
    if (epsilonSlider) {
        epsilonSlider.addEventListener('input', (e) => {
            epsilon = parseFloat(e.target.value);
            document.getElementById('epsilon-val').textContent = epsilon.toFixed(2);
            draw();
        });
    }

    const deltaSlider = document.getElementById('delta-slider');
    if (deltaSlider) {
        deltaSlider.addEventListener('input', (e) => {
            delta = parseFloat(e.target.value);
            document.getElementById('delta-val').textContent = delta.toFixed(2);
            draw();
        });
    }

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Chain Rule Demo
// ============================================

function initChainRuleDemo() {
    const demo = document.getElementById('chain-rule-demo');
    if (!demo) return;

    const output = demo.querySelector('.demo-output');
    const runBtn = document.getElementById('run-chain');

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            output.innerHTML = '';

            const steps = [
                { text: 'Given: y = sin(x²)', color: '#ff7b54' },
                { text: 'Let u = x² (inner function)', color: '#6bcbff' },
                { text: 'Then y = sin(u) (outer function)', color: '#6bcbff' },
                { text: 'dy/du = cos(u) = cos(x²)', color: '#a78bfa' },
                { text: 'du/dx = 2x', color: '#a78bfa' },
                { text: 'Chain Rule: dy/dx = (dy/du) × (du/dx)', color: '#ffd93d' },
                { text: 'dy/dx = cos(x²) × 2x = 2x·cos(x²)', color: '#4ade80' },
            ];

            steps.forEach((step, i) => {
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.style.color = step.color;
                    div.style.padding = '0.5rem 0';
                    div.style.fontFamily = "'Fira Code', monospace";
                    div.style.opacity = '0';
                    div.style.transform = 'translateX(-20px)';
                    div.style.transition = 'all 0.3s ease';
                    div.textContent = step.text;
                    output.appendChild(div);

                    setTimeout(() => {
                        div.style.opacity = '1';
                        div.style.transform = 'translateX(0)';
                    }, 50);
                }, i * 500);
            });
        });
    }
}

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .math-box, .path-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Derivative Calculator Helper
// ============================================

window.calculateDerivative = function (func, x, h = 0.0001) {
    // Numerical derivative using central difference
    const f = eval(`(x) => ${func}`);
    return (f(x + h) - f(x - h)) / (2 * h);
};

console.log('📈 Calculus Guide Loaded');
