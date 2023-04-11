import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion, AbstractMesh, Nullable, Mesh  } from 'babylonjs';
import 'babylonjs-loaders';

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);
var currentMesh: Nullable<AbstractMesh>;
var cubeWidth = 1;
var cubeHeight = 1;
var cubeDepth = 1;
var cylinderHeight = 2;
var cylinderDiameter = 1;
var sphereRadius = 1;
var sphereSubDivisions = 4;
var newIcosphere: Mesh;

var modal = document.querySelector(".modal");
var closeButton = document.querySelector(".close-button");
var isModal = false;

function toggleModal() {
	modal?.classList.toggle("show-modal");
	isModal = !isModal;
	console.log(isModal);
}

function windowOnClick(event: any) {
	if (event.target === modal) {
		toggleModal();
	}
}

closeButton?.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

var meshContent = {
	Plane: `
	<div class="modal-title">Customize Cube</div>
	<div class="modal-body">
		<label for="width">Width: </label><br/>
		<input type="range" id="width" value="%1" min="0.1" max="2.0" step="0.1" oninput="widthVal.value = this.value" />
		<output id="widthVal">%2</output><br/>
		<label for="height">Height: </label><br/>
		<input type="range" id="height" value="%3" min="0.1" max="2.0" step="0.1" oninput="heightVal.value = this.value" />
		<output id="heightVal">%4</output><br/>
		<label for="depth">Depth: </label><br/>
		<input type="range" id="depth" value="%5" min="0.1" max="2.0" step="0.1" oninput="depthVal.value = this.value" />
		<output id="depthVal">%6</output>
	</div>`,
	IcoSphere: `
	<div class="modal-title">Customize Sphere</div>
	<div class="modal-body">
		<label for="radius">Radius: </label><br/>
		<input type="range" id="radius" value="%1" min="0.1" max="2.0" step="0.1" oninput="radiusVal.value = this.value" />
		<output id="radiusVal">%2</output><br/>
		<label for="subDivisions">SubDivisions: </label><br/>
		<input type="range" id="subDivisions" value="%3" min="1" max="10" step="1" oninput="subDivisionsVal.value = this.value" />
		<output id="subDivisionsVal">%4</output>
	</div>`,
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
			isModal = true;
			var modalContent = document.getElementById("modal-iframe");
			if (modalContent) {
				switch(currentMesh?.id) {
					case "Plane":
						modalContent.innerHTML = stringJoin(meshContent.Plane, [cubeWidth, cubeWidth, cubeHeight, cubeHeight, cubeDepth, cubeDepth]);
						return;
					case "IcoSphere":
						modalContent.innerHTML = stringJoin(meshContent.IcoSphere, [sphereRadius, sphereRadius, sphereSubDivisions, sphereSubDivisions]);
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
	if (isModal) {
		if (currentMesh?.id === "Plane") {
			cubeWidth = Number((document.getElementById("width") as HTMLInputElement)?.value) || cubeWidth;
			cubeHeight = Number((document.getElementById("height") as HTMLInputElement)?.value) || cubeHeight;
			cubeDepth = Number((document.getElementById("depth") as HTMLInputElement)?.value) || cubeDepth;
			currentMesh.scaling.y = cubeHeight / 1;
			currentMesh.scaling.x = cubeWidth / 1;
			currentMesh.scaling.z = cubeDepth / 1;
		} else if (currentMesh?.id === "IcoSphere") {
			sphereRadius = Number((document.getElementById("radius") as HTMLInputElement)?.value) || sphereRadius;
			sphereSubDivisions = Number((document.getElementById("subDivisions") as HTMLInputElement)?.value) || sphereSubDivisions;
			scene.removeMesh(newIcosphere || currentMesh);
			newIcosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {radius: sphereRadius, subdivisions: sphereSubDivisions}, scene);
			newIcosphere.position.set(-2, 0, 0);
		} else if (currentMesh?.id === "Cylinder") {
			cylinderHeight = Number((document.getElementById("height") as HTMLInputElement)?.value) || cylinderHeight;
			cylinderDiameter = Number((document.getElementById("diameter") as HTMLInputElement)?.value) || cylinderDiameter;
			currentMesh.scaling.y = cylinderHeight / 2;
			currentMesh.scaling.x = cylinderDiameter / 1;
			currentMesh.scaling.z = cylinderDiameter / 1;
		}
	}

	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
})