//
const views = [
  {
    left: 0.0,
    bottom: 0.5,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.5, 0.0, 0.0),
    button: "rotate",
  },
  {
    left: 0.0,
    bottom: 0.0,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.0, 0.7, 0.0),
    button: -1,
  },
  {
    left: 0.5,
    bottom: 0.0,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.5, 0.7, 0.7),
    button: -1,
  },
  {
    left: 0.5,
    bottom: 0.5,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.0, 0.0, 0.5),
    button: -1,
  },
];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);
const initMouse = new THREE.Vector2(1, 1);
let initCubePosition = new THREE.Vector3(1, 1);
let initCubeRotate = new THREE.Vector3(1, 1);
let initCubeScale = new THREE.Vector3(1, 1);
let initCameraPosition = new THREE.Vector3(1, 1);
let isMouseDown = false;
let stylesheet = document.styleSheets[0];

function reset(str) {
  const pointer = document.getElementsByClassName("pointer");
  for (i = 0; i < pointer.length; i++) {
    pointer[i].style.backgroundColor = str == "pointer" ? "#0009" : "#0000";
  }
  const zoom = document.getElementsByClassName("zoom");
  for (i = 0; i < zoom.length; i++) {
    zoom[i].style.backgroundColor = str == "zoom" ? "#0009" : "#0000";
  }
  const rotate = document.getElementsByClassName("rotate");
  for (i = 0; i < rotate.length; i++) {
    rotate[i].style.backgroundColor = str == "rotate" ? "#0009" : "#0000";
  }
  const camera = document.getElementsByClassName("camera");
  for (i = 0; i < camera.length; i++) {
    camera[i].style.backgroundColor = str == "camera" ? "#0009" : "#0000";
  }
  views[0].button = str;
}
const init = () => {
  stylesheet = document.styleSheets[0];
  initCubePosition = new THREE.Vector3(1, 1);
  const canvas = document.querySelector("#c");
  const scene = new THREE.Scene();
  const frustumSize = 10;
  const aspect = window.innerWidth / window.innerHeight;
  for (let i = 0; i < views.length; i++) {
    let camera;

    if (i == 0) {
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 3, 10);
      const helper = new THREE.CameraHelper(camera);
      scene.add(helper);
    } else {
      camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        1,
        1000
      );
      if (i == 1) camera.position.set(10, 0, 0);
      if (i == 2) camera.position.set(0, 10, 0);
      if (i == 3) camera.position.set(0, 0, 10);
    }
    views[i].camera = camera;

    camera.lookAt(0, 0, 0);
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  const texture = new THREE.TextureLoader().load("crate.gif");
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  const light = new THREE.DirectionalLight();
  light.position.set(0, 0, 10);
  scene.add(light);

  scene.add(new THREE.AmbientLight());

  const helper = new THREE.GridHelper(10, 10);
  scene.add(helper);
  function onMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    initMouse.set(mouse.x, mouse.y);
    initCubePosition.copy(cube.position);
    initCubeRotate.copy(cube.rotation);
    initCubeScale.copy(cube.scale);
    initCameraPosition.copy(views[0].camera.position);
    if (mouse.x > 0 && mouse.y > 0) isMouseDown = 2;
    if (mouse.x < 0 && mouse.y < 0) isMouseDown = 1;
    if (mouse.x > 0 && mouse.y < 0) isMouseDown = 3;
  }
  function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (views[0].button == "pointer") {
      if (isMouseDown == 2) {
        cube.position.x = initCubePosition.x + (mouse.x - initMouse.x) * 10;
        cube.position.y = initCubePosition.y + (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 3) {
        cube.position.x = initCubePosition.x + (mouse.x - initMouse.x) * 10;
        cube.position.z = initCubePosition.z - (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 1) {
        cube.position.z = initCubePosition.z - (mouse.x - initMouse.x) * 10;
        cube.position.y = initCubePosition.y + (mouse.y - initMouse.y) * 10;
      }
    }
    if (views[0].button == "rotate") {
      if (isMouseDown == 2) {
        cube.rotation.y = initCubeRotate.y + (mouse.x - initMouse.x) * 10;
        cube.rotation.x = initCubeRotate.x + (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 3) {
        cube.rotation.x = initCubeRotate.x + (mouse.x - initMouse.x) * 10;
        cube.rotation.z = initCubeRotate.z - (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 1) {
        cube.rotation.y = initCubeRotate.y - (mouse.x - initMouse.x) * 10;
        cube.rotation.z = initCubeRotate.z + (mouse.y - initMouse.y) * 10;
      }
    }
    if (views[0].button == "zoom") {
      if (isMouseDown == 2) {
        cube.scale.x = initCubeScale.x + (mouse.x - initMouse.x) * 10;
        cube.scale.y = initCubeScale.y + (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 3) {
        cube.scale.x = initCubeScale.x + (mouse.x - initMouse.x) * 10;
        cube.scale.z = initCubeScale.z + (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 1) {
        cube.scale.z = initCubeScale.z + (mouse.x - initMouse.x) * 10;
        cube.scale.y = initCubeScale.y + (mouse.y - initMouse.y) * 10;
      }
    }
    if (views[0].button == "camera" && isMouseDown > 0) {
      const camera = views[0].camera;
      console.log(camera);
      if (isMouseDown == 2) {
        camera.position.x = initCameraPosition.x + (mouse.x - initMouse.x) * 10;
        camera.position.y = initCameraPosition.y + (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 3) {
        camera.position.x = initCameraPosition.x + (mouse.x - initMouse.x) * 10;
        camera.position.z = initCameraPosition.z - (mouse.y - initMouse.y) * 10;
      }
      if (isMouseDown == 1) {
        camera.position.z = initCameraPosition.z - (mouse.x - initMouse.x) * 10;
        camera.position.y = initCameraPosition.y + (mouse.y - initMouse.y) * 10;
      }
    }
  }
  function onMouseUp(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log("Up");
    isMouseDown = -1;
  }
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  function animate() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    requestAnimationFrame(animate);

    for (let ii = 0; ii < views.length; ++ii) {
      const view = views[ii];
      const camera = view.camera;

      const left = Math.floor(windowWidth * view.left);
      const bottom = Math.floor(windowHeight * view.bottom);
      const width = Math.floor(windowWidth * view.width);
      const height = Math.floor(windowHeight * view.height);

      renderer.setViewport(left, bottom, width, height);
      renderer.setScissor(left, bottom, width, height);
      renderer.setScissorTest(true);
      renderer.setClearColor(view.background);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
      let vec = new THREE.Vector2(mouse.x + 0.5, mouse.y - 0.5);
      if (ii == 1) {
        vec = new THREE.Vector2(mouse.x + 0.5, mouse.y + 0.5);
      }
      if (ii == 2) {
        vec = new THREE.Vector2(mouse.x - 0.5, mouse.y + 0.5);
      }
      if (ii == 3) {
        vec = new THREE.Vector2(mouse.x - 0.5, mouse.y - 0.5);
      }

      raycaster.setFromCamera(vec, camera);

      const intersection = raycaster.intersectObject(cube);
      // console.log(ii,intersection);
    }
  }

  animate();
};
