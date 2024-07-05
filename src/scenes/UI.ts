import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";

import * as GUI from "@babylonjs/gui";

import homeTextureUrl from "../../assets/img/home.png"
import menuTextureUrl from "../../assets/img/menu_WH.png"

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Culling/ray";

export class UI implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a camera (non-mesh)
        const camera = new ArcRotateCamera(
            "my first camera",
            0,
            Math.PI / 3,
            10,
            new Vector3(0, 0, 0),
            scene
        );

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // GUI
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);

        const container = new GUI.Container();
        container.background = '#FFFFFF55';
        container.width = 0.2;
        container.zIndex = 999;

        // Click effect
        container.onPointerDownObservable.add(()=>{
            container.background = '#FFFFFF65';
        });
        container.onPointerUpObservable.add(()=>{
            container.background = '#FFFFFF55';
        });

        container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        container.isPointerBlocker = true;
        container.isVisible = false;

        advancedTexture.addControl(container);

        // Menu toggle
        const menuToggle = GUI.Button.CreateImageOnlyButton('menuToggle', menuTextureUrl)
        menuToggle.width = '30px';
        menuToggle.fixedRatio = 1;
        menuToggle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        menuToggle.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        menuToggle.color = "#00000000";
        if(menuToggle.image)menuToggle.image.alpha = 0.5;
        menuToggle.zIndex = 1000;
        menuToggle.onPointerUpObservable.add(()=>{
            container.isVisible = !container.isVisible;
        })
        advancedTexture.addControl(menuToggle);

        const homeButton = GUI.Button.CreateImageOnlyButton('home', homeTextureUrl)
        homeButton.width = '0.25';
        homeButton.fixedRatio = 1.5;
        homeButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        homeButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        homeButton.paddingTop = 20;
        homeButton.color = "#00000000";
        if(homeButton.image)homeButton.image.alpha = 0.7;
        container.addControl(homeButton);

        const button0 = GUI.Button.CreateSimpleButton('button0', '0')
        button0.cornerRadius = 5;
        button0.width = '0.6';
        button0.height = '40px';
        button0.color = '#00000000';
        button0.background = '#000000AA';
        if(button0.textBlock != undefined)
            button0.textBlock.color = 'white';

        const stackPanel = new GUI.StackPanel();
        stackPanel.spacing = 10;
        stackPanel.addControl(button0);
        container.addControl(stackPanel);

        // Allows loading overlapping scenes
        // so the last scene doesn't erase the previous one(s)
        scene.autoClear = false;

        return scene;
    };
}

export default new UI();
