import Point3D from "./Point3D.js";
import BaseObject, { DrawInstruction } from "./BaseObject.js";

export default class Cube extends BaseObject {
    side_length: number;

    constructor(
        position: Point3D,
        side_length: number,
    ) {
        super(position);
        this.side_length = side_length;

        this.vertices = [
            // first, upper "plane"
            new Point3D(// vertex index 0 "++"
                position.x + this.side_length / 2,
                position.y + this.side_length / 2,
                position.z + this.side_length / 2,
            ), 
            new Point3D(// vertex index 1 "-+"
                position.x - this.side_length / 2,
                position.y + this.side_length / 2,
                position.z + this.side_length / 2,
            ), 
            new Point3D(// vertex index 2 "--"
                position.x - this.side_length / 2,
                position.y - this.side_length / 2,
                position.z + this.side_length / 2,
            ), 
            new Point3D(// vertex index 3 "+-"
                position.x + this.side_length / 2,
                position.y - this.side_length / 2,
                position.z + this.side_length / 2,
            ), 

            // second, lower "plane"
            new Point3D(// vertex index 4 "++"
                position.x + this.side_length / 2,
                position.y + this.side_length / 2,
                position.z - this.side_length / 2,
            ), 
            new Point3D(// vertex index 5 "-+"
                position.x - this.side_length / 2,
                position.y + this.side_length / 2,
                position.z - this.side_length / 2,
            ), 
            new Point3D(// vertex index 6 "--"
                position.x - this.side_length / 2,
                position.y - this.side_length / 2,
                position.z - this.side_length / 2,
            ), 
            new Point3D(// vertex index 7 "+-"
                position.x + this.side_length / 2,
                position.y - this.side_length / 2,
                position.z - this.side_length / 2,
            ), 
        ];

        this.faces = [
            // indices of vertices that make up each face, the order matters for drawing lines!
            [0, 1, 2, 3], // front face
            [4, 5, 6, 7], // back face
            // connect pairs of vertices from front and back faces, making the side faces
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
        ];
    }

    protected get_object_specific_draw_instructions(
        currentFrameTime: number,
    ): DrawInstruction[] {
        void currentFrameTime;

        const instructions: DrawInstruction[] = [];

        for (const face of this.faces) {
            for (let index = 0; index < face.length; index += 1) {
                const vertexA = this.vertices[face[index]];
                const vertexB = this.vertices[face[(index + 1) % face.length]]; // wrap around last to first vertex

                instructions.push({
                    kind: "line",
                    start: vertexA,
                    end: vertexB,
                    thickness: 1,
                    special: false,
                });
            }
        }

        return instructions;
    }
}
