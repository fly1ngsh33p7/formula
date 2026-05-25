import { Point2D } from './Point2D.js';
import { BACKGROUND_COLOR, FOREGROUND_COLOR, LINE_COLOR, SPECIAL_COLOR } from '../utils/constants.js';


export function get_on_screen_point_representation(p, max_width, max_height) {
    // because of "the formula" we need to translate from -1..1 to 0..width/height
    // if we add 1 (to -1..1) we get 0..2, which is easier to convert (so -1..1 => 0..2 => 0..width/height)
    // we need to normalize it so we can just multiply it by the screen size ( -1..1 => 0..2 => 0..1 => 0..width/height)
    return new Point2D(
        (p.x + 1)/2 * max_width,
        (1 - (p.y + 1)/2) * max_height, // y is inverted on screen so that negative is down
    );
}

export function clear(context) {
    const canvas = context.canvas;
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

export function place_point(p, special = false, point_size = {x: 10, y: 10}, context) {
    context.fillStyle = special ? SPECIAL_COLOR : FOREGROUND_COLOR;
    // account for point size so it's centered
    context.fillRect(
        (p.x - point_size.x / 2),
        (p.y - point_size.y / 2),
        point_size.x,
        point_size.y,
    );
}

export function place_line(point1, point2, line_thickness = 1, special = false, context) {
    context.beginPath(); // "initialize Turtle"
    
    context.moveTo(point1.x, point1.y); // move Turtle to start point
    context.lineTo(point2.x, point2.y); // draw line to end point

    // set line style
    context.lineWidth = line_thickness;
    context.strokeStyle = special ? SPECIAL_COLOR : LINE_COLOR;
    
    context.stroke(); // actually draw the line
}