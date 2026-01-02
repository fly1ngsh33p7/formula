import { Point2D } from './classes/Point2D.js';
import { Point3D } from './classes/Point3D.js';
import { Cube } from './classes/Cube.js';
import { BACKGROUND_COLOR, FOREGROUND_COLOR, LINE_COLOR, SPECIAL_COLOR, FPS } from './utils/constants.js';

function get_on_screen_point_representation(p) {
    // because of "the formula" we need to translate from -1..1 to 0..width/height
    // if we add 1 (to -1..1) we get 0..2, which is easier to convert (so -1..1 => 0..2 => 0..width/height)
    // we need to normalize it so we can just multiply it by the screen size ( -1..1 => 0..2 => 0..1 => 0..width/height)
    return new Point2D(
        (p.x + 1)/2 * game.width,
        (1 - (p.y + 1)/2) * game.height, // y is inverted on screen so that negative is down
    );
}

function clear() {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, game.width, game.height);
}

function place_point(p, special = false, point_size = {x: 10, y: 10}, dont_add_to_placed_points = false) {
    context.fillStyle = special ? SPECIAL_COLOR : FOREGROUND_COLOR;
    // account for point size so it's centered
    context.fillRect(
        (p.x - point_size.x / 2),
        (p.y - point_size.y / 2),
        point_size.x,
        point_size.y,
    );

    // add to placed points
    if (!dont_add_to_placed_points) {
        points_that_have_been_placed.push({point: p, point_size: point_size, color: context.fillStyle});
    }
}

function place_line(point1, point2, line_thickness = 1, special = false) {
    context.beginPath(); // "initialize Turtle"
    
    context.moveTo(point1.x, point1.y); // move Turtle to start point
    context.lineTo(point2.x, point2.y); // draw line to end point

    // set line style
    context.lineWidth = line_thickness;
    context.strokeStyle = special ? SPECIAL_COLOR : LINE_COLOR;
    
    context.stroke(); // actually draw the line
}

function place_axis_lines() {
    // x axis
    place_point(get_on_screen_point_representation(new Point2D(-1, 0)), false, {x: game.width, y: 2}, true);
    place_point(get_on_screen_point_representation(new Point2D(1, 0)), false, {x: game.width, y: 2}, true);
    // y axis
    place_point(get_on_screen_point_representation(new Point2D(0, -1)), false, {x: 2, y: game.height}, true);
    place_point(get_on_screen_point_representation(new Point2D(0, 1)), false, {x: 2, y: game.height}, true);
}


// game.width = window.innerWidth - 10;
// game.height = window.innerHeight - 10;

let context = game.getContext("2d")// as CanvasRenderingContext2D;

console.log(game);
console.log(context);

console.log(`Game size: ${game.width}x${game.height}`);

clear();


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

let cube = new Cube(new Point3D(0, 0, 3), 0.25);

function draw_frame() {
    clear();
    place_axis_lines();

    let delta_time = 1 / FPS; // in seconds

    // animate z_offset and rotation
    rotation_angle += Math.PI * delta_time; // 1 full rotation per second
    
    // z_offset += 1 * delta_time; // move 1 unit per second

    cube.draw();

    // // draw cube corner points
    // for (const vertex of cube_vertices) {
    //     place_point(get_on_screen_point_representation(vertex.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()));
    // }

    // for (const face of faces) {
    //     for (let i = 0; i < face.length; i++) {
    //         let vertex_a = cube_vertices[face[i]];
    //         let vertex_b = cube_vertices[face[(i + 1) % face.length]]; // wrap around last to first vertex

    //         place_line(
    //             get_on_screen_point_representation(vertex_a.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()),
    //             get_on_screen_point_representation(vertex_b.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()),
    //         );
    //     }
    // }
    
    setTimeout(draw_frame, 1000 / FPS); // reschedule next frame
}

setTimeout(draw_frame, 1000 / FPS); // 1000ms divided by FPS gives the interval in ms
