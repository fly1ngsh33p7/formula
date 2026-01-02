import { Point3D } from './Point3D.js';

export class Cube extends Object {
    constructor(position, side_length) {
        super(position);
        this.side_length = side_length;

        this.vertices = [
            // first, upper "plane"
            new Point3D(this.position.x + this.side_length/2, this.position.y + this.side_length/2, this.position.z + this.side_length/2), // vertex index 0 "++"
            new Point3D(this.position.x - this.side_length/2, this.position.y + this.side_length/2, this.position.z + this.side_length/2), // vertex index 1 "-+"
            new Point3D(this.position.x - this.side_length/2, this.position.y - this.side_length/2, this.position.z + this.side_length/2), // vertex index 2 "--"
            new Point3D(this.position.x + this.side_length/2, this.position.y - this.side_length/2, this.position.z + this.side_length/2), // vertex index 3 "+-"
        
            // second, lower "plane"
            new Point3D(this.position.x + this.side_length/2, this.position.y + this.side_length/2, this.position.z - this.side_length/2), // vertex index 4 "++"
            new Point3D(this.position.x - this.side_length/2, this.position.y + this.side_length/2, this.position.z - this.side_length/2), // vertex index 5 "-+"
            new Point3D(this.position.x - this.side_length/2, this.position.y - this.side_length/2, this.position.z - this.side_length/2), // vertex index 6 "--"
            new Point3D(this.position.x + this.side_length/2, this.position.y - this.side_length/2, this.position.z - this.side_length/2), // vertex index 7 "+-"
        ]
        
        this.faces = [ // indices of vertices that make up each face, the order matters for drawing lines!
            [0, 1, 2, 3], // front face
            [4, 5, 6, 7], // back face
            // connect pairs of vertices from front and back faces, making the side faces
            // [0, 4],
            // [1, 5],
            // [2, 6],
            // [3, 7],
        ]
    }

    draw() {
        // draw cube corner points
        for (const vertex of this.vertices) {
            place_point(get_on_screen_point_representation(vertex.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()));
        }

        // draw lines between vertices to create faces
        for (const face of this.faces) {
            for (let i = 0; i < face.length; i++) {
                let vertex_a = this.vertices[face[i]];
                let vertex_b = this.vertices[face[(i + 1) % face.length]]; // wrap around last to first vertex

                place_line(
                    get_on_screen_point_representation(vertex_a.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()),
                    get_on_screen_point_representation(vertex_b.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()),
                );
            }
        }
    }
}