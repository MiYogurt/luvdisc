import { ctx_two, cvs_height } from "./init";
import { deltaTime } from "./game-loop";

class Anemones{
  rootx: number[] = [];  // x 轴的坐标
  headx: number[] = [];  // 海葵头部的 x
  heady: number[] = []; // 海葵头部的 y

  num = 50; // 绘制数量

  alpha = 0 // 角度
  amp: number[] = [] // 振幅
  opacity: number[] = [] // 透明度
  /**
   * 其实就跟在 PS 里面画一样，只不过都是通过代码进行操作，不能通过鼠标进行操作。
   *
   * save() - restore() 做作用就是只对他们之间的代码应用这些画笔样式
   *
   * save() 就相当于暂存一下画笔的状态。开启一个快照，可以对这个快照进行任何操作
   *
   * restore() 恢复之前画笔的状态
   */
  draw(){
    this.alpha += deltaTime * 0.001; // 角度随时间变化
    let l = Math.sin(this.alpha)

    ctx_two.save() // 暂存画笔状态
    // 设置画笔样式

    ctx_two.strokeStyle = '#3b154e' // 设置画笔颜色
    ctx_two.lineWidth = 20; // 画笔的宽度
    ctx_two.lineCap = "round" // 圆角的线


    for (let i = 0; i < this.num; ++i) {

      this.headx[i] = this.rootx[i] + l * this.amp[i]

      ctx_two.beginPath() // 开始绘画
      ctx_two.globalAlpha = this.opacity[i]
      ctx_two.moveTo(this.rootx[i], cvs_height) // 把画笔移动到 x 点，画布的最下方出，从下往上画海葵
      ctx_two.quadraticCurveTo(
        this.rootx[i], cvs_height - 100, // 控制点
        this.headx[i], this.heady[i] // 结束点
        )
      ctx_two.stroke() // 确认，开始渲染
    }
    ctx_two.restore() // 恢复之前暂存的画笔状态

  }
  /**
   * 初始化海葵的 x 坐标和高度
   */
  constructor(){
    for (let i = 0; i < this.num; ++i) {
      this.rootx[i] = i * 16 + Math.random() * 20;
      this.headx[i] = this.rootx[i];
      this.heady[i] = cvs_height - 240 + Math.random() * 80;
      this.amp[i] = 20 + Math.random() * 30 // 设置振幅
      this.opacity[i] = (Math.random() * .6) + 0.6
    }
  }
}

export default Anemones;
