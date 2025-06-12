import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc); // Light grey background

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2; // Adjust camera position to look down slightly
camera.lookAt(0, 0, 0); // Look at the center of the scene

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('gameCanvas'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace; // Important for GLTF colors

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the ground
controls.minDistance = 2; // Prevent zooming in too close
controls.maxDistance = 20; // Prevent zooming out too far

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Increased intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Increased intensity
directionalLight.position.set(3, 5, 2).normalize();
directionalLight.castShadow = true; // Optional: if you want shadows later
scene.add(directionalLight);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GLTF Loader
const loader = new GLTFLoader();

loader.load(
    'assets/Kit/Models/tiles/hex/gltf/hex_forest.gltf.glb',
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // Adjust scale if necessary
        model.position.set(0, 0, 0); // Adjust position if necessary
        scene.add(model);
        console.log("Loaded hex_forest.gltf.glb");
        // Render after model is loaded (optional, animate loop will also render)
        // renderer.render(scene, camera);
    },
    undefined, // onProgress callback (optional)
    function (error) {
        console.error('An error happened while loading the tile:', error);
    }
);

// Load House Object
loader.load(
    'assets/Kit/Models/objects/gltf/house.gltf.glb',
    function (gltf) {
        const houseModel = gltf.scene;
        houseModel.scale.set(0.5, 0.5, 0.5); // Adjust scale if necessary, houses might be large
        houseModel.position.set(0, 0.1, -0.5); // Position it on the tile, adjust y slightly if needed, and x,z to place it.
        scene.add(houseModel);
        console.log("Loaded house.gltf.glb");
        // Render after model is loaded (optional, animate loop will also render)
        // renderer.render(scene, camera);
    },
    undefined, // onProgress callback (optional)
    function (error) {
        console.error('An error happened while loading the house:', error);
    }
);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // only required if controls.enableDamping or controls.autoRotate are set to true

    renderer.render(scene, camera);
}

console.log("Three.js scene initialized, models loading, and animation loop started.");
animate();
