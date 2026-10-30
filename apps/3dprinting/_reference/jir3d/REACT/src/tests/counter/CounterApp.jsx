import React, { useState } from 'react'

export const CounterApp = ({ init = 10 }) => {
    const [value, setValue] = useState(init)
    return (
        <div className='text-center m-5'>
            <h2>CounterApp</h2>
            <h3>{value}</h3>
            <button className='m-3' onClick={() => setValue(value - 1)}>-1</button>
            <button className='m-3' onClick={() => setValue(value + 1)}>+1</button>
            <button className='m-3' aria-label='btn-reset' onClick={() => setValue(init)}>reset</button>
        </div>
    )
}
