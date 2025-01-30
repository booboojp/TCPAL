import * as THREE from '/node_modules/three/build/three.module.js';

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);
// Function to create a cube
function createCube(x = 0, y = 0, z = 0) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: (Math.random() * 0xffffff) || 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    scene.add(cube);
    return cube;
}


async function createCubesWithDelay() {
    for (let i = 0; i < 3; i++) {
        createCube(i, i, 0);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

createCubesWithDelay();

const cube = createCube(0, 0, 0); // Example position
camera.position.z = 10;

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();