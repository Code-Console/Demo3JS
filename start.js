//
const views = [
  {
    left: 0.0,
    bottom: 0.5,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.5, 0.0, 0.0),
    button: -1,
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
let isEdit = false;
let checkPoints, cube;
const setEditScreen = (_edit) => {
  isEdit = _edit;
  const uiContainer = document.getElementById("uiContainer");
  uiContainer.style.display = _edit ? "grid" : "none";
};
function reset(str, screen) {
  const pointer = document.getElementsByClassName("pointer");
  pointer[screen].style.backgroundColor = str == "pointer" ? "#0009" : "#0000";

  const zoom = document.getElementsByClassName("zoom");
  zoom[screen].style.backgroundColor = str == "zoom" ? "#0009" : "#0000";

  const rotate = document.getElementsByClassName("rotate");
  rotate[screen].style.backgroundColor = str == "rotate" ? "#0009" : "#0000";

  const camera = document.getElementsByClassName("camera");
  camera[screen].style.backgroundColor = str == "camera" ? "#0009" : "#0000";
  if (screen == 0) views[2].button = str;
  if (screen == 1) views[1].button = str;
  if (screen == 2) views[3].button = str;
}
const init = () => {
  const canvas = document.querySelector("#c");
  const scene = new THREE.Scene();
  let frustumSize = 5;
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
      // scene.add(helper);
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
  cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("crate.gif"),
      transparent :true,
      opacity:.9
    })
  );
  scene.add(cube);
  checkPoints = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: 0xffff00,
    })
  );
  checkPoints.position.set(0, 0.5, 0.5);
  checkPoints.scale.set(0.1, 0.1, 0.1);
  scene.add(checkPoints);

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
    if (isMouseDown < 1 || !isEdit) return;
    if (views[isMouseDown].button == "pointer") {
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
    if (views[isMouseDown].button == "rotate") {
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
    if (views[isMouseDown].button == "zoom") {
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
    if (views[isMouseDown].button == "camera" && isMouseDown > 0) {
      const camera = views[0].camera;
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
    isMouseDown = -1;
    if (!isEdit) {
      raycaster.setFromCamera(mouse, views[0].camera);
      if (raycaster.intersectObject(cube).length > 0) {
        setEditScreen(true);
      }
    }
  }
  const onWindowResize = () => {
    const aspect = window.innerWidth / window.innerHeight;
    for (let ii = 0; ii < views.length; ++ii) {
      const camera = views[ii].camera;
      if (ii == 0) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      } else {
        camera.left = (-frustumSize * aspect) / 2;
        camera.right = (frustumSize * aspect) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
      }
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  let larpF = 0,
    larpB = 0,
    delay = 0;
  const onwheel = (event) => {
    if (event.deltaY > 0) {
      larpF += 0.01;
      views[0].camera.position.z += larpF;
    } else {
      larpB -= 0.01;
      views[0].camera.position.z += larpB;
    }
    delay = 10;
    console.log(event.deltaY);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("wheel", onwheel);
  document.addEventListener("keydown", dealWithKeyboard);
  window.addEventListener("resize", onWindowResize, false);
  function animate() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    requestAnimationFrame(animate);

    for (let ii = 0; ii < views.length && isEdit; ++ii) {
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
      // camera.lookAt(cube.position.x, cube.position.y, cube.position.z);
      // camera.position.set(cube.position.x, cube.position.y, cube.position.z);
      if (ii == 3) {
        camera.position.y = cube.position.y;
        camera.position.x = cube.position.x;
      }
      if (ii == 1) {
        camera.position.y = cube.position.y;
        camera.position.z = cube.position.z;
      }
      if (ii == 2) {
        camera.position.x = cube.position.x;
        camera.position.z = cube.position.z;
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);

      if (ii === 3) {
        let newfrustumSize = cube.scale.x;
        if (newfrustumSize < cube.scale.z) newfrustumSize = cube.scale.z;
        if (newfrustumSize < cube.scale.y) newfrustumSize = cube.scale.y;

        frustumSize = newfrustumSize * 2;

        camera.left = (-frustumSize * aspect) / 2;
        camera.right = (frustumSize * aspect) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
      }
    }
    if (!isEdit) {
      renderer.setViewport(0, 0, windowWidth, windowHeight);
      renderer.setScissorTest(false);
      views[0].camera.aspect = windowWidth / windowHeight;
      views[0].camera.updateProjectionMatrix();
      renderer.setClearColor(views[0].background);
      renderer.render(scene, views[0].camera);
    }
    delay--;
    if (delay < 0) {
      if (larpF > 0) {
        larpF -= 0.01;
        views[0].camera.position.z += larpF;
      }
      if (larpB < 0) {
        larpB += 0.01;
        views[0].camera.position.z += larpB;
      }
    }
    const isInside = correctPointInBox(checkPoints?.position, cube);
    checkPoints.material.color = isInside
      ? new THREE.Color(0xffff00)
      : new THREE.Color(0xff00ff);
  }
  animate();
};
