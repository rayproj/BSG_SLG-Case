import { _decorator, Component, director, Node, Root, SphereLight, v3 } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('GlobalSphereLight')
@executeInEditMode(true)
export class GlobalSphereLight extends Component {
    private _sphereLight: SphereLight = null;
    private t_vec = v3();
    private _root: Root = null;

    protected onLoad(): void {
        this._sphereLight = this.getComponent(SphereLight);
        this._root = director.root;
    }

    protected onDisable(): void {
       this._root.setShaderGlobal(1, 0, 0, 0);
    }

    update(deltaTime: number) {
        const pos = this.node.getPosition(this.t_vec);
        const lit = this._sphereLight;
        const color = lit.color;
        this._root.setShaderGlobal(0, pos.x, pos.y, pos.z, lit.range);
        this._root.setShaderGlobal(1, color.r / 255, color.g / 255, color.b / 255);
    }
}


