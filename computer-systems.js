/**
 * Computer Systems Learning Guide - Interactive JavaScript
 * GPU Architecture, Memory Hierarchy, and Distributed Training Visualizations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initMemoryHierarchy();
    initGPUArchitecture();
    initDistributedTraining();
    initBenchmarkCalculator();
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
            ? 'rgba(10, 12, 16, 0.98)'
            : 'rgba(10, 12, 16, 0.95)';
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
// Memory Hierarchy Visualization
// ============================================

function initMemoryHierarchy() {
    const levels = document.querySelectorAll('.memory-level');
    const infoPanel = document.getElementById('memory-info');

    if (!infoPanel) return;

    const memoryData = {
        registers: {
            name: 'CPU Registers',
            size: '~1 KB',
            latency: '~0.5 ns',
            bandwidth: '~1 TB/s',
            description: 'Fastest memory, directly in CPU. Holds active computation values.'
        },
        'l1-cache': {
            name: 'L1 Cache',
            size: '32-64 KB per core',
            latency: '~1 ns',
            bandwidth: '~500 GB/s',
            description: 'Per-core cache. Split into instruction and data caches.'
        },
        'l2-cache': {
            name: 'L2 Cache',
            size: '256 KB - 1 MB per core',
            latency: '~4 ns',
            bandwidth: '~200 GB/s',
            description: 'Larger per-core cache. Unified for instructions and data.'
        },
        'l3-cache': {
            name: 'L3 Cache',
            size: '8-64 MB shared',
            latency: '~12 ns',
            bandwidth: '~100 GB/s',
            description: 'Shared across all cores. Last level before main memory.'
        },
        ram: {
            name: 'System RAM (DDR5)',
            size: '16-512 GB',
            latency: '~80 ns',
            bandwidth: '~50 GB/s',
            description: 'Main system memory. Holds active programs and data.'
        },
        vram: {
            name: 'GPU VRAM (HBM3)',
            size: '24-80 GB',
            latency: '~100 ns',
            bandwidth: '~3 TB/s',
            description: 'High-bandwidth memory for GPU. Critical for LLM inference.'
        },
        storage: {
            name: 'NVMe SSD',
            size: '1-16 TB',
            latency: '~100 μs',
            bandwidth: '~7 GB/s',
            description: 'Persistent storage. Used for model checkpoints and datasets.'
        }
    };

    levels.forEach(level => {
        level.addEventListener('click', () => {
            const key = level.classList[1];
            const data = memoryData[key];

            if (data) {
                infoPanel.innerHTML = `
          <h4 style="color: #3b82f6; margin-bottom: 0.5rem;">${data.name}</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1rem 0;">
            <div>
              <div style="color: #9ca3b8; font-size: 0.8rem;">Size</div>
              <div style="font-family: 'Fira Code'; color: #22c55e;">${data.size}</div>
            </div>
            <div>
              <div style="color: #9ca3b8; font-size: 0.8rem;">Latency</div>
              <div style="font-family: 'Fira Code'; color: #f97316;">${data.latency}</div>
            </div>
            <div>
              <div style="color: #9ca3b8; font-size: 0.8rem;">Bandwidth</div>
              <div style="font-family: 'Fira Code'; color: #6366f1;">${data.bandwidth}</div>
            </div>
          </div>
          <p style="color: #9ca3b8; font-size: 0.9rem;">${data.description}</p>
        `;
            }
        });
    });

    // Initialize with registers
    if (levels.length > 0) levels[0].click();
}

// ============================================
// GPU Architecture Visualization
// ============================================

function initGPUArchitecture() {
    const canvas = document.getElementById('gpu-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        draw();
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#070810';
        ctx.fillRect(0, 0, w, h);

        // GPU Die Layout
        const dieX = 50;
        const dieY = 30;
        const dieW = w - 100;
        const dieH = h - 60;

        // Background
        ctx.fillStyle = '#1a1e28';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(dieX, dieY, dieW, dieH, 10);
        ctx.fill();
        ctx.stroke();

        // Title
        ctx.fillStyle = '#e8eaf0';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('NVIDIA GPU Architecture (Simplified)', dieX + 10, dieY + 25);

        // SM Grid (Streaming Multiprocessors)
        const smCols = 8;
        const smRows = 4;
        const smW = (dieW - 180) / smCols - 8;
        const smH = (dieH - 80) / smRows - 8;
        const smStartX = dieX + 20;
        const smStartY = dieY + 45;

        for (let row = 0; row < smRows; row++) {
            for (let col = 0; col < smCols; col++) {
                const x = smStartX + col * (smW + 8);
                const y = smStartY + row * (smH + 8);

                // SM Block
                ctx.fillStyle = `hsl(${220 + row * 10}, 70%, ${40 + col * 3}%)`;
                ctx.beginPath();
                ctx.roundRect(x, y, smW, smH, 4);
                ctx.fill();

                // SM Label
                ctx.fillStyle = '#fff';
                ctx.font = '10px Fira Code';
                ctx.fillText(`SM${row * smCols + col}`, x + 5, y + 15);

                // CUDA Cores indicator
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.font = '8px Fira Code';
                ctx.fillText('128 cores', x + 5, y + smH - 5);
            }
        }

        // Memory Controller (right side)
        const mcX = dieX + dieW - 140;
        const mcY = dieY + 45;
        const mcW = 120;
        const mcH = dieH - 60;

        ctx.fillStyle = '#14b8a6';
        ctx.beginPath();
        ctx.roundRect(mcX, mcY, mcW, mcH, 6);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.fillText('HBM3', mcX + 35, mcY + 25);
        ctx.fillText('Memory', mcX + 25, mcY + 42);
        ctx.fillText('Controller', mcX + 20, mcY + 59);

        ctx.font = '10px Fira Code';
        ctx.fillText('80 GB', mcX + 40, mcY + 90);
        ctx.fillText('3.35 TB/s', mcX + 25, mcY + 110);

        // L2 Cache bar
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(smStartX, dieY + dieH - 35, mcX - smStartX - 10, 20, 4);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '11px Inter';
        ctx.fillText('L2 Cache (50 MB)', smStartX + 10, dieY + dieH - 21);

        // Legend
        ctx.fillStyle = '#9ca3b8';
        ctx.font = '11px Inter';
        ctx.fillText('Click for details • H100 GPU: 132 SMs, 16,896 CUDA Cores, 80GB HBM3', dieX, h - 10);
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Show info based on click location
        const infoPanel = document.getElementById('gpu-info');
        if (infoPanel) {
            if (x > canvas.width - 160) {
                infoPanel.innerHTML = `
          <h4 style="color: #14b8a6;">HBM3 Memory</h4>
          <p>High Bandwidth Memory - stacked DRAM providing massive bandwidth (3.35 TB/s on H100). Critical for feeding data to GPU cores fast enough.</p>
        `;
            } else {
                infoPanel.innerHTML = `
          <h4 style="color: #6366f1;">Streaming Multiprocessor (SM)</h4>
          <p>Each SM contains 128 CUDA cores, 4 Tensor Cores, shared memory, and caches. SMs execute thread blocks (warps of 32 threads).</p>
        `;
            }
        }
    });

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Distributed Training Visualization
// ============================================

function initDistributedTraining() {
    const canvas = document.getElementById('distributed-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let mode = 'data-parallel';
    let animationId = null;
    let frame = 0;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 350;
        draw();
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#070810';
        ctx.fillRect(0, 0, w, h);

        if (mode === 'data-parallel') {
            drawDataParallel(w, h);
        } else if (mode === 'model-parallel') {
            drawModelParallel(w, h);
        } else {
            drawPipelineParallel(w, h);
        }
    }

    function drawDataParallel(w, h) {
        ctx.fillStyle = '#e8eaf0';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('Data Parallelism: Same model on each GPU, different data batches', 20, 25);

        const gpuW = 120;
        const gpuH = 180;
        const gpuY = 60;
        const gpuGap = 40;
        const numGPUs = 4;
        const totalW = numGPUs * gpuW + (numGPUs - 1) * gpuGap;
        const startX = (w - totalW) / 2;

        for (let i = 0; i < numGPUs; i++) {
            const x = startX + i * (gpuW + gpuGap);

            // GPU
            ctx.fillStyle = '#1a1e28';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, gpuY, gpuW, gpuH, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#e8eaf0';
            ctx.font = 'bold 12px Inter';
            ctx.fillText(`GPU ${i}`, x + 40, gpuY + 25);

            // Model (same on each)
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.roundRect(x + 10, gpuY + 40, gpuW - 20, 60, 4);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '11px Inter';
            ctx.fillText('Full Model', x + 25, gpuY + 75);

            // Data batch (different)
            const batchColor = `hsl(${120 + i * 40}, 60%, 50%)`;
            ctx.fillStyle = batchColor;
            ctx.beginPath();
            ctx.roundRect(x + 10, gpuY + 110, gpuW - 20, 40, 4);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '10px Inter';
            ctx.fillText(`Batch ${i}`, x + 35, gpuY + 135);
        }

        // AllReduce arrow
        const arrowY = gpuY + gpuH + 30;
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startX, arrowY);
        ctx.lineTo(startX + totalW, arrowY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#f97316';
        ctx.font = '12px Inter';
        ctx.fillText('← AllReduce: Sync gradients across GPUs →', w / 2 - 120, arrowY + 20);
    }

    function drawModelParallel(w, h) {
        ctx.fillStyle = '#e8eaf0';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('Tensor Parallelism: Model layers split across GPUs', 20, 25);

        const gpuW = 140;
        const gpuH = 200;
        const gpuY = 50;
        const gpuGap = 30;
        const numGPUs = 4;
        const totalW = numGPUs * gpuW + (numGPUs - 1) * gpuGap;
        const startX = (w - totalW) / 2;

        for (let i = 0; i < numGPUs; i++) {
            const x = startX + i * (gpuW + gpuGap);

            ctx.fillStyle = '#1a1e28';
            ctx.strokeStyle = '#14b8a6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, gpuY, gpuW, gpuH, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#e8eaf0';
            ctx.font = 'bold 12px Inter';
            ctx.fillText(`GPU ${i}`, x + 50, gpuY + 25);

            // Model shard
            ctx.fillStyle = `hsl(${180 + i * 30}, 60%, 45%)`;
            ctx.beginPath();
            ctx.roundRect(x + 10, gpuY + 40, gpuW - 20, 130, 4);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = '11px Inter';
            ctx.fillText(`Layers`, x + 45, gpuY + 80);
            ctx.fillText(`${i * 8}-${i * 8 + 7}`, x + 50, gpuY + 100);

            // Connect to next
            if (i < numGPUs - 1) {
                ctx.strokeStyle = '#f97316';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + gpuW, gpuY + gpuH / 2);
                ctx.lineTo(x + gpuW + gpuGap, gpuY + gpuH / 2);
                ctx.stroke();

                // Arrow
                ctx.beginPath();
                ctx.moveTo(x + gpuW + gpuGap - 8, gpuY + gpuH / 2 - 5);
                ctx.lineTo(x + gpuW + gpuGap, gpuY + gpuH / 2);
                ctx.lineTo(x + gpuW + gpuGap - 8, gpuY + gpuH / 2 + 5);
                ctx.stroke();
            }
        }

        ctx.fillStyle = '#9ca3b8';
        ctx.font = '12px Inter';
        ctx.fillText('Activations passed between GPUs at layer boundaries', w / 2 - 150, gpuY + gpuH + 30);
    }

    function drawPipelineParallel(w, h) {
        ctx.fillStyle = '#e8eaf0';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('Pipeline Parallelism: Micro-batches flow through GPU stages', 20, 25);

        const stageW = 100;
        const stageH = 60;
        const numStages = 4;
        const numBatches = 6;
        const startX = 80;
        const stageGap = (w - startX * 2 - numStages * stageW) / (numStages - 1);

        // Draw stages (GPUs)
        for (let i = 0; i < numStages; i++) {
            const x = startX + i * (stageW + stageGap);

            ctx.fillStyle = '#1a1e28';
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, 50, stageW, stageH, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#e8eaf0';
            ctx.font = 'bold 11px Inter';
            ctx.fillText(`Stage ${i}`, x + 25, 85);
        }

        // Draw pipeline timeline
        const timeY = 140;
        const batchH = 25;
        const batchW = stageW - 10;

        for (let batch = 0; batch < numBatches; batch++) {
            for (let stage = 0; stage < numStages; stage++) {
                const x = startX + stage * (stageW + stageGap) + 5;
                const y = timeY + batch * (batchH + 5);

                if (batch >= stage && batch < stage + numBatches - numStages + 1) {
                    const batchColor = `hsl(${batch * 40}, 65%, 50%)`;
                    ctx.fillStyle = batchColor;
                    ctx.beginPath();
                    ctx.roundRect(x, y, batchW, batchH, 4);
                    ctx.fill();

                    ctx.fillStyle = '#fff';
                    ctx.font = '10px Fira Code';
                    ctx.fillText(`μB${batch}`, x + batchW / 2 - 12, y + 17);
                }
            }
        }

        ctx.fillStyle = '#9ca3b8';
        ctx.font = '11px Inter';
        ctx.fillText('Time →', w - 70, timeY + 10);
        ctx.fillText('μB = micro-batch', 20, h - 15);
    }

    // Mode buttons
    document.querySelectorAll('.parallel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.parallel-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mode = btn.dataset.mode;
            draw();
        });
    });

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Benchmark Calculator
// ============================================

function initBenchmarkCalculator() {
    const calcBtn = document.getElementById('calc-benchmark');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', () => {
        const params = parseFloat(document.getElementById('model-params').value) || 7;
        const precision = document.getElementById('precision-select').value;
        const gpuVram = parseFloat(document.getElementById('gpu-vram').value) || 24;
        const gpuBw = parseFloat(document.getElementById('gpu-bandwidth').value) || 900;

        // Calculate memory requirements
        let bytesPerParam = precision === 'fp32' ? 4 : precision === 'fp16' ? 2 : 1;
        const modelMemGB = (params * 1e9 * bytesPerParam) / (1024 ** 3);

        // KV cache estimate (rough)
        const kvCacheGB = modelMemGB * 0.1; // ~10% for typical inference
        const totalMemGB = modelMemGB + kvCacheGB;

        // GPUs needed
        const gpusNeeded = Math.ceil(totalMemGB / (gpuVram * 0.9)); // 90% usable

        // Theoretical throughput (tokens/sec) - simplified
        const tokensPerSec = (gpuBw * 1e9) / (params * 1e9 * bytesPerParam) * 1000;

        const result = document.getElementById('benchmark-result');
        result.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
        <div class="metric-card">
          <div class="metric-value">${modelMemGB.toFixed(1)}</div>
          <div class="metric-label">Model Size (GB)</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${totalMemGB.toFixed(1)}</div>
          <div class="metric-label">Total Memory (GB)</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${gpusNeeded}</div>
          <div class="metric-label">GPUs Needed</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">~${Math.round(tokensPerSec)}</div>
          <div class="metric-label">Tokens/sec (est.)</div>
        </div>
      </div>
      <p style="color: #9ca3b8; margin-top: 1rem; font-size: 0.85rem;">
        * Estimates based on ${precision.toUpperCase()} precision. Actual performance varies based on model architecture, batch size, and optimization.
      </p>
    `;
    });
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

    document.querySelectorAll('.card, .arch-diagram, .path-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

console.log('🖥️ Computer Systems Guide Loaded');
