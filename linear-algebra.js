/**
 * Linear Algebra Learning Guide - Interactive JavaScript
 * Visualizations for vectors, matrices, and transformations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initVectorCanvas();
    initMatrixCanvas();
    initTransformCanvas();
    initEigenCanvas();
    initScrollAnimations();
});

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(15, 15, 26, 0.98)';
        } else {
            header.style.background = 'rgba(15, 15, 26, 0.95)';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// Tab System
// ============================================

function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                panels.forEach(p => {
                    p.classList.remove('active');
                    if (p.id === target) {
                        p.classList.add('active');
                    }
                });
            });
        });
    });
}

// ============================================
// Vector Canvas Visualization
// ============================================

function initVectorCanvas() {
    const canvas = document.getElementById('vector-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    // Set canvas size
    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    // Vector state
    let vectorA = { x: 3, y: 2 };
    let vectorB = { x: 1, y: 3 };
    let showSum = true;

    // Sliders
    const sliderAx = document.getElementById('vec-a-x');
    const sliderAy = document.getElementById('vec-a-y');
    const sliderBx = document.getElementById('vec-b-x');
    const sliderBy = document.getElementById('vec-b-y');

    if (sliderAx) {
        sliderAx.addEventListener('input', (e) => {
            vectorA.x = parseFloat(e.target.value);
            document.getElementById('vec-a-x-val').textContent = vectorA.x.toFixed(1);
            draw();
        });
    }
    if (sliderAy) {
        sliderAy.addEventListener('input', (e) => {
            vectorA.y = parseFloat(e.target.value);
            document.getElementById('vec-a-y-val').textContent = vectorA.y.toFixed(1);
            draw();
        });
    }
    if (sliderBx) {
        sliderBx.addEventListener('input', (e) => {
            vectorB.x = parseFloat(e.target.value);
            document.getElementById('vec-b-x-val').textContent = vectorB.x.toFixed(1);
            draw();
        });
    }
    if (sliderBy) {
        sliderBy.addEventListener('input', (e) => {
            vectorB.y = parseFloat(e.target.value);
            document.getElementById('vec-b-y-val').textContent = vectorB.y.toFixed(1);
            draw();
        });
    }

    // Toggle sum button
    const toggleBtn = document.getElementById('toggle-sum');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            showSum = !showSum;
            toggleBtn.textContent = showSum ? 'Hide Sum' : 'Show Sum';
            draw();
        });
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const scale = 40;
        const originX = w / 2;
        const originY = h / 2;

        // Clear
        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(77, 159, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let x = originX % scale; x < w; x += scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = originY % scale; y < h; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(w, originY);
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, h);
        ctx.stroke();

        // Draw vector A (blue)
        drawVector(ctx, originX, originY, vectorA.x * scale, -vectorA.y * scale, '#4d9fff', 'a');

        // Draw vector B (purple)
        drawVector(ctx, originX, originY, vectorB.x * scale, -vectorB.y * scale, '#9d6eff', 'b');

        // Draw sum vector
        if (showSum) {
            const sumX = vectorA.x + vectorB.x;
            const sumY = vectorA.y + vectorB.y;
            drawVector(ctx, originX, originY, sumX * scale, -sumY * scale, '#00d4aa', 'a+b');

            // Parallelogram
            ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(originX + vectorA.x * scale, originY - vectorA.y * scale);
            ctx.lineTo(originX + sumX * scale, originY - sumY * scale);
            ctx.moveTo(originX + vectorB.x * scale, originY - vectorB.y * scale);
            ctx.lineTo(originX + sumX * scale, originY - sumY * scale);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '14px Inter';
        ctx.fillText('x', w - 20, originY - 10);
        ctx.fillText('y', originX + 10, 20);
    }

    function drawVector(ctx, x0, y0, dx, dy, color, label) {
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);
        const headSize = 12;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;

        // Line
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + dx, y0 + dy);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x0 + dx, y0 + dy);
        ctx.lineTo(
            x0 + dx - headSize * Math.cos(angle - Math.PI / 6),
            y0 + dy - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x0 + dx - headSize * Math.cos(angle + Math.PI / 6),
            y0 + dy - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.font = 'bold 14px Inter';
        ctx.fillText(label, x0 + dx / 2 + 10, y0 + dy / 2 - 10);
    }

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Matrix Multiplication Canvas
// ============================================

function initMatrixCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let matrixA = [[1, 2], [3, 4]];
    let matrixB = [[5, 6], [7, 8]];
    let step = 0;
    let animating = false;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 350;
        draw();
    }

    function multiply(A, B) {
        return [
            [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
            [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
        ];
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, w, h);

        const cellSize = 50;
        const gap = 30;

        // Matrix A
        drawMatrix(ctx, 50, h / 2 - cellSize, matrixA, 'A', '#4d9fff');

        // Multiplication symbol
        ctx.fillStyle = '#fff';
        ctx.font = '24px Inter';
        ctx.fillText('×', 50 + cellSize * 2 + gap, h / 2 + 10);

        // Matrix B
        drawMatrix(ctx, 50 + cellSize * 2 + gap * 2, h / 2 - cellSize, matrixB, 'B', '#9d6eff');

        // Equals symbol
        ctx.fillStyle = '#fff';
        ctx.font = '24px Inter';
        ctx.fillText('=', 50 + cellSize * 4 + gap * 3, h / 2 + 10);

        // Result matrix
        const result = multiply(matrixA, matrixB);
        drawMatrix(ctx, 50 + cellSize * 4 + gap * 4, h / 2 - cellSize, result, 'C', '#00d4aa');

        // Step-by-step explanation
        if (step >= 0 && step < 4) {
            const explanations = [
                `C[0,0] = ${matrixA[0][0]}×${matrixB[0][0]} + ${matrixA[0][1]}×${matrixB[1][0]} = ${result[0][0]}`,
                `C[0,1] = ${matrixA[0][0]}×${matrixB[0][1]} + ${matrixA[0][1]}×${matrixB[1][1]} = ${result[0][1]}`,
                `C[1,0] = ${matrixA[1][0]}×${matrixB[0][0]} + ${matrixA[1][1]}×${matrixB[1][0]} = ${result[1][0]}`,
                `C[1,1] = ${matrixA[1][0]}×${matrixB[0][1]} + ${matrixA[1][1]}×${matrixB[1][1]} = ${result[1][1]}`
            ];

            ctx.fillStyle = '#ff6eb4';
            ctx.font = '16px Fira Code';
            ctx.fillText(explanations[step], 50, h - 30);
        }
    }

    function drawMatrix(ctx, x, y, matrix, label, color) {
        const cellSize = 50;

        // Brackets
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x - 10, y - 10);
        ctx.lineTo(x - 10, y + cellSize * 2 + 10);
        ctx.lineTo(x, y + cellSize * 2 + 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + cellSize * 2, y - 10);
        ctx.lineTo(x + cellSize * 2 + 10, y - 10);
        ctx.lineTo(x + cellSize * 2 + 10, y + cellSize * 2 + 10);
        ctx.lineTo(x + cellSize * 2, y + cellSize * 2 + 10);
        ctx.stroke();

        // Cells
        ctx.fillStyle = '#fff';
        ctx.font = '18px Fira Code';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                ctx.fillText(
                    matrix[i][j].toString(),
                    x + j * cellSize + cellSize / 2,
                    y + i * cellSize + cellSize / 2
                );
            }
        }

        // Label
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Inter';
        ctx.fillText(label, x + cellSize, y - 25);
        ctx.textAlign = 'left';
    }

    // Step button
    const stepBtn = document.getElementById('matrix-step');
    if (stepBtn) {
        stepBtn.addEventListener('click', () => {
            step = (step + 1) % 5;
            draw();
        });
    }

    // Randomize button
    const randomBtn = document.getElementById('matrix-random');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            matrixA = [
                [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1],
                [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1]
            ];
            matrixB = [
                [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1],
                [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1]
            ];
            step = 0;
            draw();
        });
    }

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Linear Transformation Canvas
// ============================================

function initTransformCanvas() {
    const canvas = document.getElementById('transform-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    // Transformation matrix
    let transform = { a: 1, b: 0, c: 0, d: 1 };
    let animationFrame = null;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    // Sliders
    const sliders = {
        a: document.getElementById('transform-a'),
        b: document.getElementById('transform-b'),
        c: document.getElementById('transform-c'),
        d: document.getElementById('transform-d')
    };

    Object.keys(sliders).forEach(key => {
        if (sliders[key]) {
            sliders[key].addEventListener('input', (e) => {
                transform[key] = parseFloat(e.target.value);
                document.getElementById(`transform-${key}-val`).textContent = transform[key].toFixed(2);
                draw();
            });
        }
    });

    // Preset buttons
    const presets = {
        'preset-identity': { a: 1, b: 0, c: 0, d: 1 },
        'preset-scale': { a: 2, b: 0, c: 0, d: 2 },
        'preset-rotate': { a: 0.707, b: -0.707, c: 0.707, d: 0.707 },
        'preset-shear': { a: 1, b: 0.5, c: 0, d: 1 },
        'preset-reflect': { a: -1, b: 0, c: 0, d: 1 }
    };

    Object.keys(presets).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const preset = presets[id];
                transform = { ...preset };
                Object.keys(sliders).forEach(key => {
                    if (sliders[key]) {
                        sliders[key].value = preset[key];
                        document.getElementById(`transform-${key}-val`).textContent = preset[key].toFixed(2);
                    }
                });
                draw();
            });
        }
    });

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const scale = 30;
        const originX = w / 2;
        const originY = h / 2;

        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, w, h);

        // Draw transformed grid
        ctx.strokeStyle = 'rgba(77, 159, 255, 0.15)';
        ctx.lineWidth = 1;

        for (let i = -10; i <= 10; i++) {
            // Vertical lines
            const x1 = transform.a * i + transform.b * (-10);
            const y1 = transform.c * i + transform.d * (-10);
            const x2 = transform.a * i + transform.b * 10;
            const y2 = transform.c * i + transform.d * 10;

            ctx.beginPath();
            ctx.moveTo(originX + x1 * scale, originY - y1 * scale);
            ctx.lineTo(originX + x2 * scale, originY - y2 * scale);
            ctx.stroke();

            // Horizontal lines
            const x3 = transform.a * (-10) + transform.b * i;
            const y3 = transform.c * (-10) + transform.d * i;
            const x4 = transform.a * 10 + transform.b * i;
            const y4 = transform.c * 10 + transform.d * i;

            ctx.beginPath();
            ctx.moveTo(originX + x3 * scale, originY - y3 * scale);
            ctx.lineTo(originX + x4 * scale, originY - y4 * scale);
            ctx.stroke();
        }

        // Transformed basis vectors
        const i_hat = { x: transform.a, y: transform.c };
        const j_hat = { x: transform.b, y: transform.d };

        // i-hat (red)
        drawArrow(ctx, originX, originY, i_hat.x * scale * 3, -i_hat.y * scale * 3, '#ff6b6b', 'î');

        // j-hat (green)
        drawArrow(ctx, originX, originY, j_hat.x * scale * 3, -j_hat.y * scale * 3, '#51cf66', 'ĵ');

        // Draw unit square transformation
        ctx.strokeStyle = 'rgba(255, 159, 67, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + i_hat.x * scale * 3, originY - i_hat.y * scale * 3);
        ctx.lineTo(originX + (i_hat.x + j_hat.x) * scale * 3, originY - (i_hat.y + j_hat.y) * scale * 3);
        ctx.lineTo(originX + j_hat.x * scale * 3, originY - j_hat.y * scale * 3);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 159, 67, 0.1)';
        ctx.fill();

        // Determinant
        const det = transform.a * transform.d - transform.b * transform.c;
        ctx.fillStyle = '#fff';
        ctx.font = '14px Fira Code';
        ctx.fillText(`det(T) = ${det.toFixed(3)}`, 20, 30);
        ctx.fillText(`Area scale: ${Math.abs(det).toFixed(3)}×`, 20, 50);
        if (det < 0) {
            ctx.fillStyle = '#ff6b6b';
            ctx.fillText('(Orientation flipped)', 20, 70);
        }
    }

    function drawArrow(ctx, x0, y0, dx, dy, color, label) {
        const angle = Math.atan2(dy, dx);
        const headSize = 12;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + dx, y0 + dy);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x0 + dx, y0 + dy);
        ctx.lineTo(
            x0 + dx - headSize * Math.cos(angle - Math.PI / 6),
            y0 + dy - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x0 + dx - headSize * Math.cos(angle + Math.PI / 6),
            y0 + dy - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 16px Inter';
        ctx.fillText(label, x0 + dx + 15, y0 + dy);
    }

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Eigenvalue/Eigenvector Visualization
// ============================================

function initEigenCanvas() {
    const canvas = document.getElementById('eigen-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let matrix = { a: 2, b: 1, c: 1, d: 2 };
    let time = 0;
    let animating = false;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    function computeEigen(m) {
        // For 2x2 matrix, eigenvalues are roots of: λ² - (a+d)λ + (ad-bc) = 0
        const trace = m.a + m.d;
        const det = m.a * m.d - m.b * m.c;
        const discriminant = trace * trace - 4 * det;

        if (discriminant < 0) {
            return { complex: true, lambda1: null, lambda2: null };
        }

        const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
        const lambda2 = (trace - Math.sqrt(discriminant)) / 2;

        // Compute eigenvectors
        const v1 = normalizeVector(lambda1 - m.d, m.b);
        const v2 = normalizeVector(lambda2 - m.d, m.b);

        return {
            complex: false,
            lambda1, lambda2,
            v1, v2
        };
    }

    function normalizeVector(x, y) {
        const len = Math.sqrt(x * x + y * y);
        if (len === 0) return { x: 1, y: 0 };
        return { x: x / len, y: y / len };
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const scale = 60;
        const originX = w / 2;
        const originY = h / 2;

        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(77, 159, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = -10; i <= 10; i++) {
            ctx.beginPath();
            ctx.moveTo(originX + i * scale, 0);
            ctx.lineTo(originX + i * scale, h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, originY + i * scale);
            ctx.lineTo(w, originY + i * scale);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(w, originY);
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, h);
        ctx.stroke();

        const eigen = computeEigen(matrix);

        if (!eigen.complex) {
            // Draw eigenvectors (extended as lines)
            ctx.strokeStyle = 'rgba(255, 110, 180, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);

            // Eigenvector 1 line
            ctx.beginPath();
            ctx.moveTo(originX - eigen.v1.x * 300, originY + eigen.v1.y * 300);
            ctx.lineTo(originX + eigen.v1.x * 300, originY - eigen.v1.y * 300);
            ctx.stroke();

            // Eigenvector 2 line
            ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
            ctx.beginPath();
            ctx.moveTo(originX - eigen.v2.x * 300, originY + eigen.v2.y * 300);
            ctx.lineTo(originX + eigen.v2.x * 300, originY - eigen.v2.y * 300);
            ctx.stroke();

            ctx.setLineDash([]);

            // Draw eigenvectors
            drawEigenVector(ctx, originX, originY, eigen.v1.x * scale * 2, -eigen.v1.y * scale * 2, '#ff6eb4', `λ₁=${eigen.lambda1.toFixed(2)}`);
            drawEigenVector(ctx, originX, originY, eigen.v2.x * scale * 2, -eigen.v2.y * scale * 2, '#00d4aa', `λ₂=${eigen.lambda2.toFixed(2)}`);

            // Show transformed eigenvectors
            if (animating) {
                const t = (Math.sin(time) + 1) / 2;
                const scaled1 = {
                    x: eigen.v1.x * (1 + t * (eigen.lambda1 - 1)),
                    y: eigen.v1.y * (1 + t * (eigen.lambda1 - 1))
                };
                const scaled2 = {
                    x: eigen.v2.x * (1 + t * (eigen.lambda2 - 1)),
                    y: eigen.v2.y * (1 + t * (eigen.lambda2 - 1))
                };

                ctx.globalAlpha = 0.5;
                drawEigenVector(ctx, originX, originY, scaled1.x * scale * 2, -scaled1.y * scale * 2, '#ff6eb4', '');
                drawEigenVector(ctx, originX, originY, scaled2.x * scale * 2, -scaled2.y * scale * 2, '#00d4aa', '');
                ctx.globalAlpha = 1;
            }
        } else {
            ctx.fillStyle = '#ff6b6b';
            ctx.font = '16px Inter';
            ctx.fillText('Complex eigenvalues (rotation)', 20, 30);
        }

        // Matrix display
        ctx.fillStyle = '#fff';
        ctx.font = '14px Fira Code';
        ctx.fillText('Matrix:', 20, h - 60);
        ctx.fillText(`[${matrix.a}, ${matrix.b}]`, 20, h - 40);
        ctx.fillText(`[${matrix.c}, ${matrix.d}]`, 20, h - 20);
    }

    function drawEigenVector(ctx, x0, y0, dx, dy, color, label) {
        const angle = Math.atan2(dy, dx);
        const headSize = 10;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + dx, y0 + dy);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x0 + dx, y0 + dy);
        ctx.lineTo(
            x0 + dx - headSize * Math.cos(angle - Math.PI / 6),
            y0 + dy - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x0 + dx - headSize * Math.cos(angle + Math.PI / 6),
            y0 + dy - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        if (label) {
            ctx.font = '12px Fira Code';
            ctx.fillText(label, x0 + dx + 10, y0 + dy - 10);
        }
    }

    // Matrix input
    const inputs = ['eigen-a', 'eigen-b', 'eigen-c', 'eigen-d'];
    inputs.forEach((id, idx) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => {
                const key = ['a', 'b', 'c', 'd'][idx];
                matrix[key] = parseFloat(e.target.value) || 0;
                draw();
            });
        }
    });

    // Animate button
    const animBtn = document.getElementById('eigen-animate');
    if (animBtn) {
        animBtn.addEventListener('click', () => {
            animating = !animating;
            animBtn.textContent = animating ? 'Stop' : 'Animate';
            if (animating) animate();
        });
    }

    function animate() {
        if (!animating) return;
        time += 0.05;
        draw();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
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

    document.querySelectorAll('.card, .concept-card, .path-item, .math-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Utility: Dot Product Calculator
// ============================================

window.calculateDotProduct = function () {
    const a1 = parseFloat(document.getElementById('dot-a1')?.value) || 0;
    const a2 = parseFloat(document.getElementById('dot-a2')?.value) || 0;
    const b1 = parseFloat(document.getElementById('dot-b1')?.value) || 0;
    const b2 = parseFloat(document.getElementById('dot-b2')?.value) || 0;

    const dot = a1 * b1 + a2 * b2;
    const magA = Math.sqrt(a1 * a1 + a2 * a2);
    const magB = Math.sqrt(b1 * b1 + b2 * b2);
    const angle = Math.acos(dot / (magA * magB)) * 180 / Math.PI;

    const result = document.getElementById('dot-result');
    if (result) {
        result.innerHTML = `
      <strong>Dot Product:</strong> ${dot.toFixed(2)}<br>
      <strong>|a|:</strong> ${magA.toFixed(2)}, <strong>|b|:</strong> ${magB.toFixed(2)}<br>
      <strong>Angle:</strong> ${isNaN(angle) ? 'N/A' : angle.toFixed(2) + '°'}
    `;
    }
};

console.log('📐 Linear Algebra Guide Loaded');
