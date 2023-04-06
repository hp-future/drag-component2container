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

/**
 * 根据组件类型获取默认宽高
 * @param type  组件类型
 */
export function getWHByType(type: string) {
  switch (type) {
    case 'button':
      return { width: 70, height: 32 };
    case 'table':
      return { width: 300, height: 200 };
    default:
      return null;
  }
}
