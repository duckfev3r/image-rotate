# Image Rotation Task

To run these demos, make sure node is installed, see `https://nodejs.org/en/download/`

##### To run in browser:

1. `cd web_app`
2. `npm install`
3. `npm start`
4. navigate to `localhost:3000` in the browser
5. select an image, click `ROTATE`

##### To run in node:

1. `cd node_app`
2. `npm install`
3. `node build/app.js`

### Task

Build/code the fastest/best quality image rotation algorithm.
Inputs:

1. RGBA Image, as ImageData object { buffer, width, height }, https://developer.mozilla.org/enUS/docs/Web/API/ImageData
2. Angle (radians), +ve is clockwise rotation about the centre of the image
   Outputs:
3. RGBA Image, as ImageData object { buffer, width, height } - note the buffer, width and height will be
   different to the input object.

### Metrics:

1. Functional test, i.e. does it work when it is supposed to and does it handle errors.
2. Code quality, i.e. can we understand it and maintain it.
3. Time required to process the image rotation - measured in milli-seconds (or higher resolution where
   available), using the performance API.
4. Quality of the image rotation - measured as total absolute difference from the ideal image.

### Rules:

1. JavaScript code (or transpiled from, e.g. TypeScript)
2. From your code, export a “Rotator” class that embodies the algorithm’s method
3. The class/method must run in node and browser
4. Method signature must be rotate(image: ImageData, angle: double) : ImageData
5. No native libraries may be used (e.g. cannot use canvas APIs)
6. Rotate method may not use dependencies or import other libraries
7. You may copy code from or refer to another library or open source - but please reference them
   Submission:
8. Create a GitHub or similar repo and share it when finished
9. Prepare to present your algorithm, your approach, your project setup and your code, etc
