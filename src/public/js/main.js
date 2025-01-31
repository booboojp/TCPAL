import * as THREE from '/node_modules/three/build/three.module.js';
import { mock3DArrayExport as mock3DArray } from '../animations/animation.testing.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('threejs-container').appendChild(renderer.domElement);



class Browser {
    constructor() {
        this.isWindowFocused = true;
        this.isRotatingRight = false;
        this.isRotatingLeft = false;
        this.ROTATION_SPEED = 0.02;

        this.initEventListeners();
    }

    initEventListeners() {
        window.addEventListener('blur', () => {
            this.isWindowFocused = false;
            this.isRotatingLeft = false;
            this.isRotatingRight = false;
        });


        window.addEventListener('focus', () => {
            this.isWindowFocused = true;
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                this.isRotatingRight = true;
            }
            if (event.key === 'ArrowLeft') {
                this.isRotatingLeft = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowRight') {
                this.isRotatingRight = false;
            }
            if (event.key === 'ArrowLeft') {
                this.isRotatingLeft = false;
            }
        });
    }
    updateCameraRotation(camera, scene) {
        if (this.isWindowFocused) {
            if (!(this.isRotatingRight) || !(this.isRotatingLeft)) {
                if (this.isRotatingRight) {
                    camera.position.x = camera.position.x * Math.cos(this.ROTATION_SPEED) + camera.position.z * Math.sin(this.ROTATION_SPEED);
                    camera.position.z = camera.position.z * Math.cos(this.ROTATION_SPEED) - camera.position.x * Math.sin(this.ROTATION_SPEED);
                    camera.lookAt(scene.position);
                }
                if (this.isRotatingLeft) {
                    camera.position.x = camera.position.x * Math.cos(-this.ROTATION_SPEED) + camera.position.z * Math.sin(-this.ROTATION_SPEED);
                    camera.position.z = camera.position.z * Math.cos(-this.ROTATION_SPEED) - camera.position.x * Math.sin(-this.ROTATION_SPEED);
                    camera.lookAt(scene.position);
                }
            }
        }
    }
}

const browser = new Browser();




let highestX = 0;
let highestY = 0;
const pairs = [];


for (const layer of mock3DArray) {
    for (const sublist of layer) {
        for (let i = 0; i < sublist.length - 1; i++) {
            const [x, y] = [sublist[i], sublist[i + 1]];
            pairs.push([x, y]);
            highestX = Math.max(highestX, x);
            highestY = Math.max(highestY, y);
        }
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
    console.log(`Creating cube at x:${x}, y:${y}, z:${z}`);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x0000ff,  
        shininess: 100,  
        specular: 0x444444 
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x - highestX / 2, z, y - highestY / 2);
    scene.add(cube);
    return cube;
}
function addLayerOutline(layerIndex, highestX, highestY) {
    let outline;
    const color = layerIndex === 0 ? 0xffffff : layerIndex === mock3DArray.length - 1 ? 0xffff00 : 0xff00ff;

    if (layerIndex === 0 || layerIndex === mock3DArray.length - 1) {
        const boxGeometry = new THREE.BoxGeometry(highestX + 1, 1, highestY + 1);
        const edges = new THREE.EdgesGeometry(boxGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
        outline = new THREE.LineSegments(edges, lineMaterial);
        outline.position.set(0, layerIndex, 0);
    } else {
        const cornerSize = 1;
        const cornerGeometry = new THREE.BoxGeometry(cornerSize, 1, cornerSize);
        const edges = new THREE.EdgesGeometry(cornerGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });

        outline = new THREE.Group();

        const positions = [
            { x: -highestX / 2, z: -highestY / 2 },
            { x: highestX / 2, z: -highestY / 2 },
            { x: highestX / 2, z: highestY / 2 },
            { x: -highestX / 2, z: highestY / 2 },
        ];

        positions.forEach(pos => {
            const corner = new THREE.LineSegments(edges, lineMaterial);
            corner.position.set(pos.x, 0, pos.z);
            outline.add(corner);
        });
    }

    scene.add(outline);
}
function createBorder(maxX, maxY, layerIndex, totalLayers) {
    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const borderGeometry = new THREE.BoxGeometry(1, 1, 1);
    const borderCubes = [];
    
    const width = maxX + 2;
    const height = maxY + 2;

    for(let x = -1; x <= width - 1; x++) {
        for(let z = -1; z <= height - 1; z++) {
            if(layerIndex === 0 || layerIndex === totalLayers - 1) {
                if(x === -1 || x === width -1 || z === -1 || z === height -1) {
                    const cube = new THREE.Mesh(borderGeometry, borderMaterial);
                    cube.position.set(x - maxX / 2, layerIndex, z - maxY / 2);
                    scene.add(cube);
                    borderCubes.push(cube);
                }
            } else {
                if(
                    (x === -1 && z === -1) ||
                    (x === -1 && z === height -1) ||
                    (x === width -1 && z === -1) ||
                    (x === width -1 && z === height -1)
                ) {
                    const cube = new THREE.Mesh(borderGeometry, borderMaterial);
                    cube.position.set(x - maxX / 2, layerIndex, z - maxY / 2);
                    scene.add(cube);
                    borderCubes.push(cube);
                }
            }
        }
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




async function fillInArrayWithCubes(highestX, highestY, mock3DArray) {
    console.log('fillInArrayWithCubes called');

    for (let z = 0; z < mock3DArray.length; z++) {
        const layerData = mock3DArray[z];
        console.log(`Animating layer ${z}`);

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

        for (const [x, y] of path) {
            console.log(`Animating cube at x:${x}, y:${y}, z:${z}`);
            await new Promise(resolve => setTimeout(resolve, 100));

            const shouldCreateCube = layerData.some(coord => coord[0] === x && coord[1] === y);

            if (shouldCreateCube) {
                createCube(x, y, z);
            } else {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(x - highestX / 2, z, y - highestY / 2);
                scene.add(cube);
            }
        }

        addLayerOutline(z, highestX, highestY);
    }

    console.log('All layers animated');
}
async function visualizeArray() {
    const totalLayers = mock3DArray.length;
    mock3DArray.forEach((layer, index) => {
        let maxX = highestX;
        let maxY = highestY;
        createBorder(maxX, maxY, index, totalLayers);
    });
    console.log('visualizeArray called');
    const array2D = create2DArray(highestX, highestY, pairs);
    await fillInArrayWithCubes(highestX, highestY, mock3DArray);
    
    for (let z = 0; z < mock3DArray.length; z++) {
        const layer = mock3DArray[z];
        console.log(`Animating layer ${z}`);
        for (let i = 0; i < layer.length; i++) {
            const [x, y] = layer[i];
            if (sourceArray[y][x] === 1) {
                createCube(x, y, z);
            } else {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(x - highestX / 2, z, y - highestY / 2);
                scene.add(cube);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

camera.position.set(13, 10, 13);  
camera.lookAt(0, 0, 0);           
camera.updateProjectionMatrix();






function animate() {
    requestAnimationFrame(animate);
    browser.updateCameraRotation(camera, scene);
    renderer.render(scene, camera);
}


visualizeArray();
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});