/**
 * App Development Learning Guide - Interactive JavaScript
 * Web, Android, iOS Development demos and visualizations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initFrameworkComparison();
    initComponentBuilder();
    initAppPreview();
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
            ? 'rgba(10, 13, 18, 0.98)'
            : 'rgba(10, 13, 18, 0.95)';
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
// Framework Comparison
// ============================================

function initFrameworkComparison() {
    const frameworkBtns = document.querySelectorAll('.framework-btn');
    const output = document.getElementById('framework-output');

    if (!output) return;

    const frameworks = {
        react: {
            name: 'React',
            type: 'Web Library',
            language: 'JavaScript/TypeScript',
            company: 'Meta',
            pros: ['Large ecosystem', 'Virtual DOM', 'Flexible architecture', 'Great devtools'],
            cons: ['Just a library (needs routing, state)', 'JSX learning curve'],
            code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`
        },
        flutter: {
            name: 'Flutter',
            type: 'Cross-Platform',
            language: 'Dart',
            company: 'Google',
            pros: ['Single codebase', 'Great performance', 'Beautiful UI', 'Hot reload'],
            cons: ['Dart learning curve', 'Larger app size', 'Platform limitations'],
            code: `import 'package:flutter/material.dart';

class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: \$count'),
        ElevatedButton(
          onPressed: () => setState(() => count++),
          child: Text('Increment'),
        ),
      ],
    );
  }
}`
        },
        kotlin: {
            name: 'Kotlin (Android)',
            type: 'Native Android',
            language: 'Kotlin',
            company: 'JetBrains/Google',
            pros: ['First-class Android support', 'Jetpack Compose', 'Null safety', 'Coroutines'],
            cons: ['Android only', 'Steeper learning curve'],
            code: `@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    
    Column {
        Text("Count: \$count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}`
        },
        swift: {
            name: 'SwiftUI (iOS)',
            type: 'Native iOS',
            language: 'Swift',
            company: 'Apple',
            pros: ['First-class Apple support', 'Declarative syntax', 'Live previews', 'Swift Concurrency'],
            cons: ['Apple ecosystem only', 'iOS 13+ only'],
            code: `import SwiftUI

struct Counter: View {
    @State private var count = 0
    
    var body: some View {
        VStack {
            Text("Count: \\(count)")
            Button("Increment") {
                count += 1
            }
        }
    }
}`
        }
    };

    frameworkBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            frameworkBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const fw = btn.dataset.framework;
            const data = frameworks[fw];

            if (data) {
                output.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
              <h3 style="color: #ec4899; margin-bottom: 1rem;">${data.name}</h3>
              <div style="margin-bottom: 1rem;">
                <span style="color: #a0aec0;">Type:</span> <span>${data.type}</span><br>
                <span style="color: #a0aec0;">Language:</span> <span>${data.language}</span><br>
                <span style="color: #a0aec0;">By:</span> <span>${data.company}</span>
              </div>
              <div style="margin-bottom: 1rem;">
                <h4 style="color: #22c55e; margin-bottom: 0.5rem;">✓ Pros</h4>
                <ul style="list-style: none; color: #a0aec0; font-size: 0.9rem;">
                  ${data.pros.map(p => `<li>• ${p}</li>`).join('')}
                </ul>
              </div>
              <div>
                <h4 style="color: #f97316; margin-bottom: 0.5rem;">✗ Cons</h4>
                <ul style="list-style: none; color: #a0aec0; font-size: 0.9rem;">
                  ${data.cons.map(c => `<li>• ${c}</li>`).join('')}
                </ul>
              </div>
            </div>
            <div class="code-block" style="margin: 0;">
              <div class="code-header">
                <span class="code-dot red"></span>
                <span class="code-dot yellow"></span>
                <span class="code-dot green"></span>
                <span class="code-title">${data.name.toLowerCase()}_counter.${fw === 'react' ? 'tsx' : fw === 'flutter' ? 'dart' : fw === 'kotlin' ? 'kt' : 'swift'}</span>
              </div>
              <div class="code-body">
                <pre>${escapeHtml(data.code)}</pre>
              </div>
            </div>
          </div>
        `;
            }
        });
    });

    // Initialize with first framework
    if (frameworkBtns.length > 0) {
        frameworkBtns[0].click();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Component Builder Demo
// ============================================

function initComponentBuilder() {
    const buildBtn = document.getElementById('build-component');
    if (!buildBtn) return;

    buildBtn.addEventListener('click', () => {
        const output = document.getElementById('component-output');
        const steps = [
            { text: '📦 Creating component scaffold...', delay: 0 },
            { text: '🎨 Applying styles...', delay: 400 },
            { text: '⚡ Adding state management...', delay: 800 },
            { text: '🔗 Connecting event handlers...', delay: 1200 },
            { text: '✅ Component ready!', delay: 1600 }
        ];

        output.innerHTML = '';

        steps.forEach(step => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.style.padding = '0.4rem 0';
                div.style.fontFamily = "'Fira Code', monospace";
                div.style.fontSize = '0.9rem';
                div.style.color = step.text.includes('✅') ? '#22c55e' : '#a0aec0';
                div.style.opacity = '0';
                div.style.transform = 'translateX(-10px)';
                div.style.transition = 'all 0.3s ease';
                div.textContent = step.text;
                output.appendChild(div);

                setTimeout(() => {
                    div.style.opacity = '1';
                    div.style.transform = 'translateX(0)';
                }, 50);
            }, step.delay);
        });

        // Show result after steps
        setTimeout(() => {
            const result = document.createElement('div');
            result.innerHTML = `
        <div style="margin-top: 1rem; padding: 1rem; background: #111620; border-radius: 8px; border: 1px solid rgba(236, 72, 153, 0.3);">
          <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #0a0d12; border-radius: 8px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">📱</div>
            <div>
              <div style="font-weight: 600;">MyComponent</div>
              <div style="color: #a0aec0; font-size: 0.85rem;">Ready for production</div>
            </div>
          </div>
        </div>
      `;
            output.appendChild(result);
        }, 2200);
    });
}

// ============================================
// App Preview
// ============================================

function initAppPreview() {
    const previewBtns = document.querySelectorAll('.preview-btn');
    const previewScreen = document.getElementById('app-preview-screen');

    if (!previewScreen) return;

    const screens = {
        home: `
      <div style="text-align: center; padding-top: 2rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏠</div>
        <h3 style="margin-bottom: 0.5rem;">Welcome</h3>
        <p style="color: #a0aec0; font-size: 0.85rem;">Your app home screen</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 2rem;">
        <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="font-size: 0.9rem;">Recent Activity</div>
          <div style="color: #a0aec0; font-size: 0.75rem;">3 new notifications</div>
        </div>
        <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="font-size: 0.9rem;">Quick Actions</div>
          <div style="color: #a0aec0; font-size: 0.75rem;">Create, Share, Settings</div>
        </div>
      </div>
    `,
        profile: `
      <div style="text-align: center; padding-top: 1rem;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">👤</div>
        <h3>John Doe</h3>
        <p style="color: #a0aec0; font-size: 0.85rem;">@johndoe</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; text-align: center;">
        <div><div style="font-weight: 600;">128</div><div style="color: #a0aec0; font-size: 0.7rem;">Posts</div></div>
        <div><div style="font-weight: 600;">1.2K</div><div style="color: #a0aec0; font-size: 0.7rem;">Followers</div></div>
        <div><div style="font-weight: 600;">348</div><div style="color: #a0aec0; font-size: 0.7rem;">Following</div></div>
      </div>
    `,
        settings: `
      <h3 style="margin-bottom: 1.5rem;">⚙️ Settings</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div style="padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span>🔔 Notifications</span>
          <span style="color: #22c55e;">ON</span>
        </div>
        <div style="padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span>🌙 Dark Mode</span>
          <span style="color: #22c55e;">ON</span>
        </div>
        <div style="padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span>🔒 Privacy</span>
          <span style="color: #a0aec0;">→</span>
        </div>
        <div style="padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span>ℹ️ About</span>
          <span style="color: #a0aec0;">→</span>
        </div>
      </div>
    `
    };

    previewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            previewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const screen = btn.dataset.screen;
            if (screens[screen]) {
                previewScreen.innerHTML = screens[screen];

                // Animate in
                previewScreen.style.opacity = '0';
                previewScreen.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    previewScreen.style.transition = 'all 0.3s ease';
                    previewScreen.style.opacity = '1';
                    previewScreen.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });

    // Initialize with home
    if (previewBtns.length > 0) {
        previewBtns[0].click();
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

    document.querySelectorAll('.card, .app-demo, .path-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

console.log('📱 App Development Guide Loaded');
