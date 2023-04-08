import { useEffect, useRef } from "react"
import { useAppDispatch } from "../store/hooks"
import { actions } from "../store/slice"

let ticking = false;

/**
 * 获取拖拽状态
 */
const useDragging = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('dragover', onDragOver)
    document.addEventListener('drop', onDrop)

    return () => {
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('dragover', onDragOver)
      document.removeEventListener('drop', onDrop)
    }
  }, [])

  // 允许拖拽
  const allowDrag = useRef(false)
  // 鼠标在被拖拽元素内的位置
  const mouseInDragdableEle = useRef({ x: 0, y: 0 })

  /**
   * 开始拖拽
   */
  function onDragStart(e: DragEvent) {
    const target = e.target as HTMLElement
    // 排除其他可拖拽元素
    if (!target.hasAttribute('data-draggable')) {
      return
    }

    allowDrag.current = true

    // 记录鼠标在被拖拽元素内的位置
    const { left, top } = target.getBoundingClientRect()
    mouseInDragdableEle.current = { x: e.clientX - left, y: e.clientY - top }
  }

  /**
   * 拖拽中
   */
  function onDragOver(e: DragEvent) {
    e.preventDefault()

    if (!allowDrag.current) {
      return
    }

    const target = e.target as HTMLElement


    // 降低dragover的触发频率
    if (!ticking) {
      // 根据目标元素是否在可释放区域内，更新拖拽状态
      const dropContainer = document.getElementById('dropContainer')!
      const isInclude = dropContainer.contains(target)
      dispatch(actions.updateDragging(isInclude))
      if (!isInclude) {
        return
      }

      window.requestAnimationFrame(function () {
        // 鼠标在可释放区域内的相对位置
        const dropContainer = document.getElementById('dropContainer')!
        const { left, top } = dropContainer!.getBoundingClientRect()
        const x = e.clientX - left - mouseInDragdableEle.current.x
        const y = e.clientY - top - mouseInDragdableEle.current.y
        // 更新十字标线坐标
        dispatch(actions.updateReticuleInfo({ x, y }))

        ticking = false;
      });

      ticking = true;
    }
  }

  /**
   * 拖拽释放
   */
  function onDrop(e: DragEvent) {
    if (!allowDrag.current) {
      return
    }

    dispatch(actions.updateDragging(false))
  }
}

export default useDragging