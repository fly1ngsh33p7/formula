import { Point2D } from './classes/Point2D.js';
import { Point3D } from './classes/Point3D.js';
import { Cube } from './classes/Cube.js';
import { BACKGROUND_COLOR, FOREGROUND_COLOR, LINE_COLOR, SPECIAL_COLOR, FPS } from './utils/constants.js';
import { clear, place_point, get_on_screen_point_representation, place_line } from './classes/common_stuff_that_needs_to_be_accessible_somewhere_else.js';

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
    place_point(get_on_screen_point_representation(new Point2D(-1, 0), game.width, game.height), false, { x: game.width, y: 2 }, context);
    place_point(get_on_screen_point_representation(new Point2D(1, 0), game.width, game.height), false, { x: game.width, y: 2 }, context);
    // y axis
    place_point(get_on_screen_point_representation(new Point2D(0, -1), game.width, game.height), false, { x: 2, y: game.height }, context);
    place_point(get_on_screen_point_representation(new Point2D(0, 1), game.width, game.height), false, { x: 2, y: game.height }, context);
}

// game.width = window.innerWidth - 10;
// game.height = window.innerHeight - 10;

console.log(game);
console.log(context);

console.log(`Game size: ${game.width}x${game.height}`);

clear(context);

let z_offset = 1;
let rotation_angle = 0;

const cube = new Cube(new Point3D(0, 0, 1), 0.5, game, context);

let current_frame = 0;

function draw_frame() {
    clear(context);
    // place_axis_lines(context);

    const delta_time = 1 / FPS; // in seconds

    // animate z_offset and rotation
    rotation_angle += Math.PI * delta_time; // 1 full rotation per second

    z_offset += 1 * delta_time; // move 1 unit per second

    // console.log("currentframe", current_frame);

    // console.log("cube", cube);

    cube.move(0, 0, current_frame * 0.001);
    cube.draw(current_frame * delta_time);
    

    current_frame++;
    setTimeout(draw_frame, 1000 / FPS); // reschedule next frame
}

// start the drawing loop
setTimeout(draw_frame, 1000 / FPS); // 1000ms divided by FPS gives the interval in ms
