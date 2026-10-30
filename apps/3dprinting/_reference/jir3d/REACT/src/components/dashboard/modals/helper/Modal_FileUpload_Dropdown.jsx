import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { setModal } from '../../../../store/slices/utilSlice';
import { useGetDataForDropdown } from '../../../../hooks/modal/useGetDataForDropdown';
import { Loading } from '../../../utilities/Loading';

export const Modal_FileUpload_Dropdown = ({ direction, ...args }) => {

    const { modal } = useSelector(state => state.util.util)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const { dropdownItems, dropdownSelected } = modal
    const dispatch = useDispatch()
    const selecAction = (item) => {
        dispatch(setModal({ ...modal, dropdownSelected: item }))
    }

    (modal.action === "imprimir") && useGetDataForDropdown()

    return (
        <>{
            modal?.dropdownLoaded ?
                <Dropdown
                    isOpen={dropdownOpen}
                    toggle={toggle}
                    direction={direction}
                    className={"d-flex justify-content-center"}
                >
                    <DropdownToggle
                        caret
                        className="d-flex justify-content-center align-items-center m-auto"
                    >
                        {dropdownSelected ? dropdownSelected.desc : "Seleccione version"}
                    </DropdownToggle>
                    <DropdownMenu {...args}>
                        {
                            !!dropdownItems && dropdownItems.map(item =>
                                <DropdownItem
                                    key={item.rid}
                                    onClick={() => selecAction(item)}
                                >
                                    {item.desc}
                                </DropdownItem>)
                        }
                    </DropdownMenu>
                </Dropdown>
                :
                <Loading msg={""} />
        }</>

    )
}
