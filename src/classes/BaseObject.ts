import Point3D from "./Point3D.js";

export type PointDrawInstruction = {
    kind: "point";
    point: Point3D;
    special?: boolean;
    size?: {
        x: number;
        y: number;
    };
};

export type LineDrawInstruction = {
    kind: "line";
    start: Point3D;
    end: Point3D;
    thickness?: number;
    special?: boolean;
};

export type DrawInstruction = PointDrawInstruction | LineDrawInstruction;

export default abstract class BaseObject {
    position: Point3D;
    vertices: Point3D[];
    faces: number[][];

    constructor(position: Point3D) {
        this.position = position;
        this.vertices = [];
        this.faces = [];
    }

    move(xOffset: number, yOffset: number, zOffset: number): void {
        // change the position of the object itself - the center point of the object
        this.position = this.position.translate_point_in_x_axis(xOffset);
        this.position = this.position.translate_point_in_y_axis(yOffset);
        this.position = this.position.translate_point_in_z_axis(zOffset);

        // change the position of the vertices of the object - the actual points that we will be drawn
        this.vertices = this.vertices.map((vertex) =>
            vertex
                .translate_point_in_x_axis(xOffset)
                .translate_point_in_y_axis(yOffset)
                .translate_point_in_z_axis(zOffset),
        );
    }

    public get_draw_instructions(currentFrameTime: number): DrawInstruction[] {
        if (!this.is_visible()) {
            return [];
        }

        return [
            ...this.get_vertex_draw_instructions(),
            ...this.get_object_specific_draw_instructions(currentFrameTime),
        ];
    }

    public is_visible(): boolean {
        if (this.position.z < 0.13) {
            // skip rendering objects that are very close to the camera/z=0 (causes visual bug)
            // or behind the camera (doesn't need to be rendered, but is kept in the list, and keeps moving)
            return false;
        }

        return true;
    }

    private get_vertex_draw_instructions(): PointDrawInstruction[] {
        return this.vertices.map((vertex) => {
            // size decreases with distance; clamp to a small minimum
            const pixelSize = Math.max(2, Math.round(12 / (0.5 * vertex.get_distance_from_origin() + 1)));

            return {
                kind: "point",
                point: vertex,
                special: false,
                size: { x: pixelSize, y: pixelSize },
            };
        });
    }

    protected abstract get_object_specific_draw_instructions(
        currentFrameTime: number,
    ): DrawInstruction[];
}
