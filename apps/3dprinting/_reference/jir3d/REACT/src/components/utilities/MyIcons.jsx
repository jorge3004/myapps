import { FormControlLabel, FormGroup } from '@mui/material';
import Switch from '@mui/material/Switch';
import React from 'react';
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as GrIcons from "react-icons/gr";
import { useGenericModalLabels } from '../../hooks/useGenericModalLabels';

export const MyIcons = ({
    action,
    setModal,
    onChange,
    toggleSwitch,
}) => {
    const { switchLabel } = useGenericModalLabels(action)
    const className = `${action === 'add' ? '' : 'mx-lg-3 mx-1'} `
    // const { on } = printerStatus
    const IconSelect = () => {
        switch (action) {
            case 'edit':
                return (
                    <FaIcons.FaEdit
                        className={className}
                        color={'yellow'}
                        onClick={() => setModal('edit')}
                    />
                )
            case 'delete':
                return (
                    <FaIcons.FaTrash
                        className={className}
                        color={'red'}
                        onClick={() => setModal('delete')}
                    />
                )
            case 'add':
                return (
                    <FaIcons.FaPlus
                        color={'white'}
                        className={className}
                    />
                )
            case 'uploadActivated':
                return (
                    <FormGroup >
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    name={action === 'isActive' ? 'isActive' : action}
                                    onChange={onChange}
                                    defaultChecked={toggleSwitch[action]}
                                />
                            }
                            label={switchLabel} />
                    </FormGroup>

                )
            case 'printerConfig':
                return (
                    <BsIcons.BsGearFill
                        color={'gray'}
                        onClick={() => setModal('printerConfig')}
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
    }
    return (

        <>
            <FaIcons.FaEdit
            // className={className}
            // color={'yellow'}
            // onClick={() => setModal('edit')}
            />
            {/* {(() => {
                switch (1) {
                    case 1:
                        return <FaIcons.FaEdit
                            className={className}
                            color={'yellow'}
                            onClick={() => setModal('edit')}
                        />
                    case 2:
                        return (
                            <FaIcons.FaTrash
                                className={className}
                                color={'red'}
                                onClick={() => setModal('delete')}
                            />
                        )
                    default:
                        return (
                            <GrIcons.GrDocumentMissing
                            />
                        )
                }
            })()} */}
        </>

    )
}
