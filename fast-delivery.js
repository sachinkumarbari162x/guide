/* ============================================
   Fast Delivery - Interactive Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNetworkSimulator();
    initPipelineInteractive();
});

/* ----------------------------------------------------------------
   1. Network Latency Simulator
   ---------------------------------------------------------------- */
function initNetworkSimulator() {
    const latencyRange = document.getElementById('latencyRange');
    const latencyValue = document.getElementById('latencyValue');
    const protocolSelect = document.getElementById('protocolSelect');
    const packet = document.getElementById('demoPacket');
    
    let currentLatency = 100;
    let currentProtocol = '1'; // 1=HTTP/1.1, 2=HTTP/2, 3=HTTP/3

    function updateSimulation() {
        // Update text display
        latencyValue.textContent = `${currentLatency} ms`;
        
        // Calculate animation speed based on latency
        // Lower latency = faster animation (shorter duration)
        // Base duration 2s at 100ms. 
        // If latency is 10ms -> extremely fast (0.2s)
        // If latency is 500ms -> slow (5s)
        
        let baseDuration = currentLatency / 50; // Simple scaler
        
        // Protocol effect: HTTP/3 is "smoother" or "faster" visually (simulated)
        if (currentProtocol === '3') {
            baseDuration *= 0.8; // Transport optimizations
        }
        
        // Clamp duration for sanity
        const duration = Math.max(0.2, Math.min(baseDuration, 5));
        
        // Apply animation style
        packet.style.animationDuration = `${duration}s`;
        
        // Visual indicator of congestion/overhead for older protocols
        if (currentProtocol === '1') {
            packet.style.backgroundColor = '#ff0055'; // Red tint for slower feeling
            packet.style.boxShadow = '0 0 10px #ff0055';
        } else if (currentProtocol === '2') {
            packet.style.backgroundColor = '#00f3ff'; // Default cyan
            packet.style.boxShadow = '0 0 10px #00f3ff';
        } else {
            packet.style.backgroundColor = '#00ff9d'; // Green for fastest
            packet.style.boxShadow = '0 0 15px #00ff9d, 0 0 30px #00ff9d';
        }
    }

    latencyRange.addEventListener('input', (e) => {
        currentLatency = parseInt(e.target.value);
        updateSimulation();
    });

    protocolSelect.addEventListener('change', (e) => {
        currentProtocol = e.target.value;
        updateSimulation();
    });

    // Initialize animation class
    packet.classList.add('animate');
    updateSimulation();
}

/* ----------------------------------------------------------------
   2. Browser Pipeline Interactive
   ---------------------------------------------------------------- */
function initPipelineInteractive() {
    const steps = document.querySelectorAll('.step');
    const infoBox = document.getElementById('pipelineInfo');
    
    const descriptions = {
        'HTML Parsing': "The browser reads raw bytes of HTML off the network, tokenizes them, and builds the Document Object Model (DOM).",
        'DOM Tree': "A tree structure representing the content of the page. Scripts can manipulate this tree.",
        'CSSOM': "CSS Object Model. The browser parses CSS to understand styles for every node. This blocks rendering!",
        'Layout': "Geometry calculation. The browser figures out where every box goes on the screen (x, y, width, height).",
        'Paint': "Pixel filling. The browser fills in colors, images, shadows, and text.",
        'Composite': "Layer assembly. The GPU takes separate layers (created by z-index or transforms) and puts them together."
    };

    steps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            // Highlight active step
            steps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');
            
            // Update info text
            const label = step.querySelector('.step-label').textContent;
            const text = descriptions[label] || "Processing step...";
            
            infoBox.innerHTML = `<h4>${label}</h4><p>${text}</p>`;
        });
    });
}
