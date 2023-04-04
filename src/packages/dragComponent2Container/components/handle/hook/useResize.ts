import { RefObject, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { getTranslate } from '../../../utils/util';
import { actions } from '../../../store/slice';

/**
 * 缩放
 */
const useResize = (ref: RefObject<HTMLDivElement>) => {
  const dispatch = useAppDispatch();

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

    ref.current.addEventListener('mouseup', mouseup, true);
    ref.current.addEventListener('mousedown', mousedown, true);
    document.addEventListener('mousemove', mousemove, true);

    return () => {
      document.removeEventListener('mousemove', mousemove, true);
      ref.current?.removeEventListener('mouseup', mouseup, true);
      ref.current?.removeEventListener('mousedown', mousedown, true);
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

    // 更新组件的物理信息
    const parentEle = (e.currentTarget as HTMLElement).parentElement as HTMLElement;
    dispatch(actions.updateComponentsRect({ id: parentEle.id }));
  }
  function mousedown(e: MouseEvent) {
    if (!(e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }

    // 开始移动
    mouseMmoving.current = true;
    // 鼠标移动前的起始位置
    mouseStartPosi.current = { x: e.clientX, y: e.clientY };

    const parentElement = (e.currentTarget as HTMLElement).parentElement!;
    // 初始大小
    startSize.current = { width: parentElement.clientWidth, height: parentElement.clientHeight };
    // 初始tanslate
    const [translateX, translateY] = getTranslate(parentElement);
    startTransform.current = { translateX, translateY };

    // 获得缩放手柄，记录缩放方向
    const handleName = (e.target as HTMLElement).getAttribute('handle-name');
    scaleDirection.current = handleName || '';
  }
};

export default useResize;
