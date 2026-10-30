import React, { useState } from 'react'
import ReactFlagsSelect from "react-flags-select";
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../../../store/thunks/thunksUsers';

export const LanguageComponent = () => {
    const { lan, uid } = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const changeLan = (code) => {
        if (code !== lan) {
            dispatch(editUser({ lan: code }, uid));
        }
    }

    return (
        <ReactFlagsSelect
            className="p-4 banderas m-auto"
            countries={["US", "MX"]}
            customLabels={{
                US: "EN",
                MX: "ES",
            }}
            placeholder="Idioma"
            selected={lan}
            onSelect={changeLan}
            selectedSize={15}
        />)
}
