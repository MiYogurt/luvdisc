(function () {
'use strict';

class Anemones {
    /**
     * 初始化海葵的 x 坐标和高度
     */
    constructor() {
        this.rootx = []; // x 轴的坐标
        this.headx = []; // 海葵头部的 x
        this.heady = []; // 海葵头部的 y
        this.num = 50; // 绘制数量
        this.alpha = 0; // 角度
        this.amp = []; // 振幅
        this.opacity = []; // 透明度
        for (let i = 0; i < this.num; ++i) {
            this.rootx[i] = i * 16 + Math.random() * 20;
            this.headx[i] = this.rootx[i];
            this.heady[i] = cvs_height - 240 + Math.random() * 80;
            this.amp[i] = 20 + Math.random() * 30; // 设置振幅
            this.opacity[i] = (Math.random() * .6) + 0.6;
        }
    }
    /**
     * 其实就跟在 PS 里面画一样，只不过都是通过代码进行操作，不能通过鼠标进行操作。
     *
     * save() - restore() 做作用就是只对他们之间的代码应用这些画笔样式
     *
     * save() 就相当于暂存一下画笔的状态。开启一个快照，可以对这个快照进行任何操作
     *
     * restore() 恢复之前画笔的状态
     */
    draw() {
        this.alpha += deltaTime * 0.001; // 角度随时间变化
        let l = Math.sin(this.alpha);
        ctx_two.save(); // 暂存画笔状态
        // 设置画笔样式
        ctx_two.strokeStyle = '#3b154e'; // 设置画笔颜色
        ctx_two.lineWidth = 20; // 画笔的宽度
        ctx_two.lineCap = "round"; // 圆角的线
        for (let i = 0; i < this.num; ++i) {
            this.headx[i] = this.rootx[i] + l * this.amp[i];
            ctx_two.beginPath(); // 开始绘画
            ctx_two.globalAlpha = this.opacity[i];
            ctx_two.moveTo(this.rootx[i], cvs_height); // 把画笔移动到 x 点，画布的最下方出，从下往上画海葵
            ctx_two.quadraticCurveTo(this.rootx[i], cvs_height - 100, // 控制点
            this.headx[i], this.heady[i] // 结束点
            );
            ctx_two.stroke(); // 确认，开始渲染
        }
        ctx_two.restore(); // 恢复之前暂存的画笔状态
    }
}

var FruitType;
(function (FruitType) {
    FruitType[FruitType["Blue"] = 1] = "Blue";
    FruitType[FruitType["Orange"] = 2] = "Orange";
})(FruitType || (FruitType = {}));
class Fruits {
    constructor() {
        this.num = 30; // 绘画果实的数量
        this.alive = []; // 判断果实是否存活
        this.x = []; // 果实的 x 坐标数组
        this.y = []; // 果实的 y 坐标数组
        this.diameter = []; // 果实的直径数组
        this.speed = []; // 控制果实成长速度、上浮速度的数组
        this.fruitType = []; // 控制果实类型的枚举数组
        this.orange = new Image(); // 黄色果实
        this.blue = new Image(); // 蓝色果实
        this.aneNum = []; // 记录出生时候所在的海葵
        for (let i = 0; i < this.num; ++i) {
            this.aneNum[i] = 0; // 初始化
            this.born(i);
        }
        this.orange.src = 'assets/img/fruit.png';
        this.blue.src = 'assets/img/blue.png';
    }
    // 绘制果实
    draw() {
        for (let i = 0; i < this.num; ++i) {
            // 只有属性为存活的时候才绘制
            if (this.alive[i]) {
                let img = this.fruitType[i] === FruitType.Orange ? this.orange : this.blue; // 根据类型，拿到相应的图片
                if (this.diameter[i] <= 17) {
                    this.diameter[i] += this.speed[i] * deltaTime; // 随着时间半径不断变大 也就是果实长大
                    this.x[i] = anemones.headx[this.aneNum[i]];
                    this.y[i] = anemones.heady[this.aneNum[i]]; // 得到海葵顶点的 x 和 y
                }
                else {
                    this.y[i] -= this.speed[i] * deltaTime; // 果实成熟之后， y 坐标减小，果实开始上升
                }
                // 把果实绘制出来，为了让果实居中，所以要减去图片高度一半，宽度一半
                // 就像实现水平居中一样 left: 50px; margin-left: -(图片宽度 / 2);
                // 第一个参数 图片， 第二三个参数，坐标轴的 x 和 y，第四五个参数，图片的宽高
                ctx_two.drawImage(img, this.x[i] - this.diameter[i] / 2, this.y[i] - this.diameter[i], this.diameter[i], this.diameter[i]);
            }
            if (this.y[i] <= -10) {
                this.alive[i] = false; // 果实出去了之后 存活状态为 flase
            }
        }
    }
    // 初始化果实
    born(i) {
        let aneId = Math.floor(Math.random() * anemones.num); // 随机拿到一个果实的 ID
        this.aneNum[i] = aneId;
        this.speed[i] = Math.random() * 0.04 + 0.007; // 设置速度在区间 0.003 - 0.03 里
        this.alive[i] = true; // 先设置它的存活为 true
        this.diameter[i] = 0; // 未生长出来的果实半径为0
        this.fruitType[i] = (Math.random() >= 0.7) ? FruitType.Blue : FruitType.Orange; // 设置30%的几率产生蓝色果实
    }
    // 监视果实
    monitor() {
        let num = 0;
        for (let i = 0; i < this.num; ++i) {
            if (this.alive[i])
                num++; // 计数存活果实的数量
            if (num < 15) {
                // 产生一个果实
                this.reset();
                return;
            }
        }
    }
    //重置果实的状态
    reset() {
        for (let i = 0; i < this.num; ++i) {
            if (!this.alive[i]) {
                this.born(i); // 假如存活为 false ， 让它重新出生。
                return; // 每次只重置一个果实
            }
        }
    }
    // 果实死亡
    dead(i) {
        this.alive[i] = false;
    }
}

/**
 * 按照一定的 ratio 比率趋近于目标值，当目标值与当前值距离越大，他们相差就越大。
 * @param  {number} aim   目标值
 * @param  {number} cur   当前值
 * @param  {number} ratio 百分比
 * @return {number} 趋近于目标值的值
 */
function lerpDistance(aim, cur, ratio) {
    var delta = cur - aim; // 当前值与目标值的距离
    return aim + delta * ratio;
}
function lerpAngle(aim, cur, ratio) {
    var delta = cur - aim;
    // 当角度差超过一个 180 度的时候，也就是 PI，无论是正时针，还是逆时针。
    // 因为旋转超过 180 度，我们可以反方向旋转，这样旋转的角度会小一点。
    // 例如：当我们需要顺时针旋转 270 度的时候，我们可以反向旋转 90 度来解决问题。也就是 [ -90 = 270 - 360 ].
    if (delta > Math.PI)
        delta = delta - 2 * Math.PI;
    if (delta < -Math.PI)
        delta = delta + 2 * Math.PI;
    return aim + delta * ratio;
}
/**
 * 计算俩个点的距离
 * @param {Pointer} p1 坐标点
 * @param {Pointer} p2 坐标点
 * @returns 距离的平方根
 */
function getDistance(p1, p2) {
    return Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2);
}
var utils = {
    lerpDistance,
    lerpAngle,
    getDistance
};

class FishMother {
    constructor() {
        this.x = cvs_width / 2; // 坐标轴 x
        this.y = cvs_height / 2; // 坐标轴 y
        this.bigEye = []; // 眼睛
        this.bigBody = []; // 身体
        this._pBigBody = []; // 只属于鱼妈妈的特殊颜色身体
        this.BigTail = []; // 尾巴
        this.angle = 0; // 鱼的角度
        this.EyeIndex = 0; // 需要渲染哪个眼睛的索引值
        this.BodyIndex = 0;
        this.TailIndex = 0;
        this.EyeTimer = 0; // 计算眼睛时间
        this.BodyTimer = 0;
        this.TailTimer = 0;
        this.EyeInterval = 300; // 通过这个变量动态的设置眨眼睛的间隔
        this.BodyInterval = 1000;
        this.TailInterval = 50;
        for (let i = 0; i < 2; ++i) {
            this.bigEye[i] = new Image();
            this.bigEye[i].src = `assets/img/bigEye${i}.png`;
        }
        for (let i = 0; i < 8; ++i) {
            this._pBigBody[i] = new Image();
            this._pBigBody[i].src = `assets/img/bigSwimBlue${i}.png`;
        }
        for (let i = 0; i < 8; ++i) {
            this.bigBody[i] = new Image();
            this.bigBody[i].src = `assets/img/bigSwim${i}.png`;
        }
        for (let i = 0; i < 8; ++i) {
            this.BigTail[i] = new Image();
            this.BigTail[i].src = `assets/img/bigTail${i}.png`;
        }
    }
    checkImageIndex() {
        this.EyeTimer += deltaTime;
        this.TailTimer += deltaTime;
        this.BodyTimer += deltaTime;
        // 当计时器大于某个值的时候才进行修改
        if (this.EyeTimer > this.EyeInterval) {
            this.EyeIndex = (this.EyeIndex + 1) % 2;
            // 重置一下定时器
            this.EyeTimer %= this.EyeInterval;
            // 判断是眨眼的哪个过程
            if (this.EyeIndex === 0) {
                this.EyeInterval = Math.random() * 1500 + 2000; // 设置下一次眨眼的间隔长一点
            }
            else {
                // 先闭眼后睁眼，这个过程应该非常短
                this.EyeInterval = 300;
            }
        }
        if (this.TailTimer > this.TailInterval) {
            this.TailIndex = (this.TailIndex + 1) % 8;
            this.TailTimer %= this.TailInterval;
        }
        if (this.BodyTimer > this.BodyInterval) {
            this.BodyIndex = this.BodyIndex + 1;
            this.BodyTimer %= this.BodyInterval;
            if (this.BodyIndex > 7) {
                this.BodyIndex = 7;
            }
        }
    }
    checkMove() {
        this.x = utils.lerpDistance(mouse_x, this.x, .95);
        this.y = utils.lerpDistance(mouse_y, this.y, .95);
        let instance_X = mouse_x - this.x; // 边 a
        let instance_Y = mouse_y - this.y; // 边 b
        let ag = Math.atan2(instance_Y, instance_X) + Math.PI; // [-PI, PI]
        this.angle = utils.lerpAngle(ag, this.angle, .9);
    }
    draw() {
        this.checkMove();
        this.checkImageIndex();
        ctx_one.save();
        ctx_one.translate(this.x, this.y); // 定义相对定位的坐标中心点
        ctx_one.rotate(this.angle);
        ctx_one.scale(.8, .8);
        ctx_one.drawImage(this.BigTail[this.TailIndex], -this.BigTail[this.TailIndex].width / 2 + 30, -this.BigTail[this.TailIndex].height / 2); // 这里的尾巴，往右移动30像素，让它在身体的后面。
        if (score.doubleMode === 2) {
            ctx_one.drawImage(this._pBigBody[this.BodyIndex], -this._pBigBody[this.BodyIndex].width / 2, -this._pBigBody[this.BodyIndex].height / 2);
        }
        else {
            ctx_one.drawImage(this.bigBody[this.BodyIndex], -this.bigBody[this.BodyIndex].width / 2, -this.bigBody[this.BodyIndex].height / 2);
        }
        ctx_one.drawImage(this.bigEye[this.EyeIndex], -this.bigEye[this.EyeIndex].width / 2, -this.bigEye[this.EyeIndex].height / 2); // 居中，所以向左移动宽度的一半，向上移动宽度的一半
        ctx_one.restore();
    }
}
// 鱼宝宝
class FishBaby extends FishMother {
    constructor() {
        super();
        this.x = cvs_width / 2 + 50; // 坐标轴 x
        this.y = cvs_height / 2 + 50; // 坐标轴 y
        this.BodyInterval = 300;
        for (let i = 0; i < 2; ++i) {
            this.bigEye[i] = new Image();
            this.bigEye[i].src = `assets/img/babyEye${i}.png`;
        }
        for (let i = 0; i < 20; ++i) {
            this.bigBody[i] = new Image();
            this.bigBody[i].src = `assets/img/babyFade${i}.png`;
        }
        for (let i = 0; i < 8; ++i) {
            this.BigTail[i] = new Image();
            this.BigTail[i].src = `assets/img/babyTail${i}.png`;
        }
    }
    checkImageIndex() {
        this.EyeTimer += deltaTime;
        this.TailTimer += deltaTime;
        this.BodyTimer += deltaTime;
        // 当计时器大于某个值的时候才进行修改
        if (this.EyeTimer > this.EyeInterval) {
            this.EyeIndex = (this.EyeIndex + 1) % 2;
            // 重置一下定时器
            this.EyeTimer %= this.EyeInterval;
            // 判断是眨眼的哪个过程
            if (this.EyeIndex === 0) {
                this.EyeInterval = Math.random() * 1500 + 2000; // 设置下一次眨眼的间隔长一点
            }
            else {
                // 先闭眼后睁眼，这个过程应该非常短
                this.EyeInterval = 300;
            }
        }
        if (this.TailTimer > this.TailInterval) {
            this.TailIndex = (this.TailIndex + 1) % 8;
            this.TailTimer %= this.TailInterval;
        }
        if (this.BodyTimer > this.BodyInterval) {
            this.BodyIndex = this.BodyIndex + 1;
            this.BodyTimer %= this.BodyInterval;
            if (this.BodyIndex > 19) {
                this.BodyIndex = 19;
                // console.log('game over');
                score.gaveOver = true;
            }
        }
    }
    // 重置身体的图片，也就是得到能量满血复活
    recover() {
        this.BodyIndex = 0;
    }
    checkMove() {
        this.x = utils.lerpDistance(fish_mother.x, this.x, .98);
        this.y = utils.lerpDistance(fish_mother.y, this.y, .98);
        let instance_X = fish_mother.x - this.x; // 边 a
        let instance_Y = fish_mother.y - this.y; // 边 b
        let ag = Math.atan2(instance_Y, instance_X) + Math.PI; // [-PI, PI]
        this.angle = utils.lerpAngle(ag, this.angle, .7);
    }
    draw() {
        this.checkMove();
        this.checkImageIndex();
        ctx_one.save();
        ctx_one.translate(this.x, this.y); // 定义相对定位的坐标中心点
        ctx_one.rotate(this.angle);
        ctx_one.scale(.8, .8);
        ctx_one.drawImage(this.BigTail[this.TailIndex], -this.BigTail[this.TailIndex].width / 2 + 24, -this.BigTail[this.TailIndex].height / 2); // 这里的尾巴，往右移动30像素，让它在身体的后面。
        ctx_one.drawImage(this.bigBody[this.BodyIndex], -this.bigBody[this.BodyIndex].width / 2, -this.bigBody[this.BodyIndex].height / 2);
        ctx_one.drawImage(this.bigEye[this.EyeIndex], -this.bigEye[this.EyeIndex].width / 2, -this.bigEye[this.EyeIndex].height / 2); // 居中，所以向左移动宽度的一半，向上移动宽度的一半
        ctx_one.restore();
    }
}

class Socre {
    constructor() {
        this.fruitNum = 0; // 吃到果实的数量
        this.doubleMode = 1; // 是否开启双倍模式
        this.total = 0; // 总分
        this.gaveOver = false; // 游戏结束
        this.alpha = 0; // 控制游戏结束字体的透明度
    }
    // 进行一轮计分，回到初始状态
    reset() {
        this.total += this.fruitNum * 10 * this.doubleMode;
        this.fruitNum = 0;
        this.doubleMode = 1;
    }
    // 渲染分数到界面上面去
    draw() {
        const w = cvs_one.width;
        const h = cvs_one.height;
        ctx_one.save();
        ctx_one.font = "30px 黑体";
        ctx_one.fillStyle = 'white'; // 设置画笔颜色
        ctx_one.textAlign = 'center'; // 设置对齐方式
        ctx_one.shadowBlur = 10; // 设置阴影
        ctx_one.shadowColor = "white"; // 设置阴影颜色
        if (this.gaveOver) {
            this.alpha += deltaTime * 0.0005;
            if (this.alpha > 1) {
                this.alpha = 1;
            }
            ctx_one.fillStyle = `rgba(255,255,255,${this.alpha})`; // 控制颜色透明的添加动画
            ctx_one.fillText("游戏结束", w * .5, h * .5);
        }
        ctx_one.fillText("总分: " + this.total.toString(), w * .5, h - 50);
        // ctx_one.fillText(this.fruitNum.toString(), w * .5, h - 80)
        ctx_one.restore();
    }
}

class Wave {
    constructor() {
        this.x = [];
        this.y = [];
        this.alive = [];
        this.radius = [];
        this.type = [];
        this.num = 30; // 定义30个 wave 等待使用
        for (let i = this.num; i >= 0; i--) {
            this.alive[i] = false;
            this.type[i] = false;
            this.radius[i] = 0;
        }
    }
    draw() {
        for (let i = this.num; i >= 0; i--) {
            if (this.alive[i]) {
                if (this.radius[i] > 50) {
                    this.alive[i] = false;
                    continue;
                }
                ctx_one.save();
                ctx_one.shadowBlur = 5;
                ctx_one.shadowColor = 'white';
                ctx_one.lineWidth = 2;
                if (this.type[i]) {
                    this.radius[i] += deltaTime * 0.04;
                    const alpha = 1 - (this.radius[i] / 80);
                    ctx_one.strokeStyle = `rgba(203,91,0,${alpha})`;
                }
                else {
                    this.radius[i] += deltaTime * 0.05;
                    const alpha = 1 - (this.radius[i] / 50);
                    ctx_one.strokeStyle = `rgba(255,255,255,${alpha})`;
                }
                ctx_one.beginPath();
                ctx_one.arc(this.x[i], this.y[i], this.radius[i], 0, 2 * Math.PI);
                ctx_one.closePath();
                ctx_one.stroke();
                ctx_one.restore();
            }
        }
    }
    born(x, y, type = false) {
        for (let i = this.num; i >= 0; i--) {
            // 找到第一个没有存活的，让他复活。
            if (!this.alive[i]) {
                this.alive[i] = true; // 存活代表显示出来
                this.radius[i] = 20;
                this.x[i] = x;
                this.y[i] = y;
                this.type[i] = type; // 设置类型为 true; 当为 true 的时候，代表鱼妈妈与鱼宝宝碰撞
                return;
            }
        }
    }
}

class Dust {
    constructor() {
        this.dustPic = [];
        this.x = [];
        this.y = [];
        this.amp = [];
        this.No = []; // 渲染哪一张图片
        this.alpha = 0.6; // 角度
        this.num = 30; // 数量
        for (var i = 0; i < 7; ++i) {
            this.dustPic[i] = new Image();
            this.dustPic[i].src = `assets/img/dust${i}.png`;
        }
        for (let i = 0; i < this.num; ++i) {
            this.x[i] = Math.random() * cvs_width;
            this.y[i] = Math.random() * cvs_height;
            this.amp[i] = 20 + Math.random() * 15;
            this.No[i] = Math.floor(Math.random() * 7);
        }
        this.alpha = 0;
    }
    draw() {
        this.alpha += deltaTime * 0.001;
        const l = Math.sin(this.alpha);
        for (let i = 0; i < this.num; ++i) {
            let no = this.No[i];
            ctx_one.drawImage(this.dustPic[this.No[i]], this.x[i] + l * this.amp[i], this.y[i]);
        }
    }
}

let cvs_one;
let cvs_two;
let ctx_one;
let ctx_two;
let mouse_x;
let mouse_y; // 鱼的y坐标，和鼠标y的坐标，因为鼠标在哪鱼在哪，所以重合。
let cvs_width;
let cvs_height;
let score;
let wave;
let dust;
let anemones;
let fruits;
let fish_mother;
let fish_baby;
const bgPic = new Image();
function getCanvasAndContextById(id) {
    const dom = document.querySelector('#' + id);
    const ctx = dom.getContext('2d');
    return [dom, ctx];
}
// 鼠标移动监听函数
function mouseMove(e) {
    // offset = layer + 1
    if (!score.gaveOver && (e.offsetX || e.layerX)) {
        mouse_x = typeof e.offsetX == undefined ? e.layerX : e.offsetX;
        mouse_y = typeof e.offsetY == undefined ? e.layerY : e.offsetY;
    }
}
function init() {
    [cvs_one, ctx_one] = getCanvasAndContextById('one');
    [cvs_two, ctx_two] = getCanvasAndContextById('two');
    bgPic.src = 'assets/img/background.jpg';
    cvs_width = cvs_one.width;
    cvs_height = cvs_one.height;
    anemones = new Anemones();
    fruits = new Fruits();
    fish_mother = new FishMother();
    fish_baby = new FishBaby();
    score = new Socre();
    wave = new Wave();
    dust = new Dust();
    mouse_x = cvs_width / 2; // 先把鱼初始化在画布的中间
    mouse_y = cvs_height / 2;
    // 因为鱼是在 canvas one 上面，所以把监听添加到 one 上面
    cvs_one.addEventListener('mousemove', mouseMove, false);
}

let lastTime = Date.now();
let deltaTime = 0; // requestAnimationFrame 执行完成所用的时间 = 当前时间 - 上一次绘制的世界
/**
 * 鱼妈妈与果实的碰撞检测
 */
function fishAndFruitsCollision() {
    for (let i = fruits.num; i >= 0; i--) {
        // 假如或者就计算鱼儿与果实的距离
        if (fruits.alive[i]) {
            // 得到距离的平方根
            const distance = utils.getDistance({ x: fruits.x[i], y: fruits.y[i] }, { x: fish_mother.x, y: fish_mother.y });
            // 假如距离小于 500 让果实死亡
            if (distance < 500) {
                fruits.dead(i);
                score.fruitNum++; // 计分系统的果实数加一
                if (fruits.fruitType[i] === FruitType.Blue) {
                    score.doubleMode = 2;
                }
                // 把鱼儿吃掉果实的位置传过去，（传鱼的坐标或者果实坐标都可以）
                wave.born(fruits.x[i], fruits.y[i]);
            }
        }
    }
}
/**
 * 鱼妈妈与鱼宝宝的碰撞检测
 */
function fishMotherAndBabyCollision() {
    // 得到距离的平方根
    const distance = utils.getDistance({ x: fish_baby.x, y: fish_baby.y }, { x: fish_mother.x, y: fish_mother.y });
    // 假如距离小于 900 就喂食给 baby，且必须要鱼妈妈吃到了果实才能喂给小鱼
    if (distance < 900 && score.fruitNum != 0) {
        fish_baby.recover();
        // 把能力给小鱼，果实数清零，计算分数一次
        score.reset();
        // 把大鱼的 bodyindex 恢复成 0
        fish_mother.BodyIndex = 0;
        wave.born(fish_baby.x, fish_baby.y, true); // 出生一个波浪
    }
}
function gameLoop() {
    const now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    //  给 deltaTime 设置上线
    if (deltaTime > 40)
        deltaTime = 40;
    // console.log(deltaTime);
    drawBackbround(); // 画背景图片
    anemones.draw(); // 海葵绘制
    fruits.draw(); // 果实绘制
    fruits.monitor(); // 监视果实，让死去的果实得到新生
    ctx_one.clearRect(0, 0, cvs_width, cvs_width); // 清除掉所有，再进行绘制，要不然的话会多次绘制而进行重叠。
    fish_baby.draw(); // 绘制鱼宝宝
    fish_mother.draw(); // 绘制鱼妈妈
    if (!score.gaveOver) {
        fishAndFruitsCollision(); // 每一帧都进行碰撞检测
        fishMotherAndBabyCollision();
    }
    score.draw(); // 绘制分数
    wave.draw();
    dust.draw();
    requestAnimationFrame(gameLoop); // 不断的循环 gameLoop，且流畅性提升
}
function drawBackbround() {
    ctx_two.drawImage(bgPic, 0, 0, cvs_width, cvs_height);
}

// import _ from "lodash";
window.onload = () => {
    init();
    gameLoop();
};

}());
//# sourceMappingURL=bundle.js.map
