import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

let noiseMax = 5;
let aoff = 0;

export default class P5Renderer implements BaseRenderer{

    colors = ['#4EEC6C', '#FFEB34', '#00A7FF', '#FF6100', '#FF0053'];
    backgroundColor = '#FFFFFF';
    items: any = [];

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    maxSize = 10;
    completeCallback: any;
    delta = 0;
    color = this.colors[0];
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);

    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        s.background(0, 0, 0, 255);
        s.frameRate(15);
        //s.noLoop();
    }

    protected draw(s) {
        if (this.animating) {

            s.blendMode(s.BLEND);
            s.background(0, 0, 0, 15);

            s.blendMode(s.ADD);
            s.fill(0, 0);
            //s.stroke(255, 116, 40, 255); //orange
            s.stroke(40, 100, 255, 255);   //blue
            s.strokeWeight(0.2)

            s.translate(s.width/2, s.height/2);

            for (let i = 0; i < 10; i++) {
                let minRadius = 70;
                let maxRadius = 120;// + s.sin(aoff) * 10;

                s.beginShape();
                for (let a = 0; a < s.TWO_PI; a += 0.001) {
                    let xoff = s.map(s.cos(a), -1, 1, 0, noiseMax) +
                                     s.map(s.cos(aoff), -1, 1, 0, noiseMax);
    
                    let yoff = s.map(s.sin(a), -1, 1, 0, noiseMax) +
                                     s.map(s.sin(aoff), -1, 1, 0, noiseMax);
    
                    let r = s.map(s.noise(xoff, yoff), 0, 1, minRadius, maxRadius);
                    let x = r * s.cos(a);
                    let y = r * s.sin(a);
                    s.vertex(x, y);
                }
                aoff += 0.01;
                s.endShape(s.CLOSE)
            }

        }

    }

    public render() {

    }

    public play() {
        this.animating = true;
        setTimeout(() => {
            if (this.completeCallback) {
                this.completeCallback();
            }
        }, 10000);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

}