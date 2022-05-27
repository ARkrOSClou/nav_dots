import React, { useState } from 'react'
import Dots from './Dots'

function App() {
  const [active, setActive] = useState(3)
  const [length, setLength] = useState(10)
  const [maxWidth, setMaxWidth] = useState(5)

  const list = [
    ['active', active, setActive],
    ['length', length, setLength],
    ['maxWidth', maxWidth, setMaxWidth],
  ]

  return (
    <div className="App">
      <Dots active={active} length={length} maxWidth={maxWidth} />
      <div className="dots-options">
        <ul>
          {list.map(([name, state, setState]) => {
            return (
              <li key={name.toString()}>
                <div>{name}</div>
                <input
                  type="number"
                  value={state.toString()}
                  onChange={(e) => setState(parseInt(e.target.value, 10))}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
