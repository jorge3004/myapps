import React from 'react'

export const FirstApp2 = ({ title, subTitle }) => {
    return (
        <div >
            <h1 data-testid={"test-title"}>{title}</h1>
            <h2>{subTitle}</h2>
            <h2>{subTitle}</h2>
        </div>
    )
}
