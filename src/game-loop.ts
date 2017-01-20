import { bgPic, cvs_width , cvs_height, ctx_two, ctx_one, anemones, fruits, fish_mother, fish_baby, score, wave, dust } from "./init";
import utils from "./utils";

import { FruitType } from "./fruits";


let lastTime: number = Date.now(), // 记录上一次绘制的时间
    deltaTime: number = 0; // requestAnimationFrame 执行完成所用的时间 = 当前时间 - 上一次绘制的世界

/**
 * 鱼妈妈与果实的碰撞检测
 */
function fishAndFruitsCollision() {
  for (let i = fruits.num; i >= 0; i--) {
    // 假如或者就计算鱼儿与果实的距离
    if(fruits.alive[i]) {
      // 得到距离的平方根
      const distance = utils.getDistance(
        {x: fruits.x[i], y: fruits.y[i]},
        {x: fish_mother.x, y: fish_mother.y}
      );

      // 假如距离小于 500 让果实死亡
      if(distance < 500) {
        fruits.dead(i)
        score.fruitNum++; // 计分系统的果实数加一
        if(fruits.fruitType[i] === FruitType.Blue) { // 假如吃到蓝色道具果实，开启双倍模式
          score.doubleMode = 2;
        }

        // 把鱼儿吃掉果实的位置传过去，（传鱼的坐标或者果实坐标都可以）
        wave.born(fruits.x[i], fruits.y[i])
      }
    }
  }
}

/**
 * 鱼妈妈与鱼宝宝的碰撞检测
 */
function fishMotherAndBabyCollision() {

    // 得到距离的平方根
    const distance = utils.getDistance(
      {x: fish_baby.x, y: fish_baby.y},
      {x: fish_mother.x, y: fish_mother.y}
    );

    // 假如距离小于 900 就喂食给 baby，且必须要鱼妈妈吃到了果实才能喂给小鱼
    if (distance < 900 && score.fruitNum != 0) {
      fish_baby.recover();

      // 把能力给小鱼，果实数清零，计算分数一次
      score.reset()

      // 把大鱼的 bodyindex 恢复成 0
      fish_mother.BodyIndex = 0;

      wave.born(fish_baby.x, fish_baby.y, true) // 出生一个波浪
    }

}

function gameLoop() {
  const now = Date.now()
  deltaTime = now - lastTime;
  lastTime = now;

  //  给 deltaTime 设置上线
  if(deltaTime > 40) deltaTime = 40;

  // console.log(deltaTime);

  drawBackbround()  // 画背景图片

  anemones.draw()  // 海葵绘制
  fruits.draw()  // 果实绘制
  fruits.monitor() // 监视果实，让死去的果实得到新生

  ctx_one.clearRect(0, 0, cvs_width, cvs_width); // 清除掉所有，再进行绘制，要不然的话会多次绘制而进行重叠。
  fish_baby.draw() // 绘制鱼宝宝
  fish_mother.draw() // 绘制鱼妈妈

  if(!score.gaveOver) {
    fishAndFruitsCollision() // 每一帧都进行碰撞检测
    fishMotherAndBabyCollision()
  }


  score.draw() // 绘制分数
  wave.draw()
  dust.draw()
  requestAnimationFrame(gameLoop); // 不断的循环 gameLoop，且流畅性提升
}


function drawBackbround() {
  ctx_two.drawImage(bgPic, 0, 0, cvs_width, cvs_height)
}

export { deltaTime }

export default gameLoop;
