import { Point3D } from "./Point3D.js";
import { BaseObject } from "./BaseObject.js";
import {
    place_point,
    get_on_screen_point_representation,
    place_line,
} from "./common_stuff_that_needs_to_be_accessible_somewhere_else.js";

export class Cube extends BaseObject {
    game_reference: HTMLCanvasElement;
    context_reference: CanvasRenderingContext2D;
    side_length: number;

    constructor(
        position: Point3D,
        side_length: number,
        game_reference: HTMLCanvasElement,
        context_reference: CanvasRenderingContext2D,
    ) {
        super(position);
        this.game_reference = game_reference;
        this.context_reference = context_reference;
        this.side_length = side_length;


        if(context_reference === undefined || game_reference === undefined) {
            throw new Error("Cube constructor requires game_reference and context_reference");
        } else {
            // console.log(context_reference);
            // console.log(game_reference);
        }

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

    draw(currentFrameTime: number): void {
        // draw cube corner points
        void currentFrameTime;

        // draw lines between vertices to create faces
        for (const vertex of this.vertices) {
            place_point(
                get_on_screen_point_representation(
                    vertex.project_to_2d(),
                    this.game_reference.width,
                    this.game_reference.height,
                ),
                false,
                { x: 10, y: 10 },
                this.context_reference,
            );
        }

        // draw lines between vertices to create faces
        for (const face of this.faces) {
            for (let index = 0; index < face.length; index += 1) {
                const vertexA = this.vertices[face[index]];
                const vertexB = this.vertices[face[(index + 1) % face.length]]; // wrap around last to first vertex

                place_line(
                    get_on_screen_point_representation(
                        vertexA.project_to_2d(),
                        this.game_reference.width,
                        this.game_reference.height,
                    ),
                    get_on_screen_point_representation(
                        vertexB.project_to_2d(),
                        this.game_reference.width,
                        this.game_reference.height,
                    ),
                    1,
                    false,
                    this.context_reference,
                );
            }
        }
    }
}
