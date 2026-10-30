import React from 'react'
import { ModalBody } from "reactstrap";
import { PrintModal_Conf_Module } from './PrintModal_Conf_Module';
import { Modal_FileUpload_Dropdown } from '../../dashboard/modals/helper/Modal_FileUpload_Dropdown';
import { useSelector } from 'react-redux';
import { jir3dRoles } from '../../../helpers/jir3dRoles';
// import { PrinterConfigModal_TempModule } from './PrinterConfigModal_TempModule';


export const PrintModal_Body = ({ error }) => {
    const { action } = useSelector(state => state.util.util.modal)
    const { user } = useSelector(state => state.user)
    const { admin } = jir3dRoles(user)
    return (
        <ModalBody className=" ">
            {
                action !== "nivelar" &&
                <>
                    <Modal_FileUpload_Dropdown />
                    <p className='d-flex justify-content-center m-2 text-danger'>{error}</p>
                </>
            }

            {
                admin &&
                <>
                    <hr />
                    <PrintModal_Conf_Module
                        mode={"nozzleTemp"}
                        title={"Temperatura Nozzle"}
                    />
                    {
                        action !== "nivelar" &&
                        <>
                            <br />
                            <PrintModal_Conf_Module
                                mode={"bedTemp"}
                                title={"Temperatura Bed"} />
                        </>
                    }

                    {
                        action === "nivelar" &&
                        <>
                            <br />
                            < PrintModal_Conf_Module
                                mode={"bedParam"}
                                title={"Parámetro nivelador"}
                            />
                        </>
                    }
                </>
            }
        </ModalBody>
    )
}
