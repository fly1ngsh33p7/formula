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
        return [
            ...this.get_vertex_draw_instructions(),
            ...this.get_object_specific_draw_instructions(currentFrameTime),
        ];
    }

    public is_visible(): boolean {
        // an object is visible if just a single of its vertices are in front (z: positive) of the camera/z=0 (if z < 0.13 -> causes visual bug)
        // it it's not visible, it doesn't need to be rendered, but is kept in the list, and keeps moving.
        for (const vertex of this.vertices) {
            if (vertex.is_visible()) { // let Point3D decide if it's visible
                return true;
            }
        }

        return false;
    }

    private get_vertex_draw_instructions(): PointDrawInstruction[] {
        return this.vertices
            .filter((vertex) => vertex.is_visible()) // only draw vertices that are visible (in front of the camera)
            .map((vertex) => {
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
