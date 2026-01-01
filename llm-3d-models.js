/* ============================================
   LLM 3D Models - Interactive Logic
   Three.js Hero & Procedural Terrain
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initTerrainDemo();
});

/* ----------------------------------------------------------------
   1. Hero Section: Rotating 3D Object
   ---------------------------------------------------------------- */
function initHeroScene() {
    const canvas = document.getElementById('heroCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00aaff, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xaa55ff, 1.5, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Icosahedron (complex shape)
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        wireframe: true,
        emissive: 0x00aaff,
        emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ----------------------------------------------------------------
   2. Terrain Demo: Procedural Noise
   ---------------------------------------------------------------- */
function initTerrainDemo() {
    const canvas = document.getElementById('terrainCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050510);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Terrain Geometry
    const size = 50;
    const segments = 100;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
        color: 0x228833,
        wireframe: false,
        flatShading: true
    });

    const terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    // UI Controls
    const ampSlider = document.getElementById('amplitude');
    const freqSlider = document.getElementById('frequency');
    const octSlider = document.getElementById('octaves');

    function updateTerrain() {
        const amplitude = parseFloat(ampSlider.value);
        const frequency = parseFloat(freqSlider.value) * 0.05;
        const octaves = parseInt(octSlider.value);

        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Fractal Brownian Motion (fBM)
            let elevation = 0;
            let amp = amplitude;
            let freq = frequency;
            for (let o = 0; o < octaves; o++) {
                elevation += amp * noise(x * freq, z * freq);
                amp *= 0.5;
                freq *= 2;
            }

            positions.setY(i, elevation);
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    // Simple 2D Noise Function (Value Noise Approximation)
    function noise(x, y) {
        const floor = (v) => Math.floor(v);
        const fract = (v) => v - floor(v);
        const lerp = (a, b, t) => a + t * (b - a);
        const hash = (n) => {
            let s = Math.sin(n) * 43758.5453;
            return s - Math.floor(s);
        };

        const ix = floor(x);
        const iy = floor(y);
        const fx = fract(x);
        const fy = fract(y);

        // Smooth interpolation
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);

        const n00 = hash(ix + iy * 57);
        const n10 = hash(ix + 1 + iy * 57);
        const n01 = hash(ix + (iy + 1) * 57);
        const n11 = hash(ix + 1 + (iy + 1) * 57);

        const nx0 = lerp(n00, n10, ux);
        const nx1 = lerp(n01, n11, ux);
        return lerp(nx0, nx1, uy) * 2 - 1; // [-1, 1]
    }

    // Event Listeners
    ampSlider.addEventListener('input', updateTerrain);
    freqSlider.addEventListener('input', updateTerrain);
    octSlider.addEventListener('input', updateTerrain);

    // Initial Generation
    updateTerrain();

    // Animation Loop
    let angle = 0;
    function animate() {
        requestAnimationFrame(animate);
        angle += 0.003;
        camera.position.x = Math.sin(angle) * 25;
        camera.position.z = Math.cos(angle) * 25;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        const rect = canvas.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height);
    });
}
