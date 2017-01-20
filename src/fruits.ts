import { cvs_height, ctx_two, anemones } from "./init";
import { deltaTime } from "./game-loop";


enum FruitType{
  Blue = 1,
  Orange
}

class Fruits{
  num: number = 30; // 绘画果实的数量
  alive: boolean[] =[];  // 判断果实是否存活
  x : number[]= []; // 果实的 x 坐标数组
  y : number[] = []; // 果实的 y 坐标数组
  diameter : number[] = []; // 果实的直径数组
  speed: number[] = []; // 控制果实成长速度、上浮速度的数组
  fruitType: FruitType[] = []; // 控制果实类型的枚举数组
  orange = new Image(); // 黄色果实
  blue = new Image(); // 蓝色果实
  aneNum: number[] = []; // 记录出生时候所在的海葵
  constructor(){
    for (let i = 0; i < this.num; ++i) {
      this.aneNum[i] = 0; // 初始化
      this.born(i);
    }
    this.orange.src = 'assets/img/fruit.png';
    this.blue.src = 'assets/img/blue.png';
  }

  // 绘制果实
  draw(){
    for (let i = 0; i < this.num; ++i) {

      // 只有属性为存活的时候才绘制
      if(this.alive[i]){
        let img = this.fruitType[i] === FruitType.Orange ? this.orange : this.blue; // 根据类型，拿到相应的图片

        if(this.diameter[i] <= 17) {
          this.diameter[i] += this.speed[i] * deltaTime; // 随着时间半径不断变大 也就是果实长大
          this.x[i] = anemones.headx[this.aneNum[i]]
          this.y[i] = anemones.heady[this.aneNum[i]] // 得到海葵顶点的 x 和 y


        }else{
          this.y[i] -= this.speed[i] * deltaTime; // 果实成熟之后， y 坐标减小，果实开始上升
        }

        // 把果实绘制出来，为了让果实居中，所以要减去图片高度一半，宽度一半
        // 就像实现水平居中一样 left: 50px; margin-left: -(图片宽度 / 2);
        // 第一个参数 图片， 第二三个参数，坐标轴的 x 和 y，第四五个参数，图片的宽高
        ctx_two.drawImage(img, this.x[i] - this.diameter[i] / 2, this.y[i] - this.diameter[i], this.diameter[i], this.diameter[i]);


      }

      if(this.y[i] <= -10) {
        this.alive[i] = false; // 果实出去了之后 存活状态为 flase
      }

    }
  }

  // 初始化果实
  born(i){
    let aneId = Math.floor( Math.random() * anemones.num ) // 随机拿到一个果实的 ID
    this.aneNum[i] = aneId
    this.speed[i] = Math.random() * 0.04 + 0.007; // 设置速度在区间 0.003 - 0.03 里
    this.alive[i] = true; // 先设置它的存活为 true
    this.diameter[i] = 0; // 未生长出来的果实半径为0

    this.fruitType[i] = (Math.random() >= 0.7) ? FruitType.Blue : FruitType.Orange; // 设置30%的几率产生蓝色果实

  }

  // 监视果实
  monitor() : void {
    let num = 0;
    for (let i = 0; i < this.num ; ++i) {
      if(this.alive[i]) num++; // 计数存活果实的数量

      if(num < 15) {
        // 产生一个果实
        this.reset()
        return ;
      }
    }
  }

  //重置果实的状态
  reset() {
    for (let i = 0; i < this.num; ++i) {
      if(!this.alive[i]) {
        this.born(i); // 假如存活为 false ， 让它重新出生。
        return ; // 每次只重置一个果实
      }
    }
  }
  // 果实死亡
  dead(i){
    this.alive[i] = false;
  }
}


export default Fruits;

export { FruitType };
