import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUsuario } from '../../store/slices/userSlice';
import { setAuthentificationError } from '../../store/slices/utilSlice';
import { defaults } from '../../data/initializations';

export const LoginGoogle = () => {
    const dispatch = useDispatch()
    const responseMessage = async (response) => {
        // console.log(response);
        try {
            const { data } = await axios({
                method: 'post',
                url: `${defaults.jir3dAPIs.default}/auth/google`,
                data: {
                    id_token: response.credential
                }
            })
            localStorage.setItem("id_token", data.token)
            localStorage.setItem("refreshToken", data.refreshToken)
            localStorage.setItem("correo", data.usuario.correo)
            data.usuario.verified = true
            dispatch(setUsuario(data.usuario))
        } catch (e) {
            console.log(e);
            dispatch(setAuthentificationError("Error contacta a administrado JIR3D"))
        }
    };
    const errorMessage = (error) => {
        console.log(error);
        dispatch(setUsuario({ verified: false }))
    };
    return (
        <div className='d-flex justify-content-center my-4 w-100 text-center'>
            <div className='ps-4 ps-sm-0 ps-md-1 ps-lg-4 ps-xl-4 ps-xxl-1'>
                <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                    // theme={"filled_black"}
                    type={"icon"}
                    shape={"pill"}
                    logo_alignment={"center"}
                    // width={"250"}
                    // size={"large"}
                    auto_select
                    useOneTap
                />
            </div>
        </div>
    )
}
