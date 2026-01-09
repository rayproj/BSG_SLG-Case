import { _decorator, Camera, Component, find, Node, NodeEventType, TransformBit, v3, Vec3 } from 'cc';
import { VecUtils } from './VecUtils';
const { ccclass, property } = _decorator;

const t_vec = v3();
const t_vec2 = v3();

@ccclass('UIFollow3D')
export class UIFollow3D extends Component {
    @property(Camera)
    camera: Camera = null;
    @property(Node)
    followNode: Node = null;
    @property(Vec3)
    followOffset = v3();

    private _currPos = v3();
    private _currCameraPos = v3();
    private _currCameraFov = 0;

    private _forceSync = false;

    protected onEnable(): void {
        this._forceSync = true;
    }

    start() {
        if (this.camera === null) {
            const cameraNode = find('Main Camera');
            if (cameraNode) {
                const camera = this.camera = cameraNode.getComponent(Camera);
                cameraNode.getWorldPosition(this._currCameraPos);
                this._currCameraFov = camera.fov;
                // force sync
                this._currCameraPos.x -= 100;
            }
        }
    }

    protected lateUpdate(dt: number): void {
        if (this._forceSync) {
            this._forceSync = false;
            this.syncFollow(true);
        } else {
            this.syncFollow(false);
        }
    }

    private syncFollow(sync: boolean) {
        const followNode = this.followNode, camera = this.camera;
        if (followNode && camera) {
            const tPos = followNode.getWorldPosition(t_vec);
            const cPos = camera.node.getWorldPosition(t_vec2)
            const cFov = camera.fov;

            if (!VecUtils.equalsVec3(this._currCameraPos, cPos)) {
                this._forceSync = true;
            } else if (this._currCameraFov !== cFov) {
                this._forceSync = true;
            }
            if (!sync) {
                if (!VecUtils.equalsVec3(this._currPos, tPos)) {
                    sync = true;
                }
            }
            if (sync) {
                this._currPos.set(tPos);
                this._currCameraPos.set(cPos);
                this._currCameraFov = cFov;

                camera.convertToUINode(tPos, this.node.parent, t_vec);
                t_vec.z = 0;
                this.node.setPosition(t_vec);
            }
        }
    }
}


