import { _decorator, Component, Node, CCObject } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('N_LogDir')
@executeInEditMode
export class N_LogDir extends Component {
    onLoad() {
        this._objFlags |= CCObject.Flags.DontSave;
    }
    onEnable() {
        // 打印节点的 forward
        console.log(`[N_LogDir] ${this.node.name}: ${JSON.stringify(this.node.forward)}`);
    }
}