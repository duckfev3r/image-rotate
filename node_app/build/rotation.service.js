"use strict";
/** References :
 * https://github.com/oliver-moran/jimp/blob/master/packages/plugin-rotate/src/index.js
 * https://github.com/oliver-moran/jimp/blob/44ce60b5cc53ee60cd5c63d4dc0ecf26fd3d431e/packages/plugin-blit/src/index.js#L16
 * http://www.leptonica.org/rotation.html#ROTATION-BY-SAMPLING
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var image_data_service_1 = require("./image_data.service");
var RotationService = /** @class */ (function () {
    function RotationService() {
    }
    RotationService.prototype.rotate = function (img_data, angle) {
        if (typeof angle !== "number")
            throw "angle must be a number.";
        if (!img_data)
            throw "you must provide an image.";
        if (!angle)
            throw "you must supply an angle.";
        var resized = this.resize(img_data, angle);
        return this.performRotation(resized, angle);
    };
    RotationService.prototype.resize = function (img_data, angle) {
        var i_h = img_data.height, i_w = img_data.width, i_data = img_data.data;
        var rads = angle * (Math.PI / 180);
        var _a = this.getBoundingBox(i_h, i_w, rads), n_h = _a.height, n_w = _a.width;
        var new_img = new image_data_service_1.ImageData(n_h, n_w);
        var buf = new Uint8ClampedArray(new ArrayBuffer(new_img.data.length));
        var dest_y = Math.ceil((n_h - i_h) / 2);
        var dest_x = Math.ceil((n_w - i_w) / 2);
        var translateDif = this.createTranslationFunction(+(+dest_x), +(+dest_y));
        for (var y = 1; y < i_h; y++) {
            for (var x = 1; x < i_w; x++) {
                var _b = translateDif(x, y), n_x = _b.x, n_y = _b.y;
                var i_idx = (y * i_w + x) * 4;
                var dest_idx = (n_y * n_w + n_x) * 4;
                buf[dest_idx] = i_data[i_idx];
                buf[dest_idx + 1] = i_data[i_idx + 1];
                buf[dest_idx + 2] = i_data[i_idx + 2];
                buf[dest_idx + 3] = i_data[i_idx + 3];
            }
        }
        var new_image = new image_data_service_1.ImageData(n_w, n_h);
        new_image.data.set(buf);
        return new_image;
    };
    RotationService.prototype.getBoundingBox = function (height, width, radians) {
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        var w = Math.floor(Math.abs(width * cos) + Math.abs(height * sin));
        var h = Math.floor(Math.abs(width * sin) + Math.abs(height * cos));
        if (w % 2 !== 0)
            w++;
        if (h % 2 !== 0)
            h++;
        return { height: h, width: w };
    };
    RotationService.prototype.performRotation = function (img_data, angle) {
        var rads = angle * (Math.PI / 180);
        var sin = Math.sin(rads);
        var cos = Math.cos(rads);
        var i_data = img_data.data;
        var i_h = img_data.height;
        var i_w = img_data.width;
        var buf = new Uint8ClampedArray(new ArrayBuffer(img_data.data.length));
        var translate_to_cartesian = this.createTranslationFunction(-(i_w / 2), -(i_h / 2));
        var translate_to_screen = this.createTranslationFunction(i_w / 2 + 0.5, i_h / 2 + 0.5);
        for (var y = 0; y < i_h; y++) {
            for (var x = 0; x < i_w; x++) {
                var cartesian = translate_to_cartesian(x, y);
                var source = translate_to_screen(cos * cartesian.x - sin * cartesian.y, cos * cartesian.y + sin * cartesian.x);
                /** calc dest index.
                 * << bitwise operator. Shifts a in binary representation b (< 32) bits to the left, shifting in 0s from the right. */
                var dest_idx = (i_w * y + x) << 2;
                /** filter out of bounds */
                if (source.x >= 0 && source.x < i_w && source.y >= 0 && source.y < i_h) {
                    var source_idx = ((i_w * (source.y | 0) + source.x) | 0) << 2;
                    buf[dest_idx] = i_data[source_idx];
                    buf[dest_idx + 1] = i_data[source_idx + 1];
                    buf[dest_idx + 2] = i_data[source_idx + 2];
                    buf[dest_idx + 3] = i_data[source_idx + 3];
                }
            }
        }
        var new_image = new image_data_service_1.ImageData(i_w, i_h);
        new_image.data.set(buf);
        return new_image;
    };
    RotationService.prototype.createTranslationFunction = function (deltaX, deltaY) {
        return function (x, y) {
            return {
                x: x + deltaX,
                y: y + deltaY,
            };
        };
    };
    return RotationService;
}());
exports.RotationService = RotationService;
