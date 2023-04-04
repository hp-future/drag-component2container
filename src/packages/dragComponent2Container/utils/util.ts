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

  const match = style.transform.match(/(?<=matrix\().*(?=\))/)?.[0] || '';
  const [translateX, translateY] = match.split(',').slice(4);

  return [Number(translateX), Number(translateY)];
}
