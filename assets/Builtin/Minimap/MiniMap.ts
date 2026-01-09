import { _decorator, Camera, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

function savePixelDataAsImage(pixelData: Uint8Array, width: number, height: number, fileName: string) {
    // 创建原始 Canvas（绘制像素数据）
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    // 将像素数据绘制到原始 Canvas
    const imageData = new ImageData(new Uint8ClampedArray(pixelData), width, height);
    tempCtx.putImageData(imageData, 0, 0);

    // 创建最终 Canvas（翻转绘制）
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 翻转 Canvas 并绘制原始图像
    ctx.translate(0, height); // 将原点移到底部
    ctx.scale(1, -1);         // 垂直翻转
    ctx.drawImage(tempCanvas, 0, 0); // 绘制原始 Canvas

    // 将 Canvas 转换为图片数据
    canvas.toBlob((blob) => {
        // 创建一个临时的 <a> 元素用于下载图片
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName || 'flipped_image.png';

        // 触发下载
        link.click();

        // 释放 URL 对象
        URL.revokeObjectURL(link.href);
    }, 'image/png');
}


@ccclass('MiniMap')
export class MiniMap extends Component {
    start() {
        const rt = this.getComponent(Camera).targetTexture;

        this.scheduleOnce(() => {
            const buffer = rt.readPixels();
            savePixelDataAsImage(buffer, rt.width, rt.height, 'minimap.png')
        }, 1)
    }
}