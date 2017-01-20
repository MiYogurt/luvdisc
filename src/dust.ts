import { cvs_height, cvs_width, ctx_one } from "./init";
import { deltaTime } from "./game-loop";


class Dust {
  dustPic: Array<HTMLImageElement> = []
  x: number[] = [];
  y: number[] = [];
  amp: number[] = [];
  No: number[] = []; // 渲染哪一张图片
  alpha = 0.6; // 角度
  num = 30 // 数量
  constructor() {
    for (var i = 0; i < 7; ++i) {
      this.dustPic[i] = new Image()
      this.dustPic[i].src = `assets/img/dust${i}.png`;
    }

    for (let i = 0; i < this.num; ++i) {
      this.x[i] = Math.random() * cvs_width;
      this.y[i] = Math.random() * cvs_height;
      this.amp[i] = 20 + Math.random() * 15;

      this.No[i] = Math.floor(Math.random() * 7)
    }
    this.alpha = 0
  }

  draw(){
    this.alpha += deltaTime * 0.001
    const l = Math.sin(this.alpha)
    for (let i = 0; i < this.num; ++i) {
      let no = this.No[i];
      ctx_one.drawImage(this.dustPic[this.No[i]], this.x[i] + l * this.amp[i] ,this.y[i])
    }
  }
}

export default Dust;
