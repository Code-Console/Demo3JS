let camera, scene, renderer1, renderer2, renderer3, renderer4;

let mesh1, mesh2, mesh3;
const color = new THREE.Color();
function init() {
  camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / (window.innerHeight ),
    1,
    10000
  );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(0, 0, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffff00, 0.75);
  light2.position.set(0, 0, -1);
  scene.add(light2);

  const texture = new THREE.TextureLoader().load("crate.gif");
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  renderer1 = new THREE.WebGLRenderer({ antialias: true });
//   renderer1.setPixelRatio(window.devicePixelRatio/2);
  renderer1.setSize(window.innerWidth/2, window.innerHeight / 2);
  document.body.appendChild(renderer1.domElement);

  renderer2 = new THREE.WebGLRenderer();
//   renderer2.setPixelRatio(window.devicePixelRatio);
  renderer2.setSize(window.innerWidth/2, window.innerHeight / 2);
  document.body.appendChild(renderer2.domElement);

  renderer3 = new THREE.WebGLRenderer({ antialias: true });
//   renderer3.setPixelRatio(window.devicePixelRatio);
  renderer3.setSize(window.innerWidth/2, window.innerHeight / 2);
  document.body.appendChild(renderer3.domElement);

  renderer4 = new THREE.WebGLRenderer();
//   renderer4.setPixelRatio(window.devicePixelRatio);
  renderer4.setSize(window.innerWidth/2, window.innerHeight / 2);
  document.body.appendChild(renderer4.domElement);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  
  time = performance.now() / 2000;

  camera.position.x = Math.sin(time) * 10;
  camera.position.z = Math.cos(time) * 10;

  camera.lookAt(scene.position);

  renderer1.render(scene, camera);
  renderer2.render(scene, camera);
  renderer3.render(scene, camera);
  renderer4.render(scene, camera);
}
