import { _decorator, Camera, Color, Component, director, gfx, Layers, Node, RenderTexture, CCObject, renderer, Rect } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('DepthCamera')
@executeInEditMode
export class DepthCamera extends Component {
    @property(RenderTexture)
    depthTexture: RenderTexture = null;

    onLoad() {
        if (EDITOR) {
            this.scheduleOnce(() => {
                // 编辑器中场景相机
                let editorCamera: renderer.scene.Camera;
                const cameras = director.getScene().renderScene.cameras;
                for (let g = cameras.length - 1; g >= 0; g--) {
                    const c = cameras[g];
                    if (c.visibility & this.node.layer) {
                        // 取消 Depth Layer的渲染
                        c.visibility &= ~Layers.Enum['Depth'];
                        
                        editorCamera = c;
                        break;
                    }
                }
                this.createDepthCamera(editorCamera);
            })
        } else {
            this.createDepthCamera();
        }
    }

    private createDepthCamera(camera?: renderer.scene.Camera) {
        let parentNode: Node;
        if (camera) {
            parentNode = camera.node;
        } else {
            parentNode = this.node;
            camera = this.getComponent(Camera).camera;
        }

        const depthCameraNode = new Node('DepthCamera');
        const flags = CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
        depthCameraNode._objFlags |= flags;
        parentNode.addChild(depthCameraNode);
        const depthCamera = depthCameraNode.addComponent(Camera);

        // set
        depthCamera.priority = camera.priority - 1;
        depthCamera.visibility = Layers.Enum['Depth'];
        depthCamera.clearFlags = gfx.ClearFlagBit.ALL;

        const depthTexture = this.depthTexture;
        const scale = 1;
        depthTexture.resize(camera.width * scale, camera.height * scale);
        depthCamera.targetTexture = depthTexture;

        const dCamera = depthCamera.camera;
        dCamera.clearColor = Color.WHITE;
        dCamera.clearDepth = camera.clearDepth;
        dCamera.clearStencil = camera.clearStencil;
        dCamera.projectionType = camera.projectionType;
        dCamera.fovAxis = camera.fovAxis;
        dCamera.fov = camera.fov;
        dCamera.nearClip = camera.nearClip;
        dCamera.farClip = camera.farClip;
        dCamera.aperture = camera.aperture;
        dCamera.shutter = camera.shutter;
        dCamera.iso = camera.iso;
        depthCamera.rect = new Rect(0, 0, 1, 1);
    }
}


