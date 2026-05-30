import Cube from "./classes/Cube.js";
import BaseObject from "./classes/BaseObject.js";
import Point3D from "./classes/Point3D.js";

export type LoadedObject = {
    id: number;
    object: BaseObject;
    moveSpeedPerFrame: Point3D;
};

type RenderingChangeHandler = (isRendering: boolean) => void;

export type UIState = {
    getLoadedObjects: () => LoadedObject[];
    isRendering: () => boolean;
    isShowAxisLines: () => boolean;
    renderLoadedObjectsList: () => void;
    onRenderingChange: (handler: RenderingChangeHandler) => void;
};

export function setupUI(): UIState {
    const loadedObjects: LoadedObject[] = [];
    let nextLoadedObjectId = 1;
    let isRendering = true;
    let showAxisLines = true;
    let renderingChangeHandler: RenderingChangeHandler | null = null;

    // === UI element references and event listeners setup = START ===
    const showAxisLinesInput = document.getElementById("show-axis-lines");
    if (!(showAxisLinesInput instanceof HTMLInputElement)) {
        throw new Error("Checkbox with id 'show-axis-lines' not found");
    }
    
    const toggleRenderingButton = document.getElementById("toggle-rendering-button");
    if (!(toggleRenderingButton instanceof HTMLButtonElement)) {
        throw new Error("Button with id 'toggle-rendering-button' not found");
    }
    
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
    // === UI element references and event listeners setup = END ===


    // === Loaded objects list with remove and log buttons = START ===
    const loadedObjectsListElement = document.getElementById("loaded-objects-list");
    if (!(loadedObjectsListElement instanceof HTMLUListElement)) {
        throw new Error("List with id 'loaded-objects-list' not found");
    }
    const loadedObjectsList: HTMLUListElement = loadedObjectsListElement;
    
    function renderLoadedObjectsList(): void {
        loadedObjectsList.innerHTML = "";
        
        const loadedObjectsSortedByDistance = [...loadedObjects].sort((a, b) =>
            a.object.position.get_distance_from_origin() - b.object.position.get_distance_from_origin(),
    );
    
    if (loadedObjectsSortedByDistance.length === 0) {
        const emptyRow = document.createElement("li");
        emptyRow.textContent = "No objects loaded.";
            loadedObjectsList.appendChild(emptyRow);
            return;
        }

        for (const loadedObject of loadedObjectsSortedByDistance) {
            const row = document.createElement("li");

            const details = document.createElement("span");
            details.className = "object-row-details";
            details.textContent = `distance: ${loadedObject.object.position.get_distance_from_origin().toFixed(3)} | position: (${loadedObject.object.position.x.toFixed(3)}, ${loadedObject.object.position.y.toFixed(3)}, ${loadedObject.object.position.z.toFixed(3)}) | is_visible: ${loadedObject.object.is_visible()}`;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-object-button";
            removeButton.textContent = "x";
            removeButton.title = "Remove object";
            removeButton.dataset.loadedObjectAction = "remove";
            removeButton.dataset.loadedObjectId = String(loadedObject.id);

            const logButton = document.createElement("button");
            logButton.type = "button";
            logButton.className = "log-object-button";
            logButton.textContent = "log";
            logButton.title = "Log object";
            logButton.dataset.loadedObjectAction = "log";
            logButton.dataset.loadedObjectId = String(loadedObject.id);

            row.append(details, logButton, removeButton);
            loadedObjectsList.appendChild(row);
        }
    }

    loadedObjectsList.addEventListener("pointerdown", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
            return;
        }

        const action = target.dataset.loadedObjectAction;
        if (!action) {
            return;
        }

        const loadedObjectIdText = target.dataset.loadedObjectId;
        if (!loadedObjectIdText) {
            return;
        }

        const loadedObjectId = Number(loadedObjectIdText);
        if (Number.isNaN(loadedObjectId)) {
            return;
        }

        const loadedObject = loadedObjects.find(
            (item) => item.id === loadedObjectId,
        );
        if (!loadedObject) {
            return;
        }

        if (action === "log") {
            console.log("loaded object info", {
                id: loadedObject.id,
                distance: loadedObject.object.position.get_distance_from_origin().toFixed(3),
                position: {
                    x: loadedObject.object.position.x.toFixed(3),
                    y: loadedObject.object.position.y.toFixed(3),
                    z: loadedObject.object.position.z.toFixed(3)
                },
                moveSpeedPerFrame: loadedObject.moveSpeedPerFrame,
            });
            console.log("loaded object instance", loadedObject.object);
            console.log("loaded object drawing instructions", loadedObject.object.get_draw_instructions(0));
            return;
        }

        if (action !== "remove") {
            return;
        }

        const indexToRemove = loadedObjects.findIndex(
            (item) => item.id === loadedObjectId,
        );
        if (indexToRemove < 0) {
            return;
        }

        loadedObjects.splice(indexToRemove, 1);
        renderLoadedObjectsList();
    });
    // === Loaded objects list with remove and log buttons = END ===

    // === Show axis lines toggle = START ===
    showAxisLines = showAxisLinesInput.checked;
    showAxisLinesInput.addEventListener("change", () => {
        showAxisLines = showAxisLinesInput.checked;
    });
    // === Show axis lines toggle = END ===

    // === Rendering toggle button = START ===
    toggleRenderingButton.addEventListener("click", () => {
        isRendering = !isRendering;
        toggleRenderingButton.textContent = isRendering
            ? "Pause"
            : "Play";

        if (renderingChangeHandler) {
            renderingChangeHandler(isRendering);
        }
    });
    // === Rendering toggle button = END ===

    // === Spawn cube form = START ===
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

        const newLoadedObject: LoadedObject = {
            id: nextLoadedObjectId,
            object: cubeToSpawn,
            moveSpeedPerFrame: new Point3D(speedX, speedY, speedZ),
        };

        nextLoadedObjectId += 1;
        loadedObjects.push(newLoadedObject);

        renderLoadedObjectsList();

        console.log("loaded_objects after adding another object", loadedObjects);
    });
    // === Spawn cube form = END ===

    return {
        getLoadedObjects: () => loadedObjects,
        isRendering: () => isRendering,
        isShowAxisLines: () => showAxisLines,
        renderLoadedObjectsList,
        onRenderingChange: (handler) => {
            renderingChangeHandler = handler;
        },
    };
}