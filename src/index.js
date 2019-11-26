// import * as THREE from 'three';
// window.THREE = THREE;
// import OrbitControls from 'three-orbitcontrols';
// import ObjLoader2 from 'three/examples/jsm/loaders/OBJLoader2.js';
// import dragon from './resources/Dragon.obj';
// import dragonMtl from './resources/Dragon.mtl';
// import MtlLoader from 'three/examples/js/loaders/MTLLoader.js';


const run = async () => {
	window.THREE = (await import('three'));
	const OBJLoader = (await import('three/examples/js/loaders/OBJLoader.js'));
	let MTLLoader = await import('three/examples/js/loaders/MTLLoader.js');
	import('./style.css');
	const dragon = (await import('./resources/Dragon.obj')).default;
	const dragonMtl = (await import('./resources/Dragon.mtl')).default;
	const OrbitControls = (await import('three-orbitcontrols')).default;

	// step 1. Create the Renderer
	var renderer = new THREE.WebGLRenderer();
	const canvas = renderer.domElement;
	renderer.setSize(window.innerWidth, window.innerHeight);
	// step 2. Create the Scene
	var scene = new THREE.Scene();
	scene.background = new THREE.Color('yellow');
	const fov = 45;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 100;
	// step 3. Create the camera
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 10, 20);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 5, 0);
	controls.update();
	// step 4. add the camera to the scene
	scene.add(camera);
	document.body.appendChild(renderer.domElement);

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

	// load model
	// instantiate the loader
	{
		let objLoader = new THREE.OBJLoader();
		const mtlLoader = new THREE.MTLLoader();
		mtlLoader.load(dragonMtl, (mtlParseResult) => {
			objLoader.setMaterials(mtlParseResult);
			objLoader.load(dragon, (root) => {
				console.log(root);
				scene.add(root);
				render()
			});
		});
	}

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

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
};

run();