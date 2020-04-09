import React, { Ref } from "react"
import logo from "./logo.svg"
import "./App.css"
import { RotationService } from "./rotation.service"
var Uint8ClampedArray = require("typedarray").Uint8ClampedArray
const Buffer = require("buffer").Buffer
global.Buffer = Buffer
const jpeg = require("jpeg-js")

class App extends React.Component {
    state
    fileRef
    canvasRef
    rotationService = new RotationService()

    constructor(props) {
        super(props)
        this.state = { angle: 90 }
        this.fileRef = React.createRef()
        this.canvasRef = React.createRef()
    }

    rotateImage = () => {
        const start = performance.now()
        try {
            const rotated_image = this.rotationService.rotate(this.state.img, this.state.angle)
            this.putImageData(rotated_image)
            const finish = performance.now()
            this.setState({ ms: finish - start })
        } catch (err) {
            alert(err)
        }
    }

    async componentDidMount() {
        const b64_string = localStorage.getItem("b64_string")
        if (b64_string) {
            const img = await this.getImgData(b64_string)
            this.setState({ img })
        }
    }

    putImageData = (image: ImageData) => {
        this.canvasRef.current.height = image.height
        this.canvasRef.current.width = image.width
        const ctx = this.canvasRef.current.getContext("2d")
        ctx.putImageData(image, 0, 0)
    }

    readFile = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (img: ProgressEvent<any>) => {
                resolve(img.target.result)
            }
            reader.onerror = (err: any) => {
                reject(err)
            }
            reader.readAsDataURL(file)
        })
    }

    getImgData = async (base64_img: string): Promise<ImageData> => {
        return new Promise((resolve, reject) => {
            const canvas: HTMLCanvasElement = this.canvasRef.current
            const context2d = canvas.getContext("2d") as CanvasRenderingContext2D
            const i = new Image()
            i.onload = () => {
                const { width, height } = i
                canvas.width = width
                canvas.height = height
                context2d.drawImage(i, 0, 0, width, height)
                const data = context2d.getImageData(0, 0, width, height)
                resolve(data)
            }
            i.onerror = (err) => {
                reject(err)
            }
            i.src = base64_img
        })
    }

    updateAngle = (e) => {
        this.setState({ angle: parseInt(e.target.value) })
    }

    handleChange = async () => {
        try {
            const file = this.fileRef.current.files[0]
            if (!file) return
            const b64_string = (await this.readFile(file)) as string
			localStorage.setItem("b64_string", b64_string)
			console.log(b64_string)
            const img = await this.getImgData(b64_string)
            this.setState({ img })
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <div className="App">
                <div style={{ position: "absolute", bottom: "15px", left: "15px" }}>
                    <div style={{ padding: "30px" }}>
                        <input ref={this.fileRef} type="file" id="myfile" name="myfile" onChange={this.handleChange} />
                    </div>
                    <button onClick={this.rotateImage}>
                        <h1>ROTATE</h1>
                    </button>
                    <label>
                        <h1>{this.state.angle}°</h1>
                    </label>
                    <input value={this.state.angle} onChange={this.updateAngle} type="range" min="-720" max="720" />
                    {this.state.ms ? (
                        <div>
                            <h1>Benchmark : </h1>
                            <h1 style={{ color: "blue" }}>{this.state.ms} ms</h1>
                        </div>
                    ) : (
                        ""
                    )}
                </div>

                <div>
                    <canvas style={{ border: "1px solid blue" }} ref={this.canvasRef}></canvas>
                </div>
            </div>
        )
    }
}

export default App
