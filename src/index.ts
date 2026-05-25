import Point2D from "./classes/Point2D.js";
import Point3D from "./classes/Point3D.js";
import Cube from "./classes/Cube.js";
import { FPS } from "./utils/constants.js";
import {
    clear,
    place_point,
    get_on_screen_point_representation,
} from "./classes/common_stuff_that_needs_to_be_accessible_somewhere_else.js";
import BaseObject from "./classes/BaseObject.js";

const gameElement = document.getElementById("game");
if (!(gameElement instanceof HTMLCanvasElement)) {
    throw new Error("Canvas with id 'game' not found");
}

const game: HTMLCanvasElement = gameElement;

const canvasContext = game.getContext("2d");
if (!canvasContext) {
    throw new Error("Could not get 2D context");
}

const context: CanvasRenderingContext2D = canvasContext;

function placeAxisLines(canvasContext: CanvasRenderingContext2D): void {
    // x axis
    place_point(
        get_on_screen_point_representation(
            new Point2D(-1, 0),
            game.width,
            game.height,
        ),
        false,
        { x: game.width, y: 2 },
        canvasContext,
    );
    place_point(
        get_on_screen_point_representation(
            new Point2D(1, 0),
            game.width,
            game.height,
        ),
        false,
        { x: game.width, y: 2 },
        canvasContext,
    );
    // y axis
    place_point(
        get_on_screen_point_representation(
            new Point2D(0, -1),
            game.width,
            game.height,
        ),
        false,
        { x: 2, y: game.height },
        canvasContext,
    );
    place_point(
        get_on_screen_point_representation(
            new Point2D(0, 1),
            game.width,
            game.height,
        ),
        false,
        { x: 2, y: game.height },
        canvasContext,
    );
}

console.log(game);
console.log(context);

console.log(`Game size: ${game.width}x${game.height}`);

clear(context);

const cube = new Cube(new Point3D(0, 0, 1), 0.5, game, context);
const cube2 = new Cube(new Point3D(0, 0, 0.1), 0.5, game, context);

const loaded_objects: BaseObject[] = [cube, cube2];

let currentFrame = 0;

let show_axis_lines = true;

const showAxisLinesInput = document.getElementById("show-axis-lines");
if (!(showAxisLinesInput instanceof HTMLInputElement)) {
    throw new Error("Checkbox with id 'show-axis-lines' not found");
}

show_axis_lines = showAxisLinesInput.checked;

showAxisLinesInput.addEventListener("change", () => {
    show_axis_lines = showAxisLinesInput.checked;
});

function drawFrame(): void {
    clear(context); // clear frame before drawing new one

    if (show_axis_lines) {
        placeAxisLines(context);
    }

    const deltaTime = 1 / FPS; // in seconds

    // console.log("currentframe", current_frame);

    cube.move(0, 0, currentFrame * 0.00001);
    cube2.move(0, currentFrame * 0.00001, currentFrame * 0.0001);

    for (const object of loaded_objects) {
        object.draw(currentFrame * deltaTime);
    }

    currentFrame += 1;
    setTimeout(drawFrame, 1000 / FPS); // reschedule next frame
}

// start the drawing loop
setTimeout(drawFrame, 1000 / FPS); // 1000ms divided by FPS gives the interval in ms
