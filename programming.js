/**
 * Programming Languages Learning Guide - Interactive JavaScript
 * Language comparisons, code playgrounds, and paradigm demos
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initCodePlayground();
    initParadigmDemo();
    initLanguageComparison();
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
            ? 'rgba(13, 13, 18, 0.98)'
            : 'rgba(13, 13, 18, 0.95)';
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
// Interactive Code Playground
// ============================================

function initCodePlayground() {
    const runBtn = document.getElementById('run-code');
    const editor = document.getElementById('code-editor');
    const output = document.getElementById('code-output');

    if (!runBtn || !editor || !output) return;

    // Sample programs for different concepts
    const samples = {
        'hello': `// Hello World in JavaScript
console.log("Hello, World!");
console.log("Welcome to programming!");`,

        'variables': `// Variables and Data Types
let name = "Alice";
const age = 25;
let isStudent = true;
let scores = [95, 87, 92];

console.log("Name:", name);
console.log("Age:", age);
console.log("Is Student:", isStudent);
console.log("Scores:", scores);
console.log("Average:", scores.reduce((a,b) => a+b) / scores.length);`,

        'functions': `// Functions
function greet(name) {
  return "Hello, " + name + "!";
}

// Arrow function
const add = (a, b) => a + b;

// Higher-order function
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);

console.log(greet("World"));
console.log("2 + 3 =", add(2, 3));
console.log("Doubled:", doubled);`,

        'objects': `// Objects and Classes
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
}

const alice = new Person("Alice", 25);
console.log(alice.greet());
console.log("Age:", alice.age);

// Object literal
const config = {
  theme: "dark",
  language: "en",
  debug: true
};
console.log("Config:", JSON.stringify(config, null, 2));`,

        'async': `// Async Programming
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData() {
  console.log("Starting...");
  await delay(500);
  console.log("Data received after 500ms");
  return { status: "success", data: [1, 2, 3] };
}

fetchData().then(result => {
  console.log("Result:", result);
});
console.log("This runs first (async!)");`
    };

    // Run button
    runBtn.addEventListener('click', () => {
        output.innerHTML = '<div class="output-label">> Output:</div>';
        const code = editor.value;

        // Capture console.log
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
        };

        try {
            eval(code);
            // Delay to capture async logs
            setTimeout(() => {
                console.log = originalLog;
                logs.forEach(log => {
                    const line = document.createElement('div');
                    line.style.color = '#10b981';
                    line.textContent = log;
                    output.appendChild(line);
                });
            }, 600);
        } catch (error) {
            console.log = originalLog;
            const errorLine = document.createElement('div');
            errorLine.style.color = '#f43f5e';
            errorLine.textContent = 'Error: ' + error.message;
            output.appendChild(errorLine);
        }
    });

    // Sample buttons
    document.querySelectorAll('.sample-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sample-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sample = btn.dataset.sample;
            if (samples[sample]) {
                editor.value = samples[sample];
            }
        });
    });
}

// ============================================
// Paradigm Demonstration
// ============================================

function initParadigmDemo() {
    const demoBtn = document.getElementById('run-paradigm');
    const output = document.getElementById('paradigm-output');

    if (!demoBtn || !output) return;

    demoBtn.addEventListener('click', () => {
        output.innerHTML = '';

        const paradigms = [
            {
                name: 'Imperative',
                code: 'let sum = 0; for (let i = 1; i <= 5; i++) { sum += i; }',
                result: 'sum = 15',
                color: '#f43f5e'
            },
            {
                name: 'Functional',
                code: 'const sum = [1,2,3,4,5].reduce((a, b) => a + b, 0);',
                result: 'sum = 15',
                color: '#8b5cf6'
            },
            {
                name: 'Object-Oriented',
                code: 'class Adder { add(arr) { return arr.reduce((a,b) => a+b); } }',
                result: 'new Adder().add([1,2,3,4,5]) = 15',
                color: '#06b6d4'
            },
            {
                name: 'Declarative',
                code: 'SELECT SUM(value) FROM numbers WHERE value BETWEEN 1 AND 5;',
                result: 'Result: 15 (SQL example)',
                color: '#10b981'
            }
        ];

        paradigms.forEach((p, i) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.style.marginBottom = '1rem';
                div.style.padding = '1rem';
                div.style.background = 'rgba(0,0,0,0.3)';
                div.style.borderRadius = '8px';
                div.style.borderLeft = `4px solid ${p.color}`;
                div.style.opacity = '0';
                div.style.transform = 'translateX(-20px)';
                div.style.transition = 'all 0.3s ease';

                div.innerHTML = `
          <div style="color: ${p.color}; font-weight: 600; margin-bottom: 0.5rem;">${p.name}</div>
          <code style="color: #a8a8c8; font-size: 0.85rem;">${p.code}</code>
          <div style="color: #10b981; margin-top: 0.5rem; font-family: 'Fira Code';">→ ${p.result}</div>
        `;
                output.appendChild(div);

                setTimeout(() => {
                    div.style.opacity = '1';
                    div.style.transform = 'translateX(0)';
                }, 50);
            }, i * 400);
        });
    });
}

// ============================================
// Language Comparison
// ============================================

function initLanguageComparison() {
    const langBtns = document.querySelectorAll('.lang-compare-btn');
    const codeDisplay = document.getElementById('lang-code-display');

    if (!codeDisplay) return;

    const examples = {
        python: {
            name: 'Python',
            code: `# Python - Simple and readable
def fibonacci(n):
    """Generate Fibonacci sequence"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# List comprehension
squares = [x**2 for x in range(10)]

# Lambda functions
add = lambda a, b: a + b

print(f"Fib(10) = {fibonacci(10)}")
print(f"Squares: {squares}")`,
            features: ['Dynamic typing', 'Indentation syntax', 'List comprehensions', 'GIL']
        },
        javascript: {
            name: 'JavaScript',
            code: `// JavaScript - The language of the web
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Array methods
const squares = [...Array(10)].map((_, i) => i ** 2);

// Arrow functions
const add = (a, b) => a + b;

// Async/await
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

console.log(\`Fib(10) = \${fibonacci(10)}\`);`,
            features: ['Dynamic typing', 'Async/await', 'First-class functions', 'Event loop']
        },
        rust: {
            name: 'Rust',
            code: `// Rust - Safety and performance
fn fibonacci(n: u64) -> u64 {
    match n {
        0 | 1 => n,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    // Ownership system - no garbage collector
    let squares: Vec<i32> = (0..10)
        .map(|x| x * x)
        .collect();
    
    // Pattern matching
    let result = match fibonacci(10) {
        0 => "zero",
        1..=10 => "small",
        _ => "large",
    };
    
    println!("Fib(10) = {}", fibonacci(10));
}`,
            features: ['Static typing', 'Ownership system', 'Zero-cost abstractions', 'No GC']
        },
        go: {
            name: 'Go',
            code: `// Go - Simple and concurrent
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    // Goroutines for concurrency
    ch := make(chan int)
    go func() {
        ch <- fibonacci(10)
    }()
    
    // Slices
    squares := make([]int, 10)
    for i := range squares {
        squares[i] = i * i
    }
    
    fmt.Printf("Fib(10) = %d\\n", <-ch)
}`,
            features: ['Static typing', 'Goroutines', 'Channels', 'Fast compilation']
        }
    };

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const lang = btn.dataset.lang;
            const example = examples[lang];

            if (example) {
                codeDisplay.innerHTML = `
          <div class="code-block">
            <div class="code-header">
              <span class="code-dot red"></span>
              <span class="code-dot yellow"></span>
              <span class="code-dot green"></span>
              <span class="code-title">${example.name.toLowerCase()}_example.${lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : lang === 'rust' ? 'rs' : 'go'}</span>
            </div>
            <div class="code-body">
              <pre>${escapeHtml(example.code)}</pre>
            </div>
          </div>
          <div class="feature-tags">
            ${example.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
          </div>
        `;
            }
        });
    });

    // Initialize with first language
    if (langBtns.length > 0) {
        langBtns[0].click();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

    document.querySelectorAll('.card, .code-block, .path-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

console.log('💻 Programming Languages Guide Loaded');
