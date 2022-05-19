import React, { useEffect, useState } from 'react'
import usePagination from './usePagination'

let prevIndex = 0

export default function Dots(props) {
  const [stack, setStack] = useState([])

  const { baseList, visiblePart, isActiveItem, isEdgeItem, activeIndex } = usePagination(props)

  useEffect(() => {
    setStack((prevState) => [...prevState, prevIndex])
    setTimeout(() => {
      setStack((prevState) => [...prevState.slice(1)])
    }, 200)
    prevIndex = activeIndex
  }, [activeIndex])

  const before = baseList.slice(0, visiblePart[0])
  const after = baseList.slice(visiblePart[visiblePart.length - 1] + 1)

  return (
    <div>
      <div className="dots-container view-container">
        {[before, visiblePart, after].map((part, index) => {
          const Wrapper = index === 1 ? 'div' : React.Fragment
          const WrapperProps = {
            key: index,
          }
          if (index === 1) {
            WrapperProps.className = 'view-wrapper'
          }
          return (
            <Wrapper {...WrapperProps}>
              {part.map((dotIndex, index) => {
                return (
                  <div
                    key={index}
                    className={`dots-item  
					              ${isActiveItem(dotIndex) ? 'isActive' : ''}
					              ${isEdgeItem(dotIndex) ? 'isEdge' : ''}`}
                  >
                    {dotIndex}
                  </div>
                )
              })}
            </Wrapper>
          )
        })}
      </div>
      <div className="dots-container">
        {visiblePart.map((dotIndex, index) => {
          return (
            <div
              key={index}
              className={`dots-item  
              ${isActiveItem(dotIndex) ? 'isActive' : ''}
              ${isEdgeItem(dotIndex) ? 'isEdge' : ''}`}
            >
              <span>{dotIndex}</span>
            </div>
          )
        })}
      </div>
      <div className="dots-container">
        {visiblePart.map((dotIndex, index) => {
          return (
            <div
              key={index}
              className={`dots-item-rounded
              ${isActiveItem(dotIndex) ? 'isActive' : ''}
              ${isEdgeItem(dotIndex) ? 'isEdge' : ''}`}
            >
              <span>{dotIndex}</span>
              {isActiveItem(dotIndex) && (
                <>
                  {/*<p className="animation left">2</p>*/}
                  {stack.map((num, index) => {
                    const offset = activeIndex - num
                    if (Math.abs(offset) === 1) {
                      return (
                        <p key={index} className={`animation ${offset < 0 ? 'left' : 'right'}`}>
                          {num}
                        </p>
                      )
                    }
                    return null
                  })}
                </>
              )}
            </div>
          )
        })}
      </div>
      <div className="dots-options">
        <div className="dots-item">{activeIndex}</div>
      </div>
    </div>
  )
}
