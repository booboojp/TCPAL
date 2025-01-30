/******/ (() => { // webpackBootstrap
/*!*******************************!*\
  !*** ./src/public/js/main.js ***!
  \*******************************/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: false,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fixed Three.js canvas
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
  wireframeLinewidth: 1
});
const cube = new THREE.Mesh(geometry, material);
const axes = new THREE.AxesHelper(0.5);
cube.add(axes);
scene.add(cube);
camera.position.z = 5;
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);
function animate() {
  // Always rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Smoothly interpolate scroll position
  currentScroll += (targetScroll - currentScroll) * scrollSpeed;

  // Interpolate cube position towards targetPosition
  cube.position.lerp(targetPosition, scrollSpeed);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
function dispose() {
  geometry.dispose();
  material.dispose();
  renderer.dispose();
}
animate();
/******/ })()
;
//# sourceMappingURL=bundle.js.map