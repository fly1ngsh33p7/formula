import { Point3D } from './Point3D.js';

export class Object {
    position;
    vertices;
    faces;

    constructor(position) {
        this.position = position;

        this.vertices = [];
        this.faces = [];
    }

    draw(current_frame_time) {
        throw new Error("draw() method not implemented in subclass");
    }
}