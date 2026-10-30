import React from 'react'
import * as FiIcons from "react-icons/fi";
import { setModal } from '../../../../store/slices/utilSlice';
import { useDispatch } from 'react-redux';


export const RepositorioItem_Update = ({ repositorio }) => {
    const dispatch = useDispatch()
    const update = () => {
        dispatch(setModal({ action: "updateFileFromRepositorio", item: repositorio }))
    }
    return (
        <>
            <FiIcons.FiRefreshCcw
                style={{ cursor: "pointer", color: "yellow" }}
                className="m-3"
                onClick={update}
            />
        </>
    );
}
