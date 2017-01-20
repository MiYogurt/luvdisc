import { cvs_one, ctx_one } from "./init";
import { deltaTime } from "./game-loop";


export default class Socre {
  fruitNum = 0;  // 吃到果实的数量
  doubleMode = 1; // 是否开启双倍模式
  total = 0; // 总分
  gaveOver = false; // 游戏结束
  alpha = 0 // 控制游戏结束字体的透明度
  constructor() {}

  // 进行一轮计分，回到初始状态
  reset(){
    this.total += this.fruitNum * 10 * this.doubleMode;
    this.fruitNum = 0;
    this.doubleMode = 1;
  }

  // 渲染分数到界面上面去
  draw(){
    const w = cvs_one.width;
    const h = cvs_one.height;


    ctx_one.save()
    ctx_one.font = "30px 黑体";
    ctx_one.fillStyle ='white' // 设置画笔颜色
    ctx_one.textAlign = 'center' // 设置对齐方式
    ctx_one.shadowBlur = 10;  // 设置阴影
    ctx_one.shadowColor = "white"; // 设置阴影颜色

    if (this.gaveOver) {
      this.alpha += deltaTime * 0.0005
      if(this.alpha > 1) {
        this.alpha = 1
      }
      ctx_one.fillStyle = `rgba(255,255,255,${this.alpha})` // 控制颜色透明的添加动画
      ctx_one.fillText("游戏结束", w * .5, h * .5)
    }
    ctx_one.fillText("总分: "+this.total.toString() , w * .5, h - 50)
    // ctx_one.fillText(this.fruitNum.toString(), w * .5, h - 80)
    ctx_one.restore()
  }
}
