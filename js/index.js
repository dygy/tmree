// Three JS Template
//----------------------------------------------------------------- BASIC parameters
let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;
  //renderer.toneMapping = THREE.ReinhardToneMapping;
  //console.log(window.innerWidth);
}
//---

document.body.appendChild( renderer.domElement );

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
let camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 500 );

camera.position.set(0, 2, 14);

let scene = new THREE.Scene();
let city = new THREE.Object3D();
let smoke = new THREE.Object3D();
let town = new THREE.Object3D();

let createCarPos = true;
let uSpeed = 0.001;

//----------------------------------------------------------------- FOG background

let setcolor = 0x9242f4;
//var setcolor = 0xF2F111;
//var setcolor = 0xFF6347;

scene.background = new THREE.Color(setcolor);
scene.fog = new THREE.Fog(setcolor, 10, 16);
//scene.fog = new THREE.FogExp2(setcolor, 0.05);
//----------------------------------------------------------------- RANDOM Function
function mathRandom(num = 8) {
  let numValue = -Math.random() * num + Math.random() * num;
  return numValue;
}
//----------------------------------------------------------------- CHANGE bluilding colors
let setTintNum = true;
function setTintColor() {
  let setColor;
  if (setTintNum) {
    setTintNum = false;
    setColor = 0x030400;
  } else {
    setTintNum = true;
    setColor = 0x030003;
  }
  //setColor = 0x222222;
  return setColor;
}

//----------------------------------------------------------------- CREATE City

function init() {
  let segments = 2;
  for (let i = 1; i<50; i++) {
    let geometry = new THREE.CubeGeometry(1, 1, 1, segments, segments, segments);
    let material = new THREE.MeshStandardMaterial({
      color: setTintColor(),
      wireframe: false,
      //opacity:0.9,
      //transparent:true,
      //roughness: 0.3,
      metalness: 1,
      //shading: THREE.SmoothShading,
      flatShading: THREE.FlatShading,
      side: THREE.DoubleSide
    });
    let wmaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.10,
      side: THREE.DoubleSide/*,
      shading:THREE.FlatShading*/
    });

    let cube = new THREE.Mesh(geometry, material);
    let wire = new THREE.Mesh(geometry, wmaterial);
    let floor = new THREE.Mesh(geometry, material);
    let wfloor = new THREE.Mesh(geometry, wmaterial);

    cube.add(wfloor);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotationValue = 0.1+Math.abs(mathRandom(8));
    
    floor.scale.x = floor.scale.z = 1+mathRandom(0.33);
    //floor.scale.y = 0.05;//+mathRandom(0.5);
    cube.scale.y = 0.1+Math.abs(mathRandom(8));
    TweenMax.to(cube.scale, 1, {y:cube.rotationValue, repeat:-1, yoyo:true, delay:i*0.105, ease:Power1.easeInOut});
    /*cube.setScale = 0.1+Math.abs(mathRandom());
    
    TweenMax.to(cube.scale, 4, {y:cube.setScale, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});
    TweenMax.to(cube.position, 4, {y:cube.setScale / 2, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});*/

    let cubeWidth = 0.9;
    cube.scale.x = cube.scale.z = cubeWidth+mathRandom(1-cubeWidth);
    //cube.position.y = cube.scale.y / 2;
    cube.position.x = Math.round(mathRandom());
    cube.position.z = Math.round(mathRandom());
    
    floor.position.set(cube.position.x, 0/*floor.scale.y / 2*/, cube.position.z);
    
    town.add(floor);
    town.add(cube);
  }
  //----------------------------------------------------------------- Particular

  let gmaterial = new THREE.MeshToonMaterial({color: 0xFFFF00, side: THREE.DoubleSide});
  let gparticular = new THREE.CircleGeometry(0.01, 3);
  let aparticular = 5;

  for (let h = 1; h<300; h++) {
    let particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(mathRandom(aparticular), mathRandom(aparticular),mathRandom(aparticular));
    particular.rotation.set(mathRandom(),mathRandom(),mathRandom());
    smoke.add(particular);
  }

  let pmaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    roughness: 10,
    metalness: 0.6,
    opacity: 0.9,
    transparent: true
  });
  let pgeometry = new THREE.PlaneGeometry(60, 60);
  let pelement = new THREE.Mesh(pgeometry, pmaterial);
  pelement.rotation.x = -90 * Math.PI / 180;
  pelement.position.y = -0.001;
  pelement.receiveShadow = true;
  //pelement.material.emissive.setHex(0xFFFFFF + Math.random() * 100000);

  city.add(pelement);
}

