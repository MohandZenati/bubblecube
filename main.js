import * as THREE from 'three'
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// import {GUI} from 'three/examples/jsm/libs/dat.gui.module.js';
// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
// import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';

const tintin = new URL('./tintin.glb', import.meta.url);
// const mergeCube = new URL('./mergecube.fbx', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0085FF)
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// Chargement du modèle GLTF

const gltfLoader = new GLTFLoader();
gltfLoader.load('mergecube.glb', (gltf) => {

  // Récupération du mesh du modèle
  const cube = gltf.scene.children[0];

  // Chargement de la texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('./gltf_embedded_0.png', (texture) => {

    // Création du matériau avec la texture
    const material = new THREE.MeshStandardMaterial({
      map: texture
    });

    // Affectation du matériau au mesh du modèle
    cube.material = material;

    // Ajout du modèle à la scène
    
  });
  cube.scale.set(0.02, 0.02, 0.02);
  cube.position.set(0, -10, -2);
  scene.add(cube);


});

const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(tintin.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Play a certain animation
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

}, undefined, function(error) {
    console.error(error);
});
// assetLoader.load(mergeCube.href, function(gltf) {
//   const model = gltf.scene;
//   scene.add(model);
//   mixer = new THREE.AnimationMixer(model);
//   const clips = gltf.animations;

//   // Play a certain animation
//   // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
//   // const action = mixer.clipAction(clip);
//   // action.play();

//   // Play all animations at the same time
//   clips.forEach(function(clip) {
//       const action = mixer.clipAction(clip);
//       action.play();
//   });

// }, undefined, function(error) {
//   console.error(error);
// });

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    
    
}

// Chargement de la texture de la bulle de savon
const textureLoader = new THREE.TextureLoader();
const bubbleTexture = textureLoader.load('bubble.png');

// Création de la géométrie des particules
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 10;
const positions = new Float32Array(particleCount * 30);
const sizes = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i++) {
  const x = Math.random() * 20 - 10;
  const y = Math.random() * 20 - 10;
  const z = Math.random() * 20 - 10;
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
  sizes[i] = Math.random() * 0.5 + 0.5;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 5));

// Création du matériau des particules
const particleMaterial = new THREE.PointsMaterial({
  size: 10,
  map: bubbleTexture,
  transparent: true,
  alphaTest: 0.5,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Création de l'objet des particules
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const ambientLight = new THREE.AmbientLight(0xffffff, 5); 
scene.add(ambientLight);

// Ajouter une lumière directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); 
directionalLight.position.set(0, 0, 1); // Position de la lumière
scene.add(directionalLight);


// Ajouter l'effet de zoom au chargement de la page
window.addEventListener('load', function() {
  // Zoom in to the scene
  const zoomInDuration = 5000;
  const targetZoomDistance = 5; 
  const initialZoomDistance = 1000;
  const zoomInStartTime = Date.now();

  function animateZoomIn() {
      const elapsed = Date.now() - zoomInStartTime;
      const t = Math.min(1, elapsed / zoomInDuration);
      const zoomDistance = (1 - t) * initialZoomDistance + t * targetZoomDistance;
      camera.position.set(zoomDistance, zoomDistance, zoomDistance);
      camera.lookAt(scene.position);
      if (t < 1) {
          requestAnimationFrame(animateZoomIn);
      }
  }

  animateZoomIn();
});



const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.z = 500;
orbit.update();



animate();


const controls = new OrbitControls(camera, renderer.domElement);