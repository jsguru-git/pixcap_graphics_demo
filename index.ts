import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion, AbstractMesh, Nullable  } from 'babylonjs';
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

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);
var currentMesh: Nullable<AbstractMesh>;
var cylinderHeight = 2;
var cylinderDiameter = 1;

var meshContent = {
	Plane: 'This is extremely nice BOX! <br/> <p style = "color:green">No problems with CSS styling.</p>',
	IcoSphere: 'This SPHERE is really wonderful! <br/><h3>HTML tags allowed :)</h3>',
	Cylinder: `
	<div class="modal-title">Customize Cylinder</div>
	<div class="modal-body">
		<label for="diameter">Diameter: </label><br/>
		<input type="range" id="diameter" value="%3" min="0.1" max="2.0" step="0.1" oninput="diameterVal.value = this.value" />
		<output id="diameterVal">%4</output><br/>
		<label for="height">Height: </label><br/>
		<input type="range" id="height" value="%1" min="0.1" max="2.0" step="0.1" oninput="heightVal.value = this.value" />
		<output id="heightVal">%2</output>
	</div>`
}

function stringJoin(s: string, r: Array<any>) {
	r.map((v,i)=>{
		s = s.replace('%'+(i+1),v)
	  })
	return s
}

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
			currentMesh = pickResult.pickedMesh;
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
						modalContent.innerHTML = stringJoin(meshContent.Cylinder, [cylinderHeight, cylinderHeight, cylinderDiameter, cylinderDiameter]);
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
	if (currentMesh?.id === "Plane") {
		
	} else if (currentMesh?.id === "IcoSphere") {

	} else if (currentMesh?.id === "Cylinder") {
		cylinderHeight = Number((document.getElementById("height") as HTMLInputElement)?.value) || cylinderHeight;
		cylinderDiameter = Number((document.getElementById("diameter") as HTMLInputElement)?.value) || cylinderDiameter;
		currentMesh.scaling.y = cylinderHeight / 2;
		currentMesh.scaling.x = cylinderDiameter / 1;
		currentMesh.scaling.z = cylinderDiameter / 1;
	}

	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
})