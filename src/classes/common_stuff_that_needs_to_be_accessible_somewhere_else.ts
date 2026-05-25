import Point2D from "./Point2D";
import {
    BACKGROUND_COLOR,
    FOREGROUND_COLOR,
    LINE_COLOR,
    SPECIAL_COLOR,
} from "../utils/constants";

type PointSize = {
    x: number;
    y: number;
};

export function get_on_screen_point_representation(
    p: Point2D,
    max_width: number,
    max_height: number,
): Point2D {
    return new Point2D(
        ((p.x + 1) / 2) * max_width,
        (1 - (p.y + 1) / 2) * max_height,
    );
}

export function clear(context: CanvasRenderingContext2D): void {
    const canvas = context.canvas;
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

export function place_point(
    p: Point2D,
    special: boolean = false,
    point_size: PointSize = { x: 10, y: 10 },
    context: CanvasRenderingContext2D,
): void {
    context.fillStyle = special ? SPECIAL_COLOR : FOREGROUND_COLOR;
    context.fillRect(
        p.x - point_size.x / 2,
        p.y - point_size.y / 2,
        point_size.x,
        point_size.y,
    );
}

export function place_line(
    point1: Point2D,
    point2: Point2D,
    line_thickness: number = 1,
    special: boolean = false,
    context: CanvasRenderingContext2D,
): void {
    context.beginPath(); // "initialize Turtle"

    context.moveTo(point1.x, point1.y); // move Turtle to start point
    context.lineTo(point2.x, point2.y); // draw line to end point

    // set line style
    context.lineWidth = line_thickness;
    context.strokeStyle = special ? SPECIAL_COLOR : LINE_COLOR;

    context.stroke(); // actually draw the line
}
