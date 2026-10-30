import React from 'react'
import { Progress } from "reactstrap";

export const ProgressBar = ({ percent = 0 }) => {
  return <>
    <Progress
      animated
      color={`${percent === 100 ? "success" : ""}`}
      value={percent}
    >
      {percent === 100 ? "Finalizado" : `${percent}%`}
    </Progress>
  </>
}
