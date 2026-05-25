import { Point2D } from './Point2D.js';

export class Point3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  project_to_2d(): Point2D {
    return new Point2D(this.x / this.z, this.y / this.z);
  }

  translate_point_in_x_axis(offset: number): Point3D {
    return new Point3D(this.x + offset, this.y, this.z);
  }

  translate_point_in_y_axis(offset: number): Point3D {
    return new Point3D(this.x, this.y + offset, this.z);
  }

  translate_point_in_z_axis(offset: number): Point3D {
    return new Point3D(this.x, this.y, this.z + offset);
  }

  rotate_around_y_axis(angle_in_radians: number): Point3D {
    const sin_angle = Math.sin(angle_in_radians);
    const cos_angle = Math.cos(angle_in_radians);

    return new Point3D(
      this.x * cos_angle - this.z * sin_angle,
      this.y,
      this.x * sin_angle + this.z * cos_angle,
    );
  }
}