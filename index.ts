import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion  } from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

var modal = document.querySelector(".modal");
var closeButton = document.querySelector(".close-button");

function toggleModal() {
	modal?.classList.toggle("show-modal");
}

function windowOnClick(event: any) {
	if (event.target === modal) {
		toggleModal();
	}
}

closeButton?.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
var meshContent = {
	Plane: 'This is extremely nice BOX! <br/> <p style = "color:green">No problems with CSS styling.</p>',
	IcoSphere: 'This SPHERE is really wonderful! <br/><h3>HTML tags allowed :)</h3>',
	Cylinder: `<div class="modal-title">Customize Cylinder</div>
	<div class="modal-body">
		<label for="diameter">Diameter: </label><br/>
		<input type="range" id="diameter" value="1" min="0.1" max="2.0" step="0.1" oninput="diameterVal.value = this.value" />
		<output id="diameterVal">1</output><br/>
		<label for="height">Height: </label><br/>
		<input type="range" id="height" value="1" min="0.1" max="2.0" step="0.1" oninput="heightVal.value = this.value" />
		<output id="heightVal">1</output>
	</div>`
}

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);

function prepareScene() {
	// Camera
	const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), scene);
	camera.attachControl(canvas, true);

	// Light
	new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);

	// Objects
	const plane = MeshBuilder.CreateBox("Plane", {}, scene);
	plane.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);

	const icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {}, scene);
	icosphere.position.set(-2, 0, 0);

	const cylinder = MeshBuilder.CreateCylinder("Cylinder", {}, scene);
	cylinder.position.set(2, 0, 0);

	scene.onPointerPick = function () {
		// We try to pick an object
		var pickResult = scene.pick(scene.pointerX, scene.pointerY);
		if (pickResult?.hit) {
			var currentMesh = pickResult.pickedMesh;
			console.log(currentMesh?.id);
			toggleModal();
			var modalContent = document.getElementById("modal-iframe");
			if (modalContent) {
				switch(currentMesh?.id) {
					case "Plane":
						modalContent.innerHTML = meshContent.Plane;
						return;
					case "IcoSphere":
						modalContent.innerHTML = meshContent.IcoSphere;
						return;
					case "Cylinder":
						modalContent.innerHTML = meshContent.Cylinder;
						return;
					default:
						return;
				}
				
			}
				
		}
	}
}

prepareScene();

engine.runRenderLoop(() => {
	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
})