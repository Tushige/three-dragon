// import * as THREE from 'three';
// window.THREE = THREE;
// import OrbitControls from 'three-orbitcontrols';
// import ObjLoader2 from 'three/examples/jsm/loaders/OBJLoader2.js';
// import dragon from './resources/Dragon.obj';
// import dragonMtl from './resources/Dragon.mtl';
// import MtlLoader from 'three/examples/js/loaders/MTLLoader.js';
import('./style.css');

const run = async () => {
	window.THREE = (await import('three'));
	const GLTFLoader = (await import('three/examples/js/loaders/GLTFLoader.js'));
	const SkeletonUtils = await import('three/examples/js/utils/SkeletonUtils.js');
	const dragonGltf = (await import('./resources/Dragon.gltf')).default;
	const OrbitControls = (await import('three-orbitcontrols')).default;

	// world set up
	var renderer = new THREE.WebGLRenderer();
	const canvas = renderer.domElement;
	renderer.setSize(window.innerWidth, window.innerHeight);
	var scene = new THREE.Scene();
	scene.background = new THREE.Color('yellow');
	const fov = 45;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 10, 20);
	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 5, 0);
	controls.update();
	scene.add(camera);
	document.body.appendChild(renderer.domElement);
	// LIGHTS
	{
		const skyColor = 0xB1E1FF;  // light blue
		const groundColor = 0xB97A20;  // brownish orange
		const intensity = 20;
		const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
		scene.add(light);
	}

	{
		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(0, 10, 0);
		light.target.position.set(-5, 0, 0);
		scene.add(light);
		scene.add(light.target);
	}
	// MODEL
	var dragon = {}
	var mixer;
	// load model
	// instantiate the loader
	const gltfLoader = new THREE.GLTFLoader();
	gltfLoader.load(dragonGltf, (gltf) => {
		const root = gltf.scene;
		const animsByName = {}
		gltf.animations.forEach(clip => {
			animsByName[clip.name] = clip;
		})
		dragon.animations = animsByName;

		const clonedScene = THREE.SkeletonUtils.clone(gltf.scene);
		const dragonRoot = new THREE.Object3D();
		dragonRoot.add(clonedScene);
		scene.add(dragonRoot);

		mixer = new THREE.AnimationMixer(clonedScene);
		const firstClip = Object.values(dragon.animations)[1];
		const action = mixer.clipAction(firstClip);
		action.play();

		render(0);
	})

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	let then = 0;

	function render(now) {
		now *= 0.001;  // convert to seconds
		const deltaTime = now - then;
		then = now;

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		mixer.update(deltaTime);

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
};

run();