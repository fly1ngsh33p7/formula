import { Point3D } from "./Point3D.js";

export abstract class BaseObject {
    position: Point3D;
    vertices: Point3D[];
    faces: number[][];

    constructor(position: Point3D) {
        this.position = position;
        this.vertices = [];
        this.faces = [];
    }

    abstract draw(currentFrameTime: number): void;
}
