import './index.less';

import BaseRecorder from './recorders/baseRecorder';
import CCaptureRecorder from './recorders/ccaptureRecorder';
import saveThumbnail from './recorders/thumbnailCapture';
import { BaseRenderer } from './renderers/baseRenderer';
import DebugUI from './debug/ui';
import P5Renderer from './renderers/p5Renderer';

class App {
    debug: DebugUI;
    renderer: BaseRenderer;
    recorder: BaseRecorder;

    constructor() {        
        const creator = new URLSearchParams(window.location.search).get('creator')
        const viewer = new URLSearchParams(window.location.search).get('viewer')

        let width = window.innerWidth;
        let height = window.innerHeight;

        
        if (creator !== null) {
            width = 300;
            height = 300;
            this.debug = new DebugUI();
            this.debug.recordBtn.addEventListener('click', () => this.handleRecordBtnClick())
            this.debug.formatSelect.addEventListener('change', () => this.handleFormatSelectChange())

            this.recorder = new CCaptureRecorder();
        }

        this.renderer = new P5Renderer(width, height);

        this.animation();
    }

    handleRecordBtnClick() {
        if (this.debug.formatSelect.value == 'thumbnail') {
            saveThumbnail(this.renderer.canvas);
        } else {
            if (this.recorder) {
                this.recorder.setCanvas(this.renderer.canvas);
                this.recorder.start();
            }

            this.renderer.play();
            this.renderer.setCompleteCallback(() => this.handleComplete());
        }
    }

    handleFormatSelectChange() {
        if (this.debug.formatSelect.value !== 'thumbnail') {
            this.recorder.setFormat(this.debug.formatSelect.value);
        }
    }

    handleComplete() {
        if (this.recorder) {
            this.recorder.stop();
        }
        this.renderer.stop();
    }

    animation() {
        this.renderer.render();
        if (this.recorder) {
            this.recorder.update();
        }
        requestAnimationFrame(() => this.animation());
    }
    
}

new App();