import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { CreateSceneClass } from "../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Color3 } from "@babylonjs/core/Maths";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { AbstractMesh } from "@babylonjs/core";

import * as earcut from "earcut";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Animations/animatable"
import "@babylonjs/core/Helpers/sceneHelpers";

// Assets
import toolboxModel from "../../assets/glb/toolbox_centered.glb";

export class Home implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        /////////
        // CAMERA
        /////////
        const cameraRadius: number = 10;
        const camera = new ArcRotateCamera(
            "arcRotateCamera",
            0,
            Math.PI/2.6,
            cameraRadius,
            new Vector3(0, 1, 0),
            scene
        );

        camera.minZ = 0.1;
        camera.wheelDeltaPercentage = 0.01;
        camera.upperRadiusLimit = cameraRadius;
        camera.lowerRadiusLimit = cameraRadius;
        camera.panningSensibility = 0;
        camera.target = new Vector3(0,2,0);
        
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        // Automatically position an ArcRotateCamera when its target is set to a mesh
        camera.useFramingBehavior = true
        
        /////////
        // LIGHTS
        /////////
        //Directional light               
        const dlightPosition = new Vector3(0.02, -0.05, -0.05);
        const dLightOrientation = new Vector3(0, 20, 0);
        const dLight = new DirectionalLight(
            "dLight",
            dlightPosition,
            scene
        );
        dLight.intensity = 0.5;
        dLight.position.y = 10;

        //Directional light orientation
        dLight.position = dLightOrientation;

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const hLight = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        hLight.intensity = 0.7;
    
        /////////
        // ENV
        /////////        
        const env = scene.createDefaultEnvironment({
            createSkybox: true,
            skyboxSize: 150,
            skyboxColor: new Color3(0.01,0.01,0.01),
            createGround: true,
            groundSize: 100,
            groundColor: new Color3(0.1,0.1,0.1),
            enableGroundShadow: true,
            groundYBias: 0,
        });

        //////////////
        // SCENE ELEMS
        //////////////
        //Create PBR material
        const pbr = new PBRMaterial("pbr", scene);
        pbr.metallic = 1.0;
        pbr.roughness = 0.15;
        pbr.albedoColor = new Color3(0.3, 0.3, 0.8);  

        const importResult = await SceneLoader.ImportMeshAsync(
            "",
            "",
            toolboxModel,
            scene,
            undefined,
            ".glb"
        );

        const model: AbstractMesh = importResult.meshes[0];
        // just scale it so we can see it better
        model.scaling.scaleInPlace(7);
        model.position = new Vector3(model.position.x, model.position.y, model.position.z+0.2);

        // 3DText
        const fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Bold.json")).json();
        const myText = MeshBuilder.CreateText("myText", "Welcome to\n Toolbox 3D", fontData, {
            size: 0.5,
            resolution: 32, 
            depth: 0.1
        }, scene, earcut);

        if (myText){
            myText.position = new Vector3(0,3,0);
            myText.scaling = new Vector3(-1,1,1);
            myText.material = pbr;
        }

        //////////
        // SHADOWS
        //////////        
        const shadowGenerator = new ShadowGenerator(512, dLight)
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurScale = 2;
        shadowGenerator.setDarkness(0.2);
        
        shadowGenerator.addShadowCaster(model, true)

        scene.registerBeforeRender(() => {
            //Slowly rotate camera
            camera.alpha += (0.00005 * scene.getEngine().getDeltaTime());
            if(myText) myText.lookAt(camera.position);
        });

        return scene;
    };
}

export default new Home();
