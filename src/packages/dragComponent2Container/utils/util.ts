/**
 * 获取元素的 tanslate 偏移量
 * @param target    目标元素
 * @return [translateX, translateY]
 */
export function getTranslate(target: HTMLElement | Element) {
  // 获取元素的 transform 值
  const transformValue = getComputedStyle(target).getPropertyValue('transform');

  // 解析 translate 值
  const matrix = new DOMMatrix(transformValue);
  const translateX = matrix.m41;
  const translateY = matrix.m42;

  return { translateX, translateY };
}
