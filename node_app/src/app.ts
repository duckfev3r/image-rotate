import fs from "fs"
import { RotationService } from "./rotation.service"
import { ImageData } from "./image_data.service"
const sizeOf = require("image-size")

const dimensions = sizeOf("miaow.jpeg")
const img_buffer = fs.readFileSync("miaow.jpeg")
const buf = new Uint8ClampedArray(img_buffer)
const to_rotate = new ImageData(dimensions.width, dimensions.height)
to_rotate.data.set(buf)

const rotationService = new RotationService()

const start = Date.now()
const rotated = rotationService.rotate(to_rotate, 360)
const end = Date.now()

console.log(`__________________________________________________`)
console.log(`Rotate Operation Completed in ${end - start} ms`)
console.log(`__________________________________________________`)
console.log(`Old Dimensions : h ${dimensions.height}, w ${dimensions.width}`)
console.log(`New Dimensions : h ${rotated.height}, w ${rotated.width}`)
