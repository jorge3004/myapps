import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "reactstrap";
import { useForm } from "../../../hooks/useForm";
import { Modal_FileUpload_Body } from "./helper/Modal_FileUpload_Body";
import { Modal_FileUpload_Footer } from "./helper/Modal_FileUpload_Footer";
import { useGetDataForDropdown } from "../../../hooks/modal/useGetDataForDropdown";
import { Modal_Header } from "./helper/Modal_Header";
import { Card, CardBody } from "reactstrap";

export const Modal_uploadFile = ({ header = "", modalMode = "" }) => {
    const { modal } = useSelector((state) => state.util.util);
    (modalMode === "update" || modalMode === "delete" || modalMode === "get") && useGetDataForDropdown()
    const [error, setError] = useState("")
    const text = modal.dropdownSelected?.desc
    const [inputValues,
        handleInputChange,
        setInputValues] = useForm({ text: "", file: null })

    useEffect(() => {
        if (modalMode === "update") {
            if (text)
                setInputValues({ ...inputValues, text })
        }
    }, [text])
    return (
        <>
            <Modal isOpen={true}  >
                <Modal_Header
                    title={header}
                />
                <Modal_FileUpload_Body
                    error={error}
                    handleInputChange={handleInputChange}
                    inputValues={inputValues}
                    modalMode={modalMode}
                    setError={setError}
                />
                {
                    (!(modal.percent || modal.percent < 100)) &&
                    <Modal_FileUpload_Footer
                        inputValues={inputValues}
                        setError={setError}
                        modalMode={modalMode}
                    />
                }
                {
                    modal.data &&
                    <Card>
                        <CardBody style={{ whiteSpace: "pre-wrap" }}>
                            {modal.data}
                        </CardBody>
                    </Card>
                }
            </Modal >
        </>
    );
};


