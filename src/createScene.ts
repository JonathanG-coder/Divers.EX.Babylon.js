import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";

// Change this import to check other scenes
import { UI } from "./scenes/UI";
import { Home } from "./scenes/home";
import { TestScene } from "./scenes/testScene";


export interface CreateSceneClass {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>;
    preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
    default: CreateSceneClass;
}

export const getSceneModule = (): CreateSceneClass => {
    return new Home();
}

export const getSceneByNameModule = (sceneName?: string): CreateSceneClass => {
    if (sceneName === "test")
    {
        return new TestScene();
    }

    if (sceneName === 'UI')
    {
        return new UI();
    }

    return new Home();
}
