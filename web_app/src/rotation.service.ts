/** References :
 * https://github.com/oliver-moran/jimp/blob/master/packages/plugin-rotate/src/index.js
 * https://github.com/oliver-moran/jimp/blob/44ce60b5cc53ee60cd5c63d4dc0ecf26fd3d431e/packages/plugin-blit/src/index.js#L16
 * http://www.leptonica.org/rotation.html#ROTATION-BY-SAMPLING
 * 
 */

export class RotationService {
    public rotate(img_data: ImageData, angle: number): ImageData {

		if (typeof angle !== "number") throw "angle must be a number."
        if (!img_data) throw "you must provide an image."
        if (!angle) throw "you must supply an angle."

		const resized = this.resize(img_data, angle)
        return this.performRotation(resized, angle)
    }

    public resize(img_data: ImageData, angle: number): ImageData {
        const { height: i_h, width: i_w, data: i_data } = img_data
        const rads = angle * (Math.PI / 180)

        const { height: n_h, width: n_w } = this.getBoundingBox(i_h, i_w, rads)
        const new_img = new ImageData(n_h, n_w)
        const buf = new Uint8ClampedArray(new ArrayBuffer(new_img.data.length))

        const dest_y = Math.ceil((n_h - i_h) / 2)
        const dest_x = Math.ceil((n_w - i_w) / 2)

        const translateDif = this.createTranslationFunction(+(+dest_x), +(+dest_y))

        for (let y = 1; y < i_h; y++) {
            for (let x = 1; x < i_w; x++) {
                const { x: n_x, y: n_y } = translateDif(x, y)
                const i_idx = (y * i_w + x) * 4
                const dest_idx = (n_y * n_w + n_x) * 4
                buf[dest_idx] = i_data[i_idx]
                buf[dest_idx + 1] = i_data[i_idx + 1]
                buf[dest_idx + 2] = i_data[i_idx + 2]
                buf[dest_idx + 3] = i_data[i_idx + 3]
            }
        }
        const new_image = new ImageData(n_w, n_h)
        new_image.data.set(buf)
        return new_image
    }

    private getBoundingBox(height: number, width: number, radians: number): { height: number; width: number } {

        const sin = Math.sin(radians)
        const cos = Math.cos(radians)

        let w = Math.floor(Math.abs(width * cos) + Math.abs(height * sin))
        let h = Math.floor(Math.abs(width * sin) + Math.abs(height * cos))
        if (w % 2 !== 0) w++
        if (h % 2 !== 0) h++
        return { height: h, width: w }
    }

    private performRotation(img_data: ImageData, angle: number): ImageData {
        const rads = angle * (Math.PI / 180)
        const sin = Math.sin(rads)
        const cos = Math.cos(rads)

        const i_data = img_data.data
        const i_h = img_data.height
        const i_w = img_data.width

        const buf = new Uint8ClampedArray(new ArrayBuffer(img_data.data.length))

        const translate_to_cartesian = this.createTranslationFunction(-(i_w / 2), -(i_h / 2))
        const translate_to_screen = this.createTranslationFunction(i_w / 2 + 0.5, i_h / 2 + 0.5)

        for (let y = 0; y < i_h; y++) {
            for (let x = 0; x < i_w; x++) {
                const cartesian = translate_to_cartesian(x, y)
                const source = translate_to_screen(cos * cartesian.x - sin * cartesian.y, cos * cartesian.y + sin * cartesian.x)

                /** calc dest index.
                 * << bitwise operator. Shifts a in binary representation b (< 32) bits to the left, shifting in 0s from the right. */
                const dest_idx = (i_w * y + x) << 2

                /** filter out of bounds */
                if (source.x >= 0 && source.x < i_w && source.y >= 0 && source.y < i_h) {
                    const source_idx = ((i_w * (source.y | 0) + source.x) | 0) << 2
                    buf[dest_idx] = i_data[source_idx]
                    buf[dest_idx + 1] = i_data[source_idx + 1]
                    buf[dest_idx + 2] = i_data[source_idx + 2]
                    buf[dest_idx + 3] = i_data[source_idx + 3]
                }
            }
        }
        const new_image = new ImageData(i_w, i_h)
        new_image.data.set(buf)
        return new_image
    }

    private createTranslationFunction(deltaX: number, deltaY: number) {
        return (x: number, y: number) => {
            return {
                x: x + deltaX,
                y: y + deltaY,
            }
        }
    }
}
