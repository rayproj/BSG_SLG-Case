import { _decorator, Component, find, Node, v3, Vec3 } from 'cc';
import { VecUtils } from './VecUtils';
const { ccclass, property, executeInEditMode } = _decorator;

const t_vec = v3();
const t_vec2 = v3();

@ccclass('Billboard2D')
@executeInEditMode(true)
export class Billboard2D extends Component {
    @property(Node)
    cameraNode: Node = null;
    @property(Node)
    followNode: Node = null;
    @property(Vec3)
    followOffset = v3();

    start() {
        if (this.cameraNode === null) {
            this.cameraNode = find('Main Camera');
        }
    }

    lateUpdate(deltaTime: number) {
        this.syncNode();
    }

    private syncNode() {
        const cameraNode = this.cameraNode;
        if (cameraNode) {
            const cameraWR = cameraNode.worldRotation;
            if (!this.node.worldRotation.equals(cameraWR)) {
                this.node.worldRotation = cameraWR;
            }
        }

        const followNode = this.followNode;
        if (followNode) {
            const followOffset = this.followOffset;
            const tPos = followNode.getWorldPosition(t_vec);
            const mPos = this.node.getWorldPosition(t_vec2);
            mPos.subtract(followOffset);
            if (!VecUtils.equalsVec3(mPos, tPos)) {
                tPos.add(this.followOffset);
                this.node.setWorldPosition(tPos);
            }
        }
    }
}


