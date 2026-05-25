import { Point3D } from './Point3D.js';
import { BaseObject } from './BaseObject.js';
import { place_point, get_on_screen_point_representation, place_line } from './common_stuff_that_needs_to_be_accessible_somewhere_else.js';

export class Cube extends BaseObject {
  game_reference: HTMLCanvasElement;
  context_reference: CanvasRenderingContext2D;
  side_length: number;

  constructor(position: Point3D, side_length: number, game_reference: HTMLCanvasElement, context_reference: CanvasRenderingContext2D) {
    super(position);
    this.game_reference = game_reference;
    this.context_reference = context_reference;
    this.side_length = side_length;

    this.vertices = [
      new Point3D(position.x + this.side_length / 2, position.y + this.side_length / 2, position.z + this.side_length / 2),
      new Point3D(position.x - this.side_length / 2, position.y + this.side_length / 2, position.z + this.side_length / 2),
      new Point3D(position.x - this.side_length / 2, position.y - this.side_length / 2, position.z + this.side_length / 2),
      new Point3D(position.x + this.side_length / 2, position.y - this.side_length / 2, position.z + this.side_length / 2),
      new Point3D(position.x + this.side_length / 2, position.y + this.side_length / 2, position.z - this.side_length / 2),
      new Point3D(position.x - this.side_length / 2, position.y + this.side_length / 2, position.z - this.side_length / 2),
      new Point3D(position.x - this.side_length / 2, position.y - this.side_length / 2, position.z - this.side_length / 2),
      new Point3D(position.x + this.side_length / 2, position.y - this.side_length / 2, position.z - this.side_length / 2),
    ];

    this.faces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
  }

  draw(currentFrameTime: number): void {
    void currentFrameTime;

    for (const vertex of this.vertices) {
      place_point(
        get_on_screen_point_representation(vertex.project_to_2d(), this.game_reference.width, this.game_reference.height),
        false,
        { x: 10, y: 10 },
        this.context_reference,
      );
    }

    for (const face of this.faces) {
      for (let index = 0; index < face.length; index += 1) {
        const vertexA = this.vertices[face[index]];
        const vertexB = this.vertices[face[(index + 1) % face.length]];

        place_line(
          get_on_screen_point_representation(vertexA.project_to_2d(), this.game_reference.width, this.game_reference.height),
          get_on_screen_point_representation(vertexB.project_to_2d(), this.game_reference.width, this.game_reference.height),
          1,
          false,
          this.context_reference,
        );
      }
    }
  }

  move(xOffset: number, yOffset: number, zOffset: number): void {
    console.log('moving cube', { xOffset, yOffset, zOffset });

    this.position = this.position.translate_point_in_x_axis(xOffset);
    this.position = this.position.translate_point_in_y_axis(yOffset);
    this.position = this.position.translate_point_in_z_axis(zOffset);
  }
}