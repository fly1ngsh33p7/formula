import Point2D from "./classes/Point2D.js";
import Point3D from "./classes/Point3D.js";
import Cube from "./classes/Cube.js";
import { FPS } from "./utils/constants.js";
import {
    clear,
    place_point,
    get_on_screen_point_representation,
    place_line,
} from "./classes/common_stuff_that_needs_to_be_accessible_somewhere_else.js";
import BaseObject, { DrawInstruction } from "./classes/BaseObject.js";

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

function executeDrawInstructions(
    instructions: DrawInstruction[],
    canvasContext: CanvasRenderingContext2D,
): void {
    for (const instruction of instructions) {
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
        }

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

const cube = new Cube(new Point3D(0, 0, 1), 0.5);
const cube2 = new Cube(new Point3D(0, 0, 0.1), 0.5);

type LoadedObject = {
    object: BaseObject;
    moveSpeedPerFrame: Point3D;
};

const loaded_objects: LoadedObject[] = [
    // {
    //     object: cube,
    //     moveSpeedPerFrame: new Point3D(0, 0, 0.00001),
    // },
    // {
    //     object: cube2,
    //     moveSpeedPerFrame: new Point3D(0, 0.00001, 0.0001),
    // },
];

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

const spawnCubeForm = document.getElementById("spawn-cube-form");
if (!(spawnCubeForm instanceof HTMLFormElement)) {
    throw new Error("Form with id 'spawn-cube-form' not found");
}

const spawnCubeSizeInput = document.getElementById("spawn-cube-size");
const spawnCubeXInput = document.getElementById("spawn-cube-x");
const spawnCubeYInput = document.getElementById("spawn-cube-y");
const spawnCubeZInput = document.getElementById("spawn-cube-z");
const spawnCubeSpeedXInput = document.getElementById("spawn-cube-speed-x");
const spawnCubeSpeedYInput = document.getElementById("spawn-cube-speed-y");
const spawnCubeSpeedZInput = document.getElementById("spawn-cube-speed-z");

if (
    !(spawnCubeSizeInput instanceof HTMLInputElement) ||
    !(spawnCubeXInput instanceof HTMLInputElement) ||
    !(spawnCubeYInput instanceof HTMLInputElement) ||
    !(spawnCubeZInput instanceof HTMLInputElement) ||
    !(spawnCubeSpeedXInput instanceof HTMLInputElement) ||
    !(spawnCubeSpeedYInput instanceof HTMLInputElement) ||
    !(spawnCubeSpeedZInput instanceof HTMLInputElement)
) {
    throw new Error("Spawn Cube inputs not found");
}

spawnCubeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const size = spawnCubeSizeInput.valueAsNumber;
    const x = spawnCubeXInput.valueAsNumber;
    const y = spawnCubeYInput.valueAsNumber;
    const z = spawnCubeZInput.valueAsNumber;
    const speedX = spawnCubeSpeedXInput.valueAsNumber;
    const speedY = spawnCubeSpeedYInput.valueAsNumber;
    const speedZ = spawnCubeSpeedZInput.valueAsNumber;

    if (
        [size, x, y, z, speedX, speedY, speedZ].some(
            (value) => Number.isNaN(value),
        )
    ) {
        throw new Error("Spawn Cube form contains invalid numbers");
    }

    const cubeToSpawn = new Cube(new Point3D(x, y, z), size);

    const new_loaded_object: LoadedObject = {
        object: cubeToSpawn,
        moveSpeedPerFrame: new Point3D(speedX, speedY, speedZ),
    };


    loaded_objects.push(new_loaded_object);

    console.log("loaded_objects after adding another object", loaded_objects);
});

function drawFrame(): void {
    clear(context); // clear frame before drawing new one

    if (show_axis_lines) {
        placeAxisLines(context);
    }

    const deltaTime = 1 / FPS; // in seconds

    // console.log("currentframe", current_frame);

    for (const loadedObject of loaded_objects) {
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

    currentFrame += 1;
    setTimeout(drawFrame, 1000 / FPS); // reschedule next frame
}

// start the drawing loop
setTimeout(drawFrame, 1000 / FPS); // 1000ms divided by FPS gives the interval in ms
