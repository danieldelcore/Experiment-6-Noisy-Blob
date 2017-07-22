/* globals window, document */

import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
import Blob from './blob';

const OrbitControls = ThreeOrbitControls(THREE);

const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 80;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = false;
controls.maxDistance = 5000.0;
controls.enableDamping = true;
controls.dampingFactor = 0.16;
controls.target.set(0, 0, 0);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-100, 20, 30);

camera.add(directionalLight);
scene.add(ambientLight, camera);

// Blob
const blob = new Blob(scene);
scene.add(blob.mesh);

function animate(timeStamp) {
    window.requestAnimationFrame(animate);

    blob.mesh.rotation.x += 0.001;
    blob.mesh.rotation.y += 0.001;

    blob.update(timeStamp);
    controls.update();
    renderer.render(scene, camera);
}

function onResize() {
    const { innerWidth, innerHeight } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize); // eslint-disable-line no-use-before-define
animate();
