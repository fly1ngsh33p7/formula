const BACKGROUND_COLOR = "#101010";
const FOREGROUND_COLOR = "#50FF50";
const LINE_COLOR = "#00ddfeff";
const SPECIAL_COLOR = "#ffffffff";

class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Point3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    project_to_2d() {
        // "the formula"
        // this formula assumes a perspective projection where the viewer is looking along the z-axis (in positve direction) and the eye is at 0/0/0
        return new Point2D(
            x=(this.x / this.z),
            y=(this.y / this.z),
        );
    }

    translate_point_in_z_axis(offset) {
        return new Point3D(
            x=(this.x),
            y=(this.y),
            z=(this.z + offset),
        );
    }

    rotate_around_y_axis(angle_in_radians) { // equals rotating in the xz plane
        let sin_angle = Math.sin(angle_in_radians);
        let cos_angle = Math.cos(angle_in_radians);
        return new Point3D(
            x=(this.x * cos_angle - this.z * sin_angle),
            y=(this.y), // when rotating around y axis, y stays the same
            z=(this.x * sin_angle + this.z * cos_angle),
        );
    }
}

let points_that_have_been_placed = [];

function get_on_screen_point_representation(p) {
    // because of "the formula" we need to translate from -1..1 to 0..width/height
    // if we add 1 (to -1..1) we get 0..2, which is easier to convert (so -1..1 => 0..2 => 0..width/height)
    // we need to normalize it so we can just multiply it by the screen size ( -1..1 => 0..2 => 0..1 => 0..width/height)
    return new Point2D(
        (p.x + 1)/2 * game.width,
        (1 - (p.y + 1)/2) * game.height, // y is inverted on screen so that negative is down
    );
}

function clear() {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, game.width, game.height);
}

function place_point(p, special = false, point_size = {x: 10, y: 10}, dont_add_to_placed_points = false) {
    context.fillStyle = special ? SPECIAL_COLOR : FOREGROUND_COLOR;
    // account for point size so it's centered
    context.fillRect(
        (p.x - point_size.x / 2),
        (p.y - point_size.y / 2),
        point_size.x,
        point_size.y,
    );

    // add to placed points
    if (!dont_add_to_placed_points) {
        points_that_have_been_placed.push({point: p, point_size: point_size, color: context.fillStyle});
    }
}

function place_line(point1, point2, line_thickness = 1, special = false) {
    context.beginPath(); // "initialize Turtle"
    
    context.moveTo(point1.x, point1.y); // move Turtle to start point
    context.lineTo(point2.x, point2.y); // draw line to end point

    // set line style
    context.lineWidth = line_thickness;
    context.strokeStyle = special ? SPECIAL_COLOR : LINE_COLOR;
    
    context.stroke(); // actually draw the line
}

function place_axis_lines() {
    // x axis
    place_point(get_on_screen_point_representation(new Point2D(x=-1, y=0)), special=false, point_size={x: game.width, y: 2}, dont_add_to_placed_points=true);
    place_point(get_on_screen_point_representation(new Point2D(x=1, y=0)), special=false, point_size={x: game.width, y: 2}, dont_add_to_placed_points=true);
    // y axis
    place_point(get_on_screen_point_representation(new Point2D(x=0, y=-1)), special=false, point_size={x: 2, y: game.height}, dont_add_to_placed_points=true);
    place_point(get_on_screen_point_representation(new Point2D(x=0, y=1)), special=false, point_size={x: 2, y: game.height}, dont_add_to_placed_points=true);
}


// game.width = window.innerWidth - 10;
// game.height = window.innerHeight - 10;

let context = game.getContext("2d")// as CanvasRenderingContext2D;

console.log(game);
console.log(context);

console.log(`Game size: ${game.width}x${game.height}`);

clear();


// place_point(get_on_screen_point_representation(new Point2D(1, 1)), special=true);

// place_point(get_on_screen_point_representation(new Point3D(x=0.2, y=0.2, z=1).project_to_2d()), special=true);
// place_point(get_on_screen_point_representation(new Point3D(x=0.2, y=0.2, z=0.25).project_to_2d()));
// place_point(get_on_screen_point_representation(new Point3D(x=0.2, y=0.2, z=2).project_to_2d()));





const FPS = 60;

let cube_vertices = [
    // first "plane"
    new Point3D(x=0.25, y=0.25, z=0.25),  // vertex index 0
    new Point3D(x=-0.25, y=0.25, z=0.25), // vertex index 1
    new Point3D(x=-0.25, y=-0.25, z=0.25), // vertex index 2
    new Point3D(x=0.25, y=-0.25, z=0.25),// vertex index 3

    // second "plane"
    new Point3D(x=0.25, y=0.25, z=-0.25),   // vertex index 4
    new Point3D(x=-0.25, y=0.25, z=-0.25),  // vertex index 5
    new Point3D(x=-0.25, y=-0.25, z=-0.25),  // vertex index 6
    new Point3D(x=0.25, y=-0.25, z=-0.25), // vertex index 7
]

let faces = [ // indices of vertices that make up each face
    [0, 1, 2, 3], // front face
    [4, 5, 6, 7], // back face
    // connect pairs of vertices from front and back faces, making the side faces
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

let z_offset = 1;
let rotation_angle = 0;

function draw_frame() {
    clear();
    place_axis_lines();

    let delta_time = 1 / FPS; // in seconds

    // animate z_offset and rotation
    rotation_angle += Math.PI * delta_time; // 1 full rotation per second
    
    // z_offset += 1 * delta_time; // move 1 unit per second


    // draw cube corner points
    for (const vertex of cube_vertices) {
        place_point(get_on_screen_point_representation(vertex.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()));
    }

    for (const face of faces) {
        for (let i = 0; i < face.length; i++) {
            let vertex_a = cube_vertices[face[i]];
            let vertex_b = cube_vertices[face[(i + 1) % face.length]]; // wrap around last to first vertex

            place_line(
                get_on_screen_point_representation(vertex_a.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()),
                get_on_screen_point_representation(vertex_b.rotate_around_y_axis(rotation_angle).translate_point_in_z_axis(z_offset).project_to_2d()),
            );
        }
    }
    
    setTimeout(draw_frame, 1000 / FPS); // reschedule next frame
}

setTimeout(draw_frame, 1000 / FPS); // 1000ms divided by FPS gives the interval in ms


// (function print_placed_points(show_size = false, show_color = false) {
//     console.log("Placed points:");
//     for (let i = 0; i < points_that_have_been_placed.length; i++) {
//         let p = points_that_have_been_placed[i];

//         let string_to_print = `${i}  - (x: ${p.point.x.toFixed(2)}, y: ${p.point.y.toFixed(2)})`;
//         if (show_size) {
//             string_to_print += ` size=(${p.point_size.x}x${p.point_size.y})`;
//         }
//         if (show_color) {
//             string_to_print += ` color=${p.color}`;
//         }

//         console.log(string_to_print);
//     }
// })(show_color=true, show_size=true);
