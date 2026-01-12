import { _decorator, Component, Node, Material, MeshRenderer, Prefab, instantiate } from 'cc';
import { JSB } from 'cc/env';
const { ccclass, property } = _decorator;

let enableOutlinePass = true;
let enablePlanarShadowPass = true;

@ccclass('DynamicPass')
export class DynamicPass extends Component {
    @property(Material)
    testMat: Material = null;
    @property(MeshRenderer)
    testMeshRenderer: MeshRenderer = null;
    @property(Prefab)
    testPrefab: Prefab = null;

    private _newIns: Node = null;

    onDynamicPassClick() {
        // 根据画质设置，运行时动态修改材质Pass数量
        enableOutlinePass = !enableOutlinePass;
        enablePlanarShadowPass = !enablePlanarShadowPass;

        const mat = this.testMat;
        const defines = mat['_defines'];
        // 1. 修改材质宏
        const outlineDefines = defines[1];
        outlineDefines.USE_OUTLINE_PASS = enableOutlinePass;
        const planarShadowDefines = defines[2];
        planarShadowDefines.USE_PLANAR_SHADOW_PASS = enablePlanarShadowPass;
        if (JSB) {
            // FOR JSB
            // 原生平台额外处理逻辑
            // 1. 值为false时删除宏定义
            // 2. 更新后显式设置触发更新
            if (!enableOutlinePass) {
                delete outlineDefines.USE_OUTLINE_PASS;
            }
            if (!enablePlanarShadowPass) {
                delete planarShadowDefines.USE_PLANAR_SHADOW_PASS;
            }
            mat['_defines'] = defines;
        }
        // 2. 销毁已创建Pass
        const passes = mat.passes;
        passes.forEach(pass => {
            pass.destroy();
        })
        // 3. 重新创建Pass
        mat.onLoaded();
        // 4. 为MeshRenderer设置材质，触发Model材质更新
        this.testMeshRenderer.setMaterial(mat, 0);

        // 以下为测试材质更新后，新创建的示例是否生效
        if (this._newIns) {
            this._newIns.destroy();
        }
        const newIns = this._newIns = instantiate(this.testPrefab);
        this.node.parent.addChild(newIns);
        newIns.setPosition(1.5, 0.5, 0);
    }
}