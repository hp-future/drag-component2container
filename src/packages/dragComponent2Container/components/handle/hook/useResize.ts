import { RefObject, useEffect, useRef } from 'react';

/**
 * 缩放
 */
const useResize = (ref: RefObject<HTMLDivElement>) => {
  // 起始位置
  const mouseStartPosi = useRef({ x: 0, y: 0 });
  // 鼠标正在移动
  const mouseMmoving = useRef(false);
  // 缩放方向
  const scaleDirection = useRef('');
  // 初始大小
  const startSize = useRef({ width: 0, height: 0 });
  const startTransform = useRef({ translateX: 0, translateY: 0 });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.addEventListener('mouseup', mouseup);
    ref.current.addEventListener('mousedown', mousedown);
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);

    return () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      ref.current?.removeEventListener('mouseup', mouseup);
      ref.current?.removeEventListener('mousedown', mousedown);
    };
  }, []);

  function mousemove(e: MouseEvent) {
    if (!mouseMmoving.current || !ref.current) {
      return;
    }

    const xDiff = e.clientX - mouseStartPosi.current.x;
    const yDiff = e.clientY - mouseStartPosi.current.y;

    const parentElement = ref.current.parentElement!;

    switch (scaleDirection.current) {
      case 'top-left': {
        parentElement.style.width = startSize.current.width - xDiff + 'px';
        parentElement.style.height = startSize.current.height - yDiff + 'px';
        const newTranslateX = startTransform.current.translateX + xDiff;
        const newTranslateY = startTransform.current.translateY + yDiff;
        parentElement.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
        break;
      }
      case 'bottom-right': {
        parentElement.style.width = startSize.current.width + xDiff + 'px';
        parentElement.style.height = startSize.current.height + yDiff + 'px';
        break;
      }
      case 'top-center': {
        parentElement.style.height = startSize.current.height - yDiff + 'px';
        const newTranslateY = startTransform.current.translateY + yDiff;
        parentElement.style.transform = `translate(${startTransform.current.translateX}px, ${newTranslateY}px)`;
        break;
      }
      case 'bottom-center': {
        parentElement.style.height = startSize.current.height + yDiff + 'px';
        break;
      }
      case 'top-right': {
        parentElement.style.width = startSize.current.width + xDiff + 'px';
        parentElement.style.height = startSize.current.height - yDiff + 'px';
        const newTranslateY = startTransform.current.translateY + yDiff;
        parentElement.style.transform = `translate(${startTransform.current.translateX}px, ${newTranslateY}px)`;
        break;
      }
      case 'bottom-left': {
        parentElement.style.width = startSize.current.width - xDiff + 'px';
        parentElement.style.height = startSize.current.height + yDiff + 'px';
        const newTranslateX = startTransform.current.translateX + xDiff;
        parentElement.style.transform = `translate(${newTranslateX}px, ${startTransform.current.translateY}px)`;
        break;
      }
      case 'right-center': {
        parentElement.style.width = startSize.current.width + xDiff + 'px';
        break;
      }
      case 'left-center': {
        parentElement.style.width = startSize.current.width - xDiff + 'px';
        const newTranslateX = startTransform.current.translateX + xDiff;
        parentElement.style.transform = `translate(${newTranslateX}px, ${startTransform.current.translateY}px)`;
        break;
      }
      default:
        break;
    }
  }
  function mouseup(e: MouseEvent) {
    mouseMmoving.current = false;
  }
  function mousedown(e: MouseEvent) {
    if (!(e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }
    mouseStartPosi.current = { x: e.clientX, y: e.clientY };
    mouseMmoving.current = true;

    const parentElement = (e.currentTarget as HTMLElement).parentElement!;
    startSize.current = { width: parentElement.clientWidth, height: parentElement.clientHeight };

    const handleName = (e.target as HTMLElement).getAttribute('handle-name');
    scaleDirection.current = handleName || '';

    const style = getComputedStyle(parentElement!);

    const [translateX, translateY] = style.transform
      .match(/(?<=matrix\().*(?=\))/)![0]
      .split(',')
      .slice(4);
    startTransform.current = { translateX: Number(translateX), translateY: Number(translateY) };
  }

  function topLeftScale(e: MouseEvent) {}
};

export default useResize;
