import { Point3D } from './Point3D.js';
import { BaseObject } from './BaseObject.js';
import { place_point, get_on_screen_point_representation, place_line } from './common_stuff_that_needs_to_be_accessible_somewhere_else.js';

export class Cube extends BaseObject {
    constructor(position, side_length, game_reference, context_reference) {
        super(position);
        this.game_reference = game_reference;
        this.context_reference = context_reference;
        
        if(context_reference === undefined || game_reference === undefined) {
            throw new Error("Cube constructor requires game_reference and context_reference");
        } else {
            // console.log(context_reference);
            // console.log(game_reference);
        }
            
        this.side_length = side_length;

        this.vertices = [
            // first, upper "plane"
            new Point3D(position.x + this.side_length/2, position.y + this.side_length/2, position.z + this.side_length/2), // vertex index 0 "++"
            new Point3D(position.x - this.side_length/2, position.y + this.side_length/2, position.z + this.side_length/2), // vertex index 1 "-+"
            new Point3D(position.x - this.side_length/2, position.y - this.side_length/2, position.z + this.side_length/2), // vertex index 2 "--"
            new Point3D(position.x + this.side_length/2, position.y - this.side_length/2, position.z + this.side_length/2), // vertex index 3 "+-"
        
            // second, lower "plane"
            new Point3D(position.x + this.side_length/2, position.y + this.side_length/2, position.z - this.side_length/2), // vertex index 4 "++"
            new Point3D(position.x - this.side_length/2, position.y + this.side_length/2, position.z - this.side_length/2), // vertex index 5 "-+"
            new Point3D(position.x - this.side_length/2, position.y - this.side_length/2, position.z - this.side_length/2), // vertex index 6 "--"
            new Point3D(position.x + this.side_length/2, position.y - this.side_length/2, position.z - this.side_length/2), // vertex index 7 "+-"
        ]
        
        this.faces = [ // indices of vertices that make up each face, the order matters for drawing lines!
            [0, 1, 2, 3], // front face
            [4, 5, 6, 7], // back face
            // connect pairs of vertices from front and back faces, making the side faces
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
        ]
    }

    draw(current_frame_time) {
        // draw cube corner points
        for (const vertex of this.vertices) {
            place_point(
                get_on_screen_point_representation(vertex.project_to_2d(), this.game_reference.width, this.game_reference.height),
                false,
                { x: 10, y: 10 },
                this.context_reference,
            );
        }

        // draw lines between vertices to create faces
        for (const face of this.faces) {
            for (let i = 0; i < face.length; i++) {
                const vertex_a = this.vertices[face[i]];
                const vertex_b = this.vertices[face[(i + 1) % face.length]]; // wrap around last to first vertex

                place_line(
                    get_on_screen_point_representation(vertex_a.project_to_2d(), this.game_reference.width, this.game_reference.height),
                    get_on_screen_point_representation(vertex_b.project_to_2d(), this.game_reference.width, this.game_reference.height),
                    1,
                    false,
                    this.context_reference,
                );
            }
        }
    }
}