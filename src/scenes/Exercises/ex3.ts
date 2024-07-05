/*
 * STACK GEN AND SORT
 */

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import {
   AdvancedDynamicTexture,
   Button,
   Control,
   StackPanel,
   TextBlock,
} from "@babylonjs/gui";
import { CreateBox, Mesh } from "@babylonjs/core";

export class Ex3 implements CreateSceneClass {
   createScene = async (
      engine: Engine,
      canvas: HTMLCanvasElement
   ): Promise<Scene> => {
      // This creates a basic Babylon Scene object (non-mesh)
      const scene = new Scene(engine);

      // This creates and positions a free camera (non-mesh)
      const cameraRadius: number = 15;
      const camera = new ArcRotateCamera(
         "arcRotateCamera",
         Math.PI / 2.5,
         Math.PI / 2.1,
         cameraRadius,
         new Vector3(0, 1, 0),
         scene
      );

      camera.minZ = 0.1;
      camera.wheelDeltaPercentage = 0.01;
      camera.upperRadiusLimit = cameraRadius;
      camera.lowerRadiusLimit = cameraRadius;
      camera.panningSensibility = 0;

      // This targets the camera to scene origin
      camera.setTarget(Vector3.Zero());

      // This attaches the camera to the canvas
      camera.attachControl(canvas, true);

      /**************************** */
      const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

      // INSTRUCTIONS
      const userInstructions = new TextBlock();
      userInstructions.text = `STACK GEN AND SORT
            Use the buttons to generate a stack of random cubes
            and to sort them from the biggest (bottom) to the smallest (top)`;
      userInstructions.color = "white";
      userInstructions.fontSize = 20;
      userInstructions.top = "30%";
      advancedTexture.addControl(userInstructions);

      // BUTTONS
      const generateButton = Button.CreateSimpleButton(
         "generateButton",
         "GENERATE"
      );
      const sortButton = Button.CreateSimpleButton("sortButton", "SORT");

      generateButton.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      generateButton.cornerRadius = 10;
      generateButton.width = "200px";
      generateButton.height = "50px";
      generateButton.color = "white";
      generateButton.background = "#AA7777";
      if (generateButton.textBlock != undefined)
         generateButton.textBlock.color = "white";

      sortButton.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      sortButton.cornerRadius = 10;
      sortButton.width = "200px";
      sortButton.height = "50px";
      sortButton.color = "white";
      sortButton.background = "#7777AA";
      if (sortButton.textBlock != undefined)
         sortButton.textBlock.color = "white";

      const stackPanel = new StackPanel();
      stackPanel.isVertical = false;
      stackPanel.spacing = 50;
      stackPanel.top = "15%";
      stackPanel.addControl(generateButton);
      stackPanel.addControl(sortButton);
      stackPanel.zIndex = 1000;
      advancedTexture.addControl(stackPanel);

      // //TODO: Do something when buttons are pressed
      // generateButton.onPointerUpObservable.add(()=>{
      //     const box = CreateBox('box',
      //         {
      //             size: 1,
      //             width: 2,
      //             height: 0.5,
      //         }, scene
      //     );

      //     const box0 = box.createInstance("box0");
      //     box0.position = new Vector3(0,1,0);
      //     box0.scaling = new Vector3(1.5,1.5,1.5);
      // });

      /************************ */
      // STACK GEN AND SORT

      const boxContainer: Mesh[] = [];
      function generateAndShuffleBoxes(num: number, scene: Scene): void {
         for (let i = 0; i < num; i++) {
            const newBox = CreateBox(
               `box-${i}`,
               {
                  size: 0.5 + i,
                  width: 0.5 + i,
                  height: 0.5,
               },
               scene
            );
            newBox.position = new Vector3(0, i, 0);

            boxContainer.push(newBox);
         }

         shuffleBoxes();
      }

      function shuffleBoxes(): void {
         boxContainer.sort(() => Math.random() - 0.5);
         boxContainer.forEach((box, index) => {
            box.position.y = index;
         });
      }

      function clearBoxes(): void {
         if (boxContainer.length === 0) return;
         boxContainer.forEach((box) => box.dispose());
         boxContainer.length = 0;
      }

      function sortBoxesByWidth(): void {
         boxContainer.sort((a, b) => {
            const widthA = a.scaling._x;
            const widthB = b.scaling._x;
            return widthA - widthB;
         });
      }

      function sortArray(array: Mesh[]): void {
         array.sort((a, b) => {
            const itemIdA = parseInt(a.id.split("-", 2)[1]);
            const itemIdB = parseInt(b.id.split("-", 2)[1]);
            return itemIdB - itemIdA;
         });

         array.forEach((mesh, index) => {
            mesh.position.y = index;
         });
      }

      generateButton.onPointerUpObservable.add(() => {
         clearBoxes();
         const numberOfBoxes = 5;
         generateAndShuffleBoxes(numberOfBoxes, scene);
      });

      sortButton.onPointerUpObservable.add(() => {
         sortBoxesByWidth();
         sortArray(boxContainer);
      });

      /**************************** */

      /////////
      // ENV
      /////////
      //Directional light
      const dlightPosition = new Vector3(0.02, -0.05, -0.05);
      const dLightOrientation = new Vector3(0, 20, 0);
      const dLight = new DirectionalLight("dLight", dlightPosition, scene);
      dLight.intensity = 0.2;
      dLight.position.y = 10;

      //Directional light orientation
      dLight.position = dLightOrientation;

      // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
      const hLight = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // Default intensity is 1. Let's dim the light a small amount
      hLight.intensity = 0.7;

      const env = scene.createDefaultEnvironment({
         createSkybox: true,
         skyboxSize: 150,
         skyboxColor: new Color3(0.01, 0.01, 0.01),
         createGround: false,
      });

      return scene;
   };
}

export default new Ex3();
