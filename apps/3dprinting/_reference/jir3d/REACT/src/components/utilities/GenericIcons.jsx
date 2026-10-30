import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import * as GrIcons from "react-icons/gr";
import { GenericModal } from './GenericModal';

export const GenericIcons = (props) => {
    const {
        action,
        element = 'icon',
        tmp,
        color = 'white'
    } = props
    const [modal, setModal] = useState('')
    // console.log(props)
    const iconProps = {
        className: 'mx-lg-3 mx-1',
        color:
            action === 'add' ? 'white' :
                action === 'edit' ? 'yellow' :
                    action === 'delete' ? 'red' :
                        color,
        onClick: () => {
            if (element === "button") return
            setModal(action)
        }
    }
    return (
        <>
            {
                (() => {
                    switch (action) {
                        case 'edit':
                            return <FaIcons.FaEdit {...iconProps} />
                        case 'delete':
                            return <FaIcons.FaTrash {...iconProps} />
                        case 'add':
                            return <FaIcons.FaPlus {...iconProps} />
                        case 'printerConfig':
                            return (
                                <BsIcons.BsGearFill
                                    color={'gray'}
                                // onClick={() => setModal('printerConfig')}
                                />
                            )
                        case 'printerSignal':
                            return (
                                <div className=" ms-auto">
                                    {/* {
                                        on ?
                                            <BiIcons.BiWifi
                                                className="text-success d-flex justify-context-center"
                                                size={22}
                                            />
                                            : */}
                                    <BsIcons.BsWifiOff size={22} />
                                    {/* } */}
                                </div>
                            )
                        default:
                            return (
                                <GrIcons.GrDocumentMissing
                                />
                            )
                    }
                })()
            }
            {
                modal &&
                <GenericModal
                    action={action}
                    setModal={setModal}
                    tmp={tmp}
                />
            }
        </>
    )
}
