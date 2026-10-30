import React from 'react'
import { Input } from "reactstrap";


export const Modal_FileUpload_InputForm = ({ inputValues, handleInputChange }) => {
    return <>
        <div className="d-flex align-items-center justify-content-center my-3">
            <div className="my-2">Descripción:</div>
            <Input
                onChange={handleInputChange}
                value={inputValues.text}
                name={"text"}
            />
        </div>
        <Input
            onChange={handleInputChange}
            name={"file"}
            type="file"
        />
    </>
}
