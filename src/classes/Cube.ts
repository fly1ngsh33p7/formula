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
            // draw edge
            for (let face_index = 0; face_index < face.length; face_index++) {
                const vertexA = this.vertices[face[face_index]];
                const vertexB = this.vertices[face[(face_index + 1) % face.length]]; // wrap around last to first vertex

                // only draw edge if (FIXME:) one of the vertices is visible // FIXME: this should be moved to BaseObject! (maybe a draw_face/draw_edge/draw_line functionality)
                if (vertexA.is_visible() && vertexB.is_visible()) { // this SHOULD be '||', but "the formula" - I think - causes weird stuff to happen when flipping from z:+0.001 to z:-0.001 (I think it's "wrapping around", because of the division in "the formula")
                    instructions.push({
                        kind: "line",
                        start: vertexA,
                        end: vertexB,
                        thickness: 1,
                        special: false,
                    });
                }
            }
        }

        return instructions;
    }
}
