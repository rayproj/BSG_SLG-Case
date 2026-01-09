import { _decorator, Component, Node, CCObject, director } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('N_TranslateByCameraDir')
@executeInEditMode
export class N_TranslateByCameraDir extends Component {
    onLoad() {
        this._objFlags |= CCObject.Flags.DontSave;
    }

    onEnable() {
        // 根据正交相机视线方向移动节点，用于构建不同层级的场景，每个层级的坐标系在视角上是一致的
        // 比如SLG世界场景分3层，上中下，每层的0,0坐标位置在视角里应该重合
        // 此脚本会根据设置的Y值，执行相应的移动
        let cameraNode: Node;
        director.getScene().renderScene.cameras.forEach(camera => {
            if (!cameraNode && camera.visibility & this.node.layer) {
                cameraNode = camera.node;
            }
        })
        const forward = cameraNode.forward;
        console.log(forward)
        const currentY = this.node.position.y;
        const scale = currentY / forward.y;
        this.node.setPosition(forward.multiplyScalar(scale));
    }
}