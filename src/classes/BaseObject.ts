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

    get_draw_instructions(currentFrameTime: number): DrawInstruction[] {
        return [
            ...this.get_vertex_draw_instructions(),
            ...this.get_object_specific_draw_instructions(currentFrameTime),
        ];
    }

    private get_vertex_draw_instructions(): PointDrawInstruction[] {
        return this.vertices.map((vertex) => ({
            kind: "point",
            point: vertex,
            special: false,
            size: { x: 10, y: 10 },
        }));
    }

    protected abstract get_object_specific_draw_instructions(
        currentFrameTime: number,
    ): DrawInstruction[];
}
