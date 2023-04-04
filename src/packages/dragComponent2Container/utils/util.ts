/**
 * 获取元素的 tanslate 偏移量
 * @param target    目标元素
 * @return [translateX, translateY]
 */
export function getTranslate(target: HTMLElement) {
  const style = getComputedStyle(target);
  if (style.transform === 'none') {
    return [0, 0];
  }

  const matchs = style.transform.match(/(?<=matrix\().*(?=\))/) || [];
  const [translateX, translateY] = matchs[0].split(',').slice(4);

  return [Number(translateX), Number(translateY)];
}
