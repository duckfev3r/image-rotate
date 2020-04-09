"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImageData = /** @class */ (function () {
    function ImageData(width, height) {
        var length = width * height * 4;
        this.data = new Uint8ClampedArray(new ArrayBuffer(length));
        this.width = width;
        this.height = height;
    }
    return ImageData;
}());
exports.ImageData = ImageData;
