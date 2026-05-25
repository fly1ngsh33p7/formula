import Point3D from "./Point3D.js";

export default abstract class BaseObject {
    position: Point3D;
    vertices: Point3D[];
    faces: number[][];

    constructor(position: Point3D) {
        this.position = position;
        this.vertices = [];
        this.faces = [];
    }

    move(xOffset: number, yOffset: number, zOffset: number): void {
        console.log("moving BaseObject", { xOffset, yOffset, zOffset });

        this.position = this.position.translate_point_in_x_axis(xOffset);
        this.position = this.position.translate_point_in_y_axis(yOffset);
        this.position = this.position.translate_point_in_z_axis(zOffset);
    }

    abstract draw(currentFrameTime: number): void;
}
