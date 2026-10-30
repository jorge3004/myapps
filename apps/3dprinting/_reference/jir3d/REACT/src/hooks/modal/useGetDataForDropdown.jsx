import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { defaults } from '../../data/initializations'
import axios from "axios"
import { setModal } from '../../store/slices/utilSlice';

const repositorioEndPoint = `${defaults.jir3dAPIs.default}/repositorio`;

export const useGetDataForDropdown = () => {
    const { user } = useSelector(state => state.user)
    const { modal } = useSelector(state => state.util.util)
    const dispatch = useDispatch()
    const tid = modal.item?.tid
    const uid = modal?.item?.uid || user?.uid

    useEffect(() => {
        const Afc = async () => {
            // setTimeout(async () => {
            // console.log(`${repositorioEndPoint}/${uid}/${tid}`);
            const { data } = await axios(`${repositorioEndPoint}/${uid}/${tid}`)
            // console.log(data);
            if (data.length === 1) {
                dispatch(setModal({ ...modal, loadingModal: false, dropdownItems: data, dropdownSelected: data[0], dropdownLoaded: true }))
            } else
                dispatch(setModal({ ...modal, loadingModal: false, dropdownItems: data, dropdownLoaded: true }))
            // }, 1500);
        }
        Afc()
    }, [tid])

    return
}
