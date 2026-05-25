import { Point2D } from './classes/Point2D.js';
import { Point3D } from './classes/Point3D.js';
import { Cube } from './classes/Cube.js';
import { BACKGROUND_COLOR, FOREGROUND_COLOR, LINE_COLOR, SPECIAL_COLOR, FPS } from './utils/constants.js';
import { clear, place_point, get_on_screen_point_representation } from './classes/common_stuff_that_needs_to_be_accessible_somewhere_else.js';

const game = document.getElementById("game");
if (!game) {
    throw new Error("Canvas with id 'game' not found");
}
const context = game.getContext("2d");
if (!context) {
    throw new Error("Could not get 2D context");
}


function place_axis_lines(context) {
    // x axis
    place_point(get_on_screen_point_representation(new Point2D(-1, 0), game.width, game.height), false, {x: game.width, y: 2}, context);
    place_point(get_on_screen_point_representation(new Point2D(1, 0), game.width, game.height), false, {x: game.width, y: 2}, context);
    // y axis
    place_point(get_on_screen_point_representation(new Point2D(0, -1), game.width, game.height), false, {x: 2, y: game.height}, context);
    place_point(get_on_screen_point_representation(new Point2D(0, 1), game.width, game.height), false, {x: 2, y: game.height}, context);
}

// game.width = window.innerWidth - 10;
// game.height = window.innerHeight - 10;

console.log(game);
console.log(context);

console.log(`Game size: ${game.width}x${game.height}`);

clear(context);


let cube_vertices = [
    // first "plane"
    new Point3D(0.25, 0.25, 0.25),  // vertex index 0
    new Point3D(-0.25, 0.25, 0.25), // vertex index 1
    new Point3D(-0.25, -0.25, 0.25), // vertex index 2
    new Point3D(0.25, -0.25, 0.25),// vertex index 3

    // second "plane"
    new Point3D(0.25, 0.25, -0.25),   // vertex index 4
    new Point3D(-0.25, 0.25, -0.25),  // vertex index 5
    new Point3D(-0.25, -0.25, -0.25),  // vertex index 6
    new Point3D(0.25, -0.25, -0.25), // vertex index 7
]

let faces = [ // indices of vertices that make up each face
    [0, 1, 2, 3], // front face
    [4, 5, 6, 7], // back face
    // connect pairs of vertices from front and back faces, making the side faces
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

let z_offset = 1;
let rotation_angle = 0;

let cube = new Cube(new Point3D(0.25, 0, 0.5), 0.2, game, context);

let current_frame = 0;

function draw_frame() {
    clear(context);
    // place_axis_lines(context);

    let delta_time = 1 / FPS; // in seconds

    // animate z_offset and rotation
    rotation_angle += Math.PI * delta_time; // 1 full rotation per second
    
    // z_offset += 1 * delta_time; // move 1 unit per second

    cube.draw(current_frame * delta_time);
    

    // // draw cube corner points
    // for (const vertex of cube_vertices) {
    //     place_point(get_on_screen_point_representation(vertex.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d(), game.width, game.height), false, {x: 10, y: 10}, context);
    // }

    // for (const face of faces) {
    //     for (let i = 0; i < face.length; i++) {
    //         let vertex_a = cube_vertices[face[i]];
    //         let vertex_b = cube_vertices[face[(i + 1) % face.length]]; // wrap around last to first vertex

    //         place_line(
    //             get_on_screen_point_representation(vertex_a.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d(), game.width, game.height),
    //             get_on_screen_point_representation(vertex_b.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d(), game.width, game.height),
    //             context,
    //         );
    //     }
    // }
    
    current_frame++;
    setTimeout(draw_frame, 1000 / FPS); // reschedule next frame
}

// start the drawing loop
setTimeout(draw_frame, 1000 / FPS); // 1000ms divided by FPS gives the interval in ms
