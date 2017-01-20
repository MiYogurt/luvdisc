import { ctx_one } from "./init";
import { deltaTime } from "./game-loop";


class Wave {
  x: number[] = [];
  y: number[] = [];
  alive: boolean[] = [];
  radius: number[] = []
  type: boolean[] = [];
  num = 30 // 定义30个 wave 等待使用

 constructor() {
   for (let i = this.num; i >= 0; i-- ) {
     this.alive[i] = false
     this.type[i] = false;
     this.radius[i] = 0;
   }
 }

 draw(){
   for (let i = this.num; i >= 0; i--) {
     if(this.alive[i]) { // 假如是的存活，开始绘制一个逐渐变大的 ○

       if(this.radius[i] > 50) { // 假如半径大于 50 让它死亡
         this. alive[i] = false
         continue;
       }

       ctx_one.save()
       ctx_one.shadowBlur = 5;
       ctx_one.shadowColor = 'white';
       ctx_one.lineWidth = 2;

       if(this.type[i]) { // true 代表小鱼与大鱼碰撞
         this.radius[i] += deltaTime * 0.04;
         const alpha = 1 - (this.radius[i] / 80)
         ctx_one.strokeStyle = `rgba(203,91,0,${alpha})`
       }else{
         this.radius[i] += deltaTime * 0.05;
         const alpha = 1 - (this.radius[i] / 50)
         ctx_one.strokeStyle = `rgba(255,255,255,${alpha})`
       }

       ctx_one.beginPath()
       ctx_one.arc(this.x[i], this.y[i], this.radius[i], 0, 2 * Math.PI)
       ctx_one.closePath()
       ctx_one.stroke()
       ctx_one.restore()
     }
   }
 }

 born(x: number,y: number, type = false){
   for (let i = this.num; i >= 0; i--) {
     // 找到第一个没有存活的，让他复活。
     if (!this.alive[i]) {
       this.alive[i] = true // 存活代表显示出来
       this.radius[i] = 20;
       this.x[i] = x;
       this.y[i] = y;
       this.type[i] = type // 设置类型为 true; 当为 true 的时候，代表鱼妈妈与鱼宝宝碰撞
       return ;
     }
   }
 }
}

export default Wave;
