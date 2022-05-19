import { useCallback, useEffect, useMemo } from 'react'

type Item = number
type List = Item[]
type Length = number

const prev: { length: number; index: Item; view: List } = {
  length: -5,
  index: -5,
  view: [],
}

export type PaginationProps = {
  active: Item
  length: Length
  maxWidth: Length
}

export default function usePagination({ active, length, maxWidth }: PaginationProps) {
  const base = useMemo(() => [...Array(Math.max(length, 1))].map((_, n) => n), [length])
  const activeIndex = useMemo(() => availableItem(base, active), [active, base])

  const initView = useCallback(() => {
    return sliceCenter(base, Math.max(maxWidth, 3), activeIndex)
  }, [maxWidth, base, activeIndex])

  const updateView = useCallback(
    (offset: number) => {
      const edgeItem = offset < 0 ? itemFirst : itemLast
      const baseEdge = activeIndex === edgeItem(base)
      const viewEdge = activeIndex === edgeItem(prev.view)
      if (!baseEdge && viewEdge) {
        const include = edgeItem(prev.view) + offset
        if (offset < 0) {
          const slice = prev.view.slice(0, prev.view.length + offset)
          return [include, ...slice]
        }
        if (offset > 0) {
          const slice = prev.view.slice(offset, prev.view.length)
          return [...slice, include]
        }
      }
      return prev.view
    },
    [base, activeIndex]
  )

  const view = useMemo(() => {
    if (length !== prev.length) {
      return initView()
    }
    if (length <= maxWidth) {
      return base
    }
    const offset = activeIndex - prev.index
    if (Math.abs(offset) === 1) {
      return updateView(offset)
    }
    return initView()
  }, [maxWidth, length, base, activeIndex, initView, updateView])

  const isActiveItem = useCallback(
    (index: Item) => {
      return index === activeIndex
    },
    [activeIndex]
  )

  const isEdgeItem = useCallback(
    (index: Item) => {
      const baseFirst = index === itemFirst(base)
      const baseLast = index === itemLast(base)
      const viewFirst = index === itemFirst(view)
      const viewLast = index === itemLast(view)
      return (viewFirst && !baseFirst) || (viewLast && !baseLast)
    },
    [base, view]
  )

  useEffect(() => {
    prev.length = length
  }, [length])

  useEffect(() => {
    prev.index = activeIndex
  }, [activeIndex])

  useEffect(() => {
    prev.view = view
  }, [view])

  return {
    baseList: base,
    visiblePart: view,
    activeIndex,
    isActiveItem,
    isEdgeItem,
  }
}

function itemFirst(array: List = []) {
  return array[0]
}
function itemLast(array: List = []) {
  return array[array.length - 1]
}

function availableItem(base: List = [], index: Item = 0) {
  if (index < itemFirst(base)) {
    return itemFirst(base)
  }
  if (index > itemLast(base)) {
    return itemLast(base)
  }
  return index
}

function sliceCenter(base: List, maxWidth: Length, center: Item) {
  const from = Math.max(
    0,
    Math.min(Math.floor(center - (maxWidth - 1) / 2), base.length - maxWidth)
  )
  const to = from + maxWidth
  return base.slice(from, to)
}
