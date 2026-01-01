/**
 * Data Engineering Learning Guide - Interactive JavaScript
 * Data extraction, cleaning, transformation, and pipeline visualizations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initPipelineCanvas();
    initDataCleaningDemo();
    initExtractionDemo();
    initQualityChecker();
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
            ? 'rgba(12, 14, 20, 0.98)'
            : 'rgba(12, 14, 20, 0.95)';
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
// Pipeline Visualization
// ============================================

function initPipelineCanvas() {
    const canvas = document.getElementById('pipeline-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    let animationStep = 0;
    let isAnimating = false;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = 350;
        draw();
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#080a10';
        ctx.fillRect(0, 0, w, h);

        const stages = [
            { name: 'Extract', icon: '📥', color: '#f97316' },
            { name: 'Validate', icon: '✅', color: '#22c55e' },
            { name: 'Clean', icon: '🧹', color: '#3b82f6' },
            { name: 'Transform', icon: '🔄', color: '#8b5cf6' },
            { name: 'Load', icon: '📤', color: '#14b8a6' }
        ];

        const stageW = 120;
        const stageH = 80;
        const gap = (w - stages.length * stageW) / (stages.length + 1);
        const y = h / 2 - stageH / 2;

        // Draw connection lines
        ctx.strokeStyle = '#2a3040';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 4]);

        for (let i = 0; i < stages.length - 1; i++) {
            const x1 = gap + i * (stageW + gap) + stageW;
            const x2 = gap + (i + 1) * (stageW + gap);

            ctx.beginPath();
            ctx.moveTo(x1, y + stageH / 2);
            ctx.lineTo(x2, y + stageH / 2);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw animated data flow
        if (isAnimating && animationStep < stages.length) {
            for (let i = 0; i < animationStep; i++) {
                const x1 = gap + i * (stageW + gap) + stageW;
                const x2 = gap + (i + 1) * (stageW + gap);

                ctx.strokeStyle = stages[i].color;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(x1, y + stageH / 2);
                ctx.lineTo(x2, y + stageH / 2);
                ctx.stroke();

                // Arrow
                ctx.fillStyle = stages[i].color;
                ctx.beginPath();
                ctx.moveTo(x2 - 10, y + stageH / 2 - 8);
                ctx.lineTo(x2, y + stageH / 2);
                ctx.lineTo(x2 - 10, y + stageH / 2 + 8);
                ctx.fill();
            }
        }

        // Draw stages
        stages.forEach((stage, i) => {
            const x = gap + i * (stageW + gap);
            const isActive = isAnimating && i <= animationStep;

            // Stage box
            ctx.fillStyle = isActive ? stage.color : '#1c212c';
            ctx.strokeStyle = stage.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, y, stageW, stageH, 10);
            ctx.fill();
            ctx.stroke();

            // Icon
            ctx.font = '24px Arial';
            ctx.fillStyle = isActive ? '#fff' : stage.color;
            ctx.fillText(stage.icon, x + stageW / 2 - 12, y + 35);

            // Label
            ctx.font = 'bold 12px Inter';
            ctx.fillStyle = isActive ? '#fff' : '#a0a8c0';
            ctx.textAlign = 'center';
            ctx.fillText(stage.name, x + stageW / 2, y + 60);
            ctx.textAlign = 'left';
        });

        // Legend
        ctx.fillStyle = '#5c6580';
        ctx.font = '11px Inter';
        ctx.fillText('Click "Run Pipeline" to see data flow through stages', 20, h - 20);
    }

    // Run pipeline button
    const runBtn = document.getElementById('run-pipeline');
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            if (isAnimating) return;

            isAnimating = true;
            animationStep = 0;

            const interval = setInterval(() => {
                animationStep++;
                draw();

                if (animationStep >= 5) {
                    clearInterval(interval);
                    setTimeout(() => {
                        isAnimating = false;
                        animationStep = 0;
                    }, 2000);
                }
            }, 600);
        });
    }

    window.addEventListener('resize', resize);
    resize();
}

// ============================================
// Data Cleaning Demonstration
// ============================================

function initDataCleaningDemo() {
    const cleanBtn = document.getElementById('run-cleaning');
    const dirtyTable = document.getElementById('dirty-data');
    const cleanTable = document.getElementById('clean-data');

    if (!cleanBtn) return;

    cleanBtn.addEventListener('click', () => {
        const output = document.getElementById('cleaning-output');
        output.innerHTML = '';

        const steps = [
            { text: '1. Removing duplicate rows...', action: 'dedupe' },
            { text: '2. Handling missing values (imputation)...', action: 'missing' },
            { text: '3. Standardizing date formats (ISO 8601)...', action: 'dates' },
            { text: '4. Normalizing text (lowercase, trim)...', action: 'normalize' },
            { text: '5. Validating data types...', action: 'validate' },
            { text: '✅ Cleaning complete! 23 issues fixed.', action: 'done' }
        ];

        steps.forEach((step, i) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.style.color = step.action === 'done' ? '#22c55e' : '#a0a8c0';
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
            }, i * 500);
        });
    });
}

// ============================================
// Data Extraction Demo
// ============================================

function initExtractionDemo() {
    const extractBtns = document.querySelectorAll('.extract-btn');
    const output = document.getElementById('extraction-output');

    if (!output) return;

    const sources = {
        api: {
            name: 'REST API',
            code: `fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(data => {
    console.log('Extracted:', data.length, 'records');
    return data;
  });`,
            result: '{"status": "success", "records": 1523, "time": "0.45s"}'
        },
        database: {
            name: 'SQL Database',
            code: `SELECT 
    user_id,
    email,
    created_at,
    last_login
FROM users
WHERE created_at >= '2024-01-01'
LIMIT 1000;`,
            result: '{"status": "success", "records": 1000, "time": "0.12s"}'
        },
        scraping: {
            name: 'Web Scraping',
            code: `from bs4 import BeautifulSoup
import requests

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
data = soup.find_all('div', class_='product')

print(f"Extracted {len(data)} products")`,
            result: '{"status": "success", "records": 847, "time": "2.3s"}'
        },
        file: {
            name: 'File Upload',
            code: `import pandas as pd

# Support multiple formats
df = pd.read_csv('data.csv')  # CSV
df = pd.read_json('data.json')  # JSON
df = pd.read_parquet('data.parquet')  # Parquet

print(df.info())`,
            result: '{"status": "success", "records": 50000, "time": "0.8s"}'
        }
    };

    extractBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            extractBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const source = btn.dataset.source;
            const data = sources[source];

            if (data) {
                output.innerHTML = `
          <h4 style="color: #f97316; margin-bottom: 1rem;">${data.name} Extraction</h4>
          <div class="code-block" style="margin: 0;">
            <div class="code-body">
              <pre>${escapeHtml(data.code)}</pre>
            </div>
          </div>
          <div style="margin-top: 1rem; padding: 1rem; background: #0c0e14; border-radius: 8px; font-family: 'Fira Code';">
            <div style="color: #22c55e; margin-bottom: 0.5rem;">→ Result:</div>
            <code style="color: #a0a8c0; font-size: 0.85rem;">${data.result}</code>
          </div>
        `;
            }
        });
    });

    // Initialize with first source
    if (extractBtns.length > 0) {
        extractBtns[0].click();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Data Quality Checker
// ============================================

function initQualityChecker() {
    const checkBtn = document.getElementById('check-quality');
    if (!checkBtn) return;

    checkBtn.addEventListener('click', () => {
        const result = document.getElementById('quality-result');

        // Simulate quality check
        const metrics = {
            completeness: (85 + Math.random() * 10).toFixed(1),
            accuracy: (92 + Math.random() * 6).toFixed(1),
            consistency: (88 + Math.random() * 8).toFixed(1),
            freshness: (95 + Math.random() * 4).toFixed(1)
        };

        const getClass = (val) => {
            if (val >= 90) return 'good';
            if (val >= 75) return 'warn';
            return 'bad';
        };

        result.innerHTML = `
      <div class="quality-metrics">
        <div class="quality-card">
          <div class="quality-value ${getClass(metrics.completeness)}">${metrics.completeness}%</div>
          <div class="quality-label">Completeness</div>
        </div>
        <div class="quality-card">
          <div class="quality-value ${getClass(metrics.accuracy)}">${metrics.accuracy}%</div>
          <div class="quality-label">Accuracy</div>
        </div>
        <div class="quality-card">
          <div class="quality-value ${getClass(metrics.consistency)}">${metrics.consistency}%</div>
          <div class="quality-label">Consistency</div>
        </div>
        <div class="quality-card">
          <div class="quality-value ${getClass(metrics.freshness)}">${metrics.freshness}%</div>
          <div class="quality-label">Freshness</div>
        </div>
      </div>
      <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-primary); border-radius: 8px;">
        <h4 style="color: #f97316; margin-bottom: 0.5rem;">📋 Issues Found:</h4>
        <ul style="color: var(--text-secondary); font-size: 0.9rem; padding-left: 1.5rem;">
          <li>15 rows with missing email addresses</li>
          <li>3 duplicate customer IDs detected</li>
          <li>Date format inconsistency in 'created_at' column</li>
          <li>2 records older than 30 days (stale data)</li>
        </ul>
      </div>
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

    document.querySelectorAll('.card, .pipeline-diagram, .path-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

console.log('📊 Data Engineering Guide Loaded');
