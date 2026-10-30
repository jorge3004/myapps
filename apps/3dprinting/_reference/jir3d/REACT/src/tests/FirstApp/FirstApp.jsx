import React from 'react'

export const FirstApp = ({ title, subTitle }) => {
    return (
        <div >
            <h1 data-testid={"test-title"}>{title}</h1>
            <h2>FirstApp</h2>
            <h2>{subTitle}</h2>
            <h2>{subTitle}</h2>
        </div>
    )
}
