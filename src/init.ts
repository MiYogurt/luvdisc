import Anemones from "./anemones";
import Fruits from "./fruits";
import { FishMother, FishBaby } from "./fish";
import Score from "./score";
import Wave from "./wave";
import Dust from "./dust";


/****************************/
/** 初始化所有需要初始化的变量 **/
/****************************/

let cvs_one: HTMLCanvasElement,
    cvs_two: HTMLCanvasElement,
    ctx_one: CanvasRenderingContext2D,
    ctx_two: CanvasRenderingContext2D;

let mouse_x: number, // 鱼的x坐标，和鼠标x的坐标
    mouse_y: number; // 鱼的y坐标，和鼠标y的坐标，因为鼠标在哪鱼在哪，所以重合。

let cvs_width: number,
    cvs_height: number;

let score : Score;
let wave: Wave;
let dust: Dust;

let anemones: Anemones , fruits: Fruits, fish_mother: FishMother, fish_baby: FishBaby;

const bgPic = new Image();

function getCanvasAndContextById(id: string): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const dom = <HTMLCanvasElement>document.querySelector('#' + id);
  const ctx = dom.getContext('2d');

  return [dom, ctx];
}

// 鼠标移动监听函数
function mouseMove(e: MouseEvent) {

  // offset = layer + 1
  if( !score.gaveOver && (e.offsetX || e.layerX)) { // 当游戏结束的时候不再进行移动
    mouse_x = typeof e.offsetX == undefined ? e.layerX : e.offsetX
    mouse_y = typeof e.offsetY == undefined ? e.layerY : e.offsetY
  }

}

function init() {
  [cvs_one, ctx_one] = getCanvasAndContextById('one');
  [cvs_two, ctx_two] = getCanvasAndContextById('two');

  bgPic.src = 'assets/img/background.jpg';

  cvs_width = cvs_one.width;
  cvs_height = cvs_one.height;

  anemones = new Anemones()
  fruits = new Fruits()
  fish_mother = new FishMother()
  fish_baby = new FishBaby()

  score = new Score();
  wave = new Wave();
  dust = new Dust();

  mouse_x = cvs_width / 2; // 先把鱼初始化在画布的中间
  mouse_y = cvs_height / 2;

  // 因为鱼是在 canvas one 上面，所以把监听添加到 one 上面
  cvs_one.addEventListener('mousemove', mouseMove, false);

}

export default init;

export {
  bgPic,
  cvs_width,
  cvs_height,
  cvs_one,
  cvs_two,
  ctx_one,
  ctx_two,
  anemones,
  fruits,
  fish_mother,
  fish_baby,
  mouse_x,
  mouse_y,
  score,
  wave,
  dust
};
