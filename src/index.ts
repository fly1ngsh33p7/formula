import Point2D from "./classes/Point2D.js";
import { FPS } from "./utils/constants.js";
import {
    clear,
    place_point,
    get_on_screen_point_representation,
    place_line,
} from "./classes/common_stuff_that_needs_to_be_accessible_somewhere_else.js";
import { DrawInstruction } from "./classes/BaseObject.js";
import { setupUI } from "./ui.js";
import type { LoadedObject } from "./ui.js";

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

const ui = setupUI();

function executeDrawInstructions(
    instructions: DrawInstruction[],
    canvasContext: CanvasRenderingContext2D,
): void {
    // apply for each instruction (i.e. each Object)
    for (const instruction of instructions) {
        // execute the instruction according to its type
        if (instruction.kind === "point") {
            place_point(
                get_on_screen_point_representation(
                    instruction.point.project_to_2d(),
                    game.width,
                    game.height,
                ),
                instruction.special ?? false,
                instruction.size ?? { x: 10, y: 10 },
                canvasContext,
            );
            continue;
        } else if (instruction.kind === "line") {
            place_line(
                get_on_screen_point_representation(
                    instruction.start.project_to_2d(),
                    game.width,
                    game.height,
                ),
                get_on_screen_point_representation(
                    instruction.end.project_to_2d(),
                    game.width,
                    game.height,
                ),
                instruction.thickness ?? 1,
                instruction.special ?? false,
                canvasContext,
            );
        }
    }
}

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

let currentFrame = 0;
let nextFrameTimeoutId: number | null = null;

const loadedObjects: LoadedObject[] = ui.getLoadedObjects();

function scheduleNextFrame(): void {
    if (!ui.isRendering()) {
        return;
    }

    nextFrameTimeoutId = window.setTimeout(drawFrame, 1000 / FPS);
}

ui.onRenderingChange((isRendering: boolean) => {
    if (!isRendering && nextFrameTimeoutId !== null) {
        window.clearTimeout(nextFrameTimeoutId);
        nextFrameTimeoutId = null;
        return;
    }

    if (isRendering && nextFrameTimeoutId === null) {
        scheduleNextFrame();
    }
});

function drawFrame(): void {
    clear(context); // clear frame before drawing new one

    if (ui.isShowAxisLines()) {
        placeAxisLines(context);
    }

    const deltaTime = 1 / FPS; // in seconds

    // console.log("currentframe", current_frame);

    for (const loadedObject of loadedObjects) {
        loadedObject.object.move(
            loadedObject.moveSpeedPerFrame.x,
            loadedObject.moveSpeedPerFrame.y,
            loadedObject.moveSpeedPerFrame.z,
        );

        executeDrawInstructions(
            loadedObject.object.get_draw_instructions(currentFrame * deltaTime),
            context,
        );
    }

    ui.renderLoadedObjectsList();

    currentFrame += 1;
    scheduleNextFrame();
}

ui.renderLoadedObjectsList();

// start the drawing loop
scheduleNextFrame();
