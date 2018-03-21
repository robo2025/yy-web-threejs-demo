var container, stats, controls;
var camera, scene, renderer, light;
var clock = new THREE.Clock();
var mixers = [];

init();
animate();

function init() {
    //创建容器
    container = document.createElement('div');
    document.body.appendChild(container);

    //透视摄像机

    // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    // fov — Camera frustum vertical field of view. 相机平截头体垂直的视野
    // aspect — Camera frustum aspect ratio. 相机平截头长宽比
    // near — Camera frustum near plane.
    // far — Camera frustum far plane
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(200, 200, 900);

    //轨道控制
    controls = new THREE.OrbitControls(camera);
    controls.target.set(0, 100, 0);
    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    //雾景
    // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    //灯光（半球灯光）
    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add(light);

    //添加摄影线
    // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

    // ground
    // var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
    //     color: 0x999999,
    //     depthWrite: false
    // }));
    // mesh.rotation.x = -Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add(mesh);
    
    //桌面网格
    // var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // scene.add(grid);

    // model
    var loader = new THREE.FBXLoader();
    loader.load('https://imgcdn.robo2025.com/models/Model_ThreeJS.fbx', function (object) {
        
        object.mixer = new THREE.AnimationMixer(object);
        mixers.push(object.mixer);

        var action = object.mixer.clipAction(object.animations[0]);
        action.play();

        object.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        scene.add(object);
        document.getElementById('preloader').style.display = 'none';  
    });

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    // stats
    // stats = new Stats();
    // container.appendChild(stats.dom);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    if (mixers.length > 0) {

        for (var i = 0; i < mixers.length; i++) {

            mixers[i].update(clock.getDelta());

        }

    }

    renderer.render(scene, camera);
    // stats.update();
}