/**
 * 按照一定的 ratio 比率趋近于目标值，当目标值与当前值距离越大，他们相差就越大。
 * @param  {number} aim   目标值
 * @param  {number} cur   当前值
 * @param  {number} ratio 百分比
 * @return {number} 趋近于目标值的值
 */
function lerpDistance(aim: number, cur: number, ratio: number) : number {
  var delta = cur - aim; // 当前值与目标值的距离
  return aim + delta * ratio;
}


function lerpAngle(aim: number, cur: number, ratio: number): number {
  var delta = cur - aim;
  // 当角度差超过一个 180 度的时候，也就是 PI，无论是正时针，还是逆时针。
  // 因为旋转超过 180 度，我们可以反方向旋转，这样旋转的角度会小一点。
  // 例如：当我们需要顺时针旋转 270 度的时候，我们可以反向旋转 90 度来解决问题。也就是 [ -90 = 270 - 360 ].
  if (delta > Math.PI) delta = delta - 2 * Math.PI;
  if (delta < -Math.PI) delta = delta + 2 * Math.PI;
  return aim + delta * ratio;
}

interface Pointer{
  x: number,
  y: number
}

/**
 * 计算俩个点的距离
 * @param {Pointer} p1 坐标点
 * @param {Pointer} p2 坐标点
 * @returns 距离的平方根
 */
function getDistance(p1: Pointer, p2: Pointer) {
  return Math.pow((p1.x - p2.x) , 2) + Math.pow((p1.y - p2.y), 2)
}

export default {
  lerpDistance,
  lerpAngle,
  getDistance
}