//----------------------------------------------------------------- MOUSE function
const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(), INTERSECTED;
let intersected;

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function onDocumentTouchStart( event ) {
  if ( event.touches.length === 1 ) {
    event.preventDefault();
    mouse.x = event.touches[ 0 ].pageX -  window.innerWidth / 2;
    mouse.y = event.touches[ 0 ].pageY - window.innerHeight / 2;
  }
}
function onDocumentTouchMove( event ) {
  if ( event.touches.length === 1 ) {
    event.preventDefault();
    mouse.x = event.touches[ 0 ].pageX -  window.innerWidth / 2;
    mouse.y = event.touches[ 0 ].pageY - window.innerHeight / 2;
  }
}
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchstart', onDocumentTouchStart, false );
window.addEventListener('touchmove', onDocumentTouchMove, false );

//----------------------------------------------------------------- Lights
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
let lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
let lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

const spotLightHelper = new THREE.SpotLightHelper(lightFront);
//scene.add( spotLightHelper );

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.1;
lightBack.position.set(0,6,0);

smoke.position.y = 2;

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

//----------------------------------------------------------------- GRID Helper
let gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
city.add( gridHelper );

//----------------------------------------------------------------- CAR world
let generateCar = function () {

};
//----------------------------------------------------------------- LINES world

let createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFF00) {
  let cMat = new THREE.MeshToonMaterial({color: cColor, side: THREE.DoubleSide});
  let cGeo = new THREE.CubeGeometry(1, cScale / 40, cScale / 40);
  let cElem = new THREE.Mesh(cGeo, cMat);
  let cAmp = 3;

  if (createCarPos) {
    createCarPos = false;
    cElem.position.x = -cPos;
    cElem.position.z = (mathRandom(cAmp));

    TweenMax.to(cElem.position, 3, {x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3)});
  } else {
    createCarPos = true;
    cElem.position.x = (mathRandom(cAmp));
    cElem.position.z = -cPos;
    cElem.rotation.y = 90 * Math.PI / 180;

    TweenMax.to(cElem.position, 5, {z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut});
  }
  cElem.receiveShadow = true;
  cElem.castShadow = true;
  cElem.position.y = Math.abs(mathRandom(5));
  city.add(cElem);
};

const generateLines = function () {
  for (let i = 0; i < 60; i++) {
    createCars(0.1, 20);
  }
};

//----------------------------------------------------------------- CAMERA position

const cameraSet = function () {
  createCars(0.1, 20, 0xFFFFFF);
  //TweenMax.to(camera.position, 1, {y:1+Math.random()*4, ease:Expo.easeInOut})
};

//----------------------------------------------------------------- ANIMATE

const animate = function () {
  let time = Date.now() * 0.00005;
  requestAnimationFrame(animate);

  city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
  city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
  if (city.rotation.x < -0.05) city.rotation.x = -0.05;
  else if (city.rotation.x > 1) city.rotation.x = 1;
  let cityRotation = Math.sin(Date.now() / 5000) * 13;
  //city.rotation.x = cityRotation * Math.PI / 180;

  //console.log(city.rotation.x);
  //camera.position.y -= (-(mouse.y * 20) - camera.rotation.y) * uSpeed;;

  for (let i = 0, l = town.children.length; i < l; i++) {
    let object = town.children[i];
    //object.scale.y = Math.sin(time*50) * object.rotationValue;
    //object.rotation.y = (Math.sin((time/object.rotationValue) * Math.PI / 180) * 180);
    //object.rotation.z = (Math.cos((time/object.rotationValue) * Math.PI / 180) * 180);
  }

  smoke.rotation.y += 0.01;
  smoke.rotation.x += 0.01;

  camera.lookAt(city.position);
  renderer.render(scene, camera);
};

//----------------------------------------------------------------- START functions
generateLines();
init();
animate();