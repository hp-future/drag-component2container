import { useEffect } from "react"
import { getTranslate } from "../../../utils/util"
import { useAppDispatch } from "../../../store/hooks"
import { actions } from "../../../store/slice"

/**
 * 对齐标线的tanslate变化
 */
const useAlignLineTranslate = () => {
  const dispatch = useAppDispatch()


  useEffect(() => {
    const alignX = document.getElementById('align-X')
    const alignY = document.getElementById('align-Y')

    if (!(alignX && alignY)) {
      return
    }

    const intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(item => {
        const target = item.target
        const { translateX, translateY } = getTranslate(target)

        if (target.id === 'align-X') {
          dispatch(actions.updateAlignLineInfo({ y: translateY === -100 ? null : translateY }))
        }

        if (target.id === 'align-Y') {
          dispatch(actions.updateAlignLineInfo({ x: translateX === -100 ? null : translateX }))
        }

      })
    })

    intersectionObserver.observe(alignX)
    intersectionObserver.observe(alignY)

    return () => {
      intersectionObserver.disconnect()
    }
  }, [])
}

export default useAlignLineTranslate