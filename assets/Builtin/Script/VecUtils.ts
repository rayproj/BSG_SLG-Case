import { Vec3 } from "cc";

export class VecUtils {
    public static equalsVec3(a: Vec3, b: Vec3, epsilon = 0.0001) {
        return Math.abs(a.x - b.x) <= epsilon &&
            Math.abs(a.y - b.y) <= epsilon &&
            Math.abs(a.z - b.z) <= epsilon;
    }
}