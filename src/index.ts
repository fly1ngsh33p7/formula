import Point2D from "./classes/Point2D.js";
import Point3D from "./classes/Point3D.js";
import Cube from "./classes/Cube.js";
import { FPS } from "./utils/constants.js";
import {
    clear,
    place_point,
    get_on_screen_point_representation,
} from "./classes/common_stuff_that_needs_to_be_accessible_somewhere_else.js";

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

let currentFrame = 0;

function drawFrame(): void {
    clear(context);
    // placeAxisLines(context);

    const deltaTime = 1 / FPS; // in seconds

    // console.log("currentframe", current_frame);

    console.log("cube before move", cube);

    cube.move(0, 0, currentFrame * 0.01);

    console.log("cube after move", cube);

    cube.draw(currentFrame * deltaTime);

    currentFrame += 1;
    setTimeout(drawFrame, 1000 / FPS); // reschedule next frame
}

// start the drawing loop
setTimeout(drawFrame, 1000 / FPS); // 1000ms divided by FPS gives the interval in ms
