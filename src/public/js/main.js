import * as THREE from '/node_modules/three/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('threejs-container').appendChild(renderer.domElement);

const Z_Array_1 = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
    [2, 0], [2, 1], [2, 2], [0, 0], [2, 4], [2, 5], [2, 6], [2, 7],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7],
    [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7]
];

let highestX = 0;
let highestY = 0;
const pairs = [];

for (const sublist of Z_Array_1) {
    for (let i = 0; i < sublist.length - 1; i++) {
        const [x, y] = [sublist[i], sublist[i + 1]];
        pairs.push([x, y]);
        highestX = Math.max(highestX, x);
        highestY = Math.max(highestY, y);
    }
}

function create2DArray(highestX, highestY, pairs) {
    const array = Array(highestY + 1).fill().map(() => Array(highestX + 1).fill(0));
    for (const [x, y] of pairs) {
        array[y][x] = 1;
    }
    return array;
}

function createCube(x, y, z) {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff || 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x - highestX/2, y - highestY/2, z);
    scene.add(cube);
    return cube;
}


const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x808080);
scene.add(ambientLight);

async function fillInArrayWithCubes(highestX, highestY, sourceArray) {
    const cubeArray = Array(highestY + 1).fill().map(() => Array(highestX + 1).fill(null));
    
    for (let layer = 0; layer <= Math.min(highestX, highestY) / 2; layer++) {
        for (let x = layer; x <= highestX - layer; x++) {
            let y = layer;
            if (sourceArray[y][x] === 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
                cubeArray[y][x] = createCube(x, y, 0);
            }
        }
        
        for (let y = layer; y <= highestY - layer; y++) {
            let x = highestX - layer;
            if (sourceArray[y][x] === 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
                cubeArray[y][x] = createCube(x, y, 0);
            }
        }
        
        for (let x = highestX - layer; x >= layer; x--) {
            let y = highestY - layer;
            if (sourceArray[y][x] === 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
                cubeArray[y][x] = createCube(x, y, 0);
            }
        }
        
        for (let y = highestY - layer; y >= layer; y--) {
            let x = layer;
            if (sourceArray[y][x] === 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
                cubeArray[y][x] = createCube(x, y, 0);
            }
        }
    }
    return cubeArray;
}

async function visualizeArray() {
    const array2D = create2DArray(highestX, highestY, pairs);
    await fillInArrayWithCubes(highestX, highestY, array2D);
}


camera.position.z = 15;


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


visualizeArray();
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});