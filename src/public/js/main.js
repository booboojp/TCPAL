import * as THREE from '/node_modules/three/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('threejs-container').appendChild(renderer.domElement);


const ROTATION_SPEED = 0.02;
let isRotatingRight = false;
let isRotatingLeft = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        isRotatingRight = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
        isRotatingRight = false;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        isRotatingLeft = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        isRotatingLeft = false;
    }
});

const Z_Array_1 = [
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
    [2, 0], [2, 1], [2, 2], [1, 3], [2, 4], [2, 5], [2, 6], [2, 7],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7],
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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x0000ff,  
        shininess: 100,  
        specular: 0x444444 
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x - highestX / 2, 0, y - highestY / 2);
    scene.add(cube);
    return cube;
}

function createBorder(maxX, maxY) {
    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const borderGeometry = new THREE.BoxGeometry(1, 1, 1);
    const borderCubes = [];
    
    const width = maxX + 2;
    const height = maxY + 2;

    for(let x = -1; x <= width - 1; x++) {
        const topCube = new THREE.Mesh(borderGeometry, borderMaterial);
        topCube.position.set(x - maxX/2, 0, -1 - maxY/2);
        scene.add(topCube);
        borderCubes.push(topCube);
        
        const bottomCube = new THREE.Mesh(borderGeometry, borderMaterial);
        bottomCube.position.set(x - maxX/2, 0, height - 1 - maxY/2);
        scene.add(bottomCube);
        borderCubes.push(bottomCube);
    }
    
    for(let y = 0; y < height; y++) {

        const leftCube = new THREE.Mesh(borderGeometry, borderMaterial);
        leftCube.position.set(-1 - maxX/2, 0, y - maxY/2);
        scene.add(leftCube);
        borderCubes.push(leftCube);
        
        const rightCube = new THREE.Mesh(borderGeometry, borderMaterial);
        rightCube.position.set(width - 1 - maxX/2, 0, y - maxY/2);
        scene.add(rightCube);
        borderCubes.push(rightCube);
    }
    
    return borderCubes;
}


const light = new THREE.PointLight(0xffffff, 10, 100); 
light.position.set(0, 10, 10); 
scene.add(light);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);


const light2 = new THREE.PointLight(0xffffff, 8, 100);
light2.position.set(10, 10, -10);
scene.add(light2);
createBorder(highestX, highestY);



async function fillInArrayWithCubes(highestX, highestY, sourceArray) {

    const path = [];
    for (let layer = 0; layer <= Math.min(highestX, highestY) / 2; layer++) {

        for (let x = layer; x <= highestX - layer; x++) {
            path.push([x, layer]);
        }

        for (let y = layer + 1; y <= highestY - layer; y++) {
            path.push([highestX - layer, y]);
        }

        for (let x = highestX - layer - 1; x >= layer; x--) {
            path.push([x, highestY - layer]);
        }

        for (let y = highestY - layer - 1; y > layer; y--) {
            path.push([layer, y]);
        }
    }


    const cubeArray = Array(highestY + 1).fill().map(() => Array(highestX + 1).fill(null));
    
    for (const [x, y] of path) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (sourceArray[y][x] === 1) {
            cubeArray[y][x] = createCube(x, y, 0);
        } else {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x - highestX / 2, 0, y - highestY / 2);
            scene.add(cube);
            cubeArray[y][x] = cube;
        }
    }
    
    return cubeArray;
}
async function visualizeArray() {
    const array2D = create2DArray(highestX, highestY, pairs);
    await fillInArrayWithCubes(highestX, highestY, array2D);
}


camera.position.set(15, 10, 15);  
camera.lookAt(0, 0, 0);           
camera.updateProjectionMatrix();


let isWindowFocused = true;

window.addEventListener('blur', () => {
    isWindowFocused = false;
    isRotatingLeft = false;
    isRotatingRight = false;
});

window.addEventListener('focus', () => {
    isWindowFocused = true;
});

function animate() {
    requestAnimationFrame(animate);
    if (isWindowFocused) {
        if (!(isRotatingRight) || !(isRotatingLeft)) {
            if (isRotatingRight) {
                camera.position.x = camera.position.x * Math.cos(ROTATION_SPEED) + camera.position.z * Math.sin(ROTATION_SPEED);
                camera.position.z = camera.position.z * Math.cos(ROTATION_SPEED) - camera.position.x * Math.sin(ROTATION_SPEED);
                camera.lookAt(scene.position);
            }
            if (isRotatingLeft) {
                camera.position.x = camera.position.x * Math.cos(-ROTATION_SPEED) + camera.position.z * Math.sin(-ROTATION_SPEED);
                camera.position.z = camera.position.z * Math.cos(-ROTATION_SPEED) - camera.position.x * Math.sin(-ROTATION_SPEED);
                camera.lookAt(scene.position);
            }
        }
    }
    renderer.render(scene, camera);
}


visualizeArray();
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});