/**
 * Probability & Statistics Learning Guide - Interactive JavaScript
 * Visualizations for distributions, Bayes, and statistical concepts
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDistributionCanvas();
    initBayesCalculator();
    initCLTCanvas();
    initHypothesisDemo();
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
            ? 'rgba(8, 8, 18, 0.98)'
            : 'rgba(8, 8, 18, 0.95)';
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
// Probability Distributions
// ============================================

function initDistributionCanvas() {
    const canvas = document.getElementById('distribution-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let distType = 'normal';
    let params = { mean: 0, std: 1, lambda: 3, n: 10, p: 0.5 };

    // Distribution functions
    const distributions = {
        normal: {
            pdf: (x, mean, std) => {
                const exp = -0.5 * Math.pow((x - mean) / std, 2);
                return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exp);
            },
            range: () => [params.mean - 4 * params.std, params.mean + 4 * params.std]
        },
        exponential: {
            pdf: (x, lambda) => x >= 0 ? lambda * Math.exp(-lambda * x) : 0,
            range: () => [0, 5 / params.lambda + 2]
        },
        uniform: {
            pdf: (x, a, b) => (x >= a && x <= b) ? 1 / (b - a) : 0,
            range: () => [-1, 6]
        }
    };

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const paddingX = 60;
        const paddingY = 40;

        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, w, h);

        const dist = distributions[distType];
        const [xMin, xMax] = dist.range();
        const xRange = xMax - xMin;

        // Find max y for scaling
        let yMax = 0;
        for (let i = 0; i <= 100; i++) {
            const x = xMin + (i / 100) * xRange;
            let y;
            if (distType === 'normal') y = dist.pdf(x, params.mean, params.std);
            else if (distType === 'exponential') y = dist.pdf(x, params.lambda);
            else y = dist.pdf(x, 0, 5);
            if (y > yMax) yMax = y;
        }
        yMax *= 1.1;

        // Draw grid
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const x = paddingX + (i / 10) * (w - 2 * paddingX);
            ctx.beginPath(); ctx.moveTo(x, paddingY); ctx.lineTo(x, h - paddingY); ctx.stroke();
        }
        for (let i = 0; i <= 5; i++) {
            const y = paddingY + (i / 5) * (h - 2 * paddingY);
            ctx.beginPath(); ctx.moveTo(paddingX, y); ctx.lineTo(w - paddingX, y); ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(paddingX, h - paddingY);
        ctx.lineTo(w - paddingX, h - paddingY);
        ctx.moveTo(paddingX, h - paddingY);
        ctx.lineTo(paddingX, paddingY);
        ctx.stroke();

        // Draw distribution curve
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let i = 0; i <= 200; i++) {
            const x = xMin + (i / 200) * xRange;
            let y;
            if (distType === 'normal') y = dist.pdf(x, params.mean, params.std);
            else if (distType === 'exponential') y = dist.pdf(x, params.lambda);
            else y = dist.pdf(x, 0, 5);

            const px = paddingX + ((x - xMin) / xRange) * (w - 2 * paddingX);
            const py = h - paddingY - (y / yMax) * (h - 2 * paddingY);

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Fill under curve
        ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
        ctx.beginPath();
        ctx.moveTo(paddingX, h - paddingY);
        for (let i = 0; i <= 200; i++) {
            const x = xMin + (i / 200) * xRange;
            let y;
            if (distType === 'normal') y = dist.pdf(x, params.mean, params.std);
            else if (distType === 'exponential') y = dist.pdf(x, params.lambda);
            else y = dist.pdf(x, 0, 5);

            const px = paddingX + ((x - xMin) / xRange) * (w - 2 * paddingX);
            const py = h - paddingY - (y / yMax) * (h - 2 * paddingY);
            ctx.lineTo(px, py);
        }
        ctx.lineTo(w - paddingX, h - paddingY);
        ctx.closePath();
        ctx.fill();

        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '14px Fira Code';
        ctx.fillText(`Distribution: ${distType.charAt(0).toUpperCase() + distType.slice(1)}`, 20, 30);

        if (distType === 'normal') {
            ctx.fillText(`μ = ${params.mean.toFixed(1)}, σ = ${params.std.toFixed(1)}`, 20, 50);
        } else if (distType === 'exponential') {
            ctx.fillText(`λ = ${params.lambda.toFixed(1)}`, 20, 50);
        }

        // X-axis labels
        ctx.fillStyle = '#b0b0d0';
        ctx.font = '12px Fira Code';
        for (let i = 0; i <= 5; i++) {
            const x = xMin + (i / 5) * xRange;
            const px = paddingX + (i / 5) * (w - 2 * paddingX);
            ctx.fillText(x.toFixed(1), px - 15, h - 15);
        }
    }

    // Distribution buttons
    document.querySelectorAll('.dist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.dist-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            distType = btn.dataset.dist;
            updateSliderVisibility();
            draw();
        });
    });

    function updateSliderVisibility() {
        document.getElementById('normal-params').style.display = distType === 'normal' ? 'block' : 'none';
        document.getElementById('exp-params').style.display = distType === 'exponential' ? 'block' : 'none';
    }

    // Sliders
    const meanSlider = document.getElementById('mean-slider');
    if (meanSlider) {
        meanSlider.addEventListener('input', (e) => {
            params.mean = parseFloat(e.target.value);
            document.getElementById('mean-val').textContent = params.mean.toFixed(1);
            draw();
        });
    }

    const stdSlider = document.getElementById('std-slider');
    if (stdSlider) {
        stdSlider.addEventListener('input', (e) => {
            params.std = parseFloat(e.target.value);
            document.getElementById('std-val').textContent = params.std.toFixed(1);
            draw();
        });
    }

    const lambdaSlider = document.getElementById('lambda-slider');
    if (lambdaSlider) {
        lambdaSlider.addEventListener('input', (e) => {
            params.lambda = parseFloat(e.target.value);
            document.getElementById('lambda-val').textContent = params.lambda.toFixed(1);
            draw();
        });
    }

    window.addEventListener('resize', resize);
    resize();
    updateSliderVisibility();
}

// ============================================
// Bayes' Theorem Calculator
// ============================================

function initBayesCalculator() {
    const calcBtn = document.getElementById('calc-bayes');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', () => {
        const priorA = parseFloat(document.getElementById('prior-a').value) || 0;
        const likelihoodBA = parseFloat(document.getElementById('likelihood-ba').value) || 0;
        const priorNotA = 1 - priorA;
        const likelihoodBNotA = parseFloat(document.getElementById('likelihood-b-nota').value) || 0;

        // P(B) = P(B|A)P(A) + P(B|¬A)P(¬A)
        const pB = likelihoodBA * priorA + likelihoodBNotA * priorNotA;

        // P(A|B) = P(B|A)P(A) / P(B)
        const posteriorAB = pB > 0 ? (likelihoodBA * priorA) / pB : 0;

        const result = document.getElementById('bayes-result');
        result.innerHTML = `
      <div style="font-family: 'Fira Code', monospace;">
        <div style="color: #22d3ee; margin-bottom: 0.5rem;">📊 Calculation:</div>
        <div style="color: #b0b0d0;">P(B) = P(B|A)·P(A) + P(B|¬A)·P(¬A)</div>
        <div style="color: #b0b0d0;">P(B) = ${likelihoodBA.toFixed(3)} × ${priorA.toFixed(3)} + ${likelihoodBNotA.toFixed(3)} × ${priorNotA.toFixed(3)}</div>
        <div style="color: #a855f7; margin: 0.5rem 0;">P(B) = ${pB.toFixed(4)}</div>
        <div style="color: #22d3ee; font-size: 1.2rem; margin-top: 1rem;">
          P(A|B) = <span style="color: #f472b6; font-weight: bold;">${(posteriorAB * 100).toFixed(2)}%</span>
        </div>
      </div>
    `;
    });
}

// ============================================
// Central Limit Theorem
// ============================================

function initCLTCanvas() {
    const canvas = document.getElementById('clt-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let sampleSize = 30;
    let numSamples = 1000;
    let means = [];

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    function generateSamples() {
        means = [];
        for (let i = 0; i < numSamples; i++) {
            let sum = 0;
            for (let j = 0; j < sampleSize; j++) {
                // Uniform distribution [0, 1]
                sum += Math.random();
            }
            means.push(sum / sampleSize);
        }
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const paddingX = 60;
        const paddingY = 40;

        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, w, h);

        if (means.length === 0) {
            ctx.fillStyle = '#b0b0d0';
            ctx.font = '16px Inter';
            ctx.fillText('Click "Generate Samples" to see the CLT in action', w / 2 - 180, h / 2);
            return;
        }

        // Create histogram
        const bins = 30;
        const histogram = new Array(bins).fill(0);
        const minVal = Math.min(...means);
        const maxVal = Math.max(...means);
        const binWidth = (maxVal - minVal) / bins;

        means.forEach(m => {
            const binIdx = Math.min(Math.floor((m - minVal) / binWidth), bins - 1);
            histogram[binIdx]++;
        });

        const maxCount = Math.max(...histogram);

        // Draw histogram
        const barWidth = (w - 2 * paddingX) / bins;

        histogram.forEach((count, i) => {
            const barHeight = (count / maxCount) * (h - 2 * paddingY);
            const x = paddingX + i * barWidth;
            const y = h - paddingY - barHeight;

            ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
            ctx.fillRect(x, y, barWidth - 2, barHeight);
            ctx.strokeStyle = '#22d3ee';
            ctx.strokeRect(x, y, barWidth - 2, barHeight);
        });

        // Draw normal curve overlay
        const mean = means.reduce((a, b) => a + b, 0) / means.length;
        const variance = means.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / means.length;
        const std = Math.sqrt(variance);

        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let i = 0; i <= 100; i++) {
            const x = minVal + (i / 100) * (maxVal - minVal);
            const pdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
            const scaledPdf = pdf * numSamples * binWidth;

            const px = paddingX + (i / 100) * (w - 2 * paddingX);
            const py = h - paddingY - (scaledPdf / maxCount) * (h - 2 * paddingY);

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Stats
        ctx.fillStyle = '#fff';
        ctx.font = '14px Fira Code';
        ctx.fillText(`Sample size (n): ${sampleSize}`, 20, 30);
        ctx.fillText(`Number of samples: ${numSamples}`, 20, 50);
        ctx.fillStyle = '#22d3ee';
        ctx.fillText(`Sample mean: ${mean.toFixed(4)}`, 20, 70);
        ctx.fillStyle = '#f472b6';
        ctx.fillText(`Sample std: ${std.toFixed(4)}`, 20, 90);
        ctx.fillStyle = '#a855f7';
        ctx.fillText(`Expected std: ${(1 / Math.sqrt(12 * sampleSize)).toFixed(4)}`, 200, 90);
    }

    // Generate button
    const genBtn = document.getElementById('gen-clt');
    if (genBtn) {
        genBtn.addEventListener('click', () => {
            generateSamples();
            draw();
        });
    }

    // Sample size slider
    const sizeSlider = document.getElementById('sample-size');
    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            sampleSize = parseInt(e.target.value);
            document.getElementById('sample-size-val').textContent = sampleSize;
        });
    }

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Hypothesis Testing Demo
// ============================================

function initHypothesisDemo() {
    const runBtn = document.getElementById('run-hypothesis');
    if (!runBtn) return;

    runBtn.addEventListener('click', () => {
        const output = document.getElementById('hypothesis-output');
        output.innerHTML = '';

        // Simulate a t-test
        const sampleMean = 5.2;
        const nullMean = 5.0;
        const sampleStd = 0.8;
        const n = 30;
        const se = sampleStd / Math.sqrt(n);
        const tStat = (sampleMean - nullMean) / se;
        const pValue = 2 * (1 - normalCDF(Math.abs(tStat)));
        const alpha = 0.05;

        const steps = [
            { text: 'H₀: μ = 5.0 (Null Hypothesis)', color: '#b0b0d0' },
            { text: 'H₁: μ ≠ 5.0 (Alternative Hypothesis)', color: '#b0b0d0' },
            { text: `Sample Mean (x̄) = ${sampleMean}`, color: '#22d3ee' },
            { text: `Sample Size (n) = ${n}`, color: '#22d3ee' },
            { text: `Sample Std Dev (s) = ${sampleStd}`, color: '#22d3ee' },
            { text: `Standard Error = s/√n = ${se.toFixed(4)}`, color: '#a855f7' },
            { text: `t-statistic = (x̄ - μ₀)/SE = ${tStat.toFixed(4)}`, color: '#a855f7' },
            { text: `p-value ≈ ${pValue.toFixed(4)}`, color: '#f472b6' },
            { text: `α = ${alpha}`, color: '#facc15' },
            {
                text: pValue < alpha
                    ? '✅ Reject H₀: Evidence suggests μ ≠ 5.0'
                    : '❌ Fail to reject H₀: Insufficient evidence',
                color: pValue < alpha ? '#4ade80' : '#ef4444'
            }
        ];

        steps.forEach((step, i) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.style.color = step.color;
                div.style.padding = '0.3rem 0';
                div.style.fontFamily = "'Fira Code', monospace";
                div.style.fontSize = '0.9rem';
                div.style.opacity = '0';
                div.style.transform = 'translateX(-20px)';
                div.style.transition = 'all 0.3s ease';
                div.textContent = step.text;
                output.appendChild(div);

                setTimeout(() => {
                    div.style.opacity = '1';
                    div.style.transform = 'translateX(0)';
                }, 50);
            }, i * 400);
        });
    });
}

// Normal CDF approximation
function normalCDF(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
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

console.log('📊 Probability & Statistics Guide Loaded');
