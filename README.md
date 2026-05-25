This is my implementation of https://www.youtube.com/watch?v=qjWkNZ0SXfo to tinker with.
(No fork because I want to build it from the ground up)

# Build

```bash
npm install
npm run build
```

# Usage
To be able to use modules (classes) in the browser you need to run a HTTP Server after building.

```
python3 -m http.server 8000
```

and then open 

```
http://localhost:8000/dist/index.html
```
