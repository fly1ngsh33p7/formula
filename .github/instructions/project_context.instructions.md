---
description: "Project rule for the formula's 3D-to-2D perspective projection"
applyTo: "src/**/*.{js,html}"
---

Use the formula consistently when projecting 3D points to 2D.

- `Point3D.project_to_2d()` should use perspective projection with the viewer at the origin looking along the positive z-axis.
- Map a 3D point to `Point2D` using `x / z` and `y / z`.
- Do not change this projection convention unless the user explicitly asks.
- Keep translation and rotation logic compatible with this assumption.

