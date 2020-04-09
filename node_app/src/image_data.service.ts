export class ImageData {
    data: Uint8ClampedArray
    width: number
    height: number
    constructor(width: number, height: number) {
        const length = width * height * 4
        this.data = new Uint8ClampedArray(new ArrayBuffer(length))
        this.width = width
		this.height = height
	}
}
