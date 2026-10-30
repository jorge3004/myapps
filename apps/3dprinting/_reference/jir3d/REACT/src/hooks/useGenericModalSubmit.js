import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { impresora, usuario } from '../data/initializations';
import { addImpresora, editarImpresora, removeImpresora } from '../store/thunks/thunksImpresoras';
import { addUser, deleteUser, editUser, errorUser } from '../store/thunks/thunksUsers';
// import { jir3dRoles } from '../helpers/jir3dRoles';
export const useGenericModalSubmit = () => {
    const { user } = useSelector((state) => state.user);
    // const { admin } = jir3dRoles(user)
    const { lan, uid } = user
    const { pathname } = useLocation();
    // const [data, setData] = useState({})

    const dispatch = useDispatch()
    const submitForm = (action, tmp, submitValues, setLoading, setError, closeModal) => {
        const { usuario, clave } = submitValues || {}
        let error = ''
        setLoading(true)
        if (action === 'add') {
            if (pathname === '/dashboard/usuarios' && usuario === '')
                if (lan === 'MX')
                    error = "Ingrese usuario"
                else
                    error = "Enter user"
        }
        if (error) {
            setError(error)
            setLoading(false)
            return
        }

        // if (action === 'edit') {
        //     if (pathname === '/dashboard/usuarios') {
        //         if (uid === tmp?.uid) return { usuario: tmp?.usuario, clave: '' }
        //         return { usuario: tmp?.usuario }
        //     }
        //     if (pathname === '/dashboard/impresoras') return { nombre: tmp?.nombre }
        // }

        const submitFunction = {
            add: pathname === '/dashboard/usuarios' ? addUser(submitValues)
                : pathname === '/dashboard/impresoras' ? addImpresora(submitValues)
                    : errorUser,
            delete: pathname === '/dashboard/usuarios' ? deleteUser(tmp?.uid)
                : pathname === '/dashboard/impresoras' ? removeImpresora(tmp)
                    : errorUser(),
            edit: pathname === '/dashboard/usuarios' ? editUser(submitValues, tmp?.uid)
                : pathname === '/dashboard/impresoras' ? editarImpresora(submitValues, tmp?.iid)
                    : errorUser(),

        }
        submitFunction[action]
            ? dispatch(submitFunction[action])
                .then((data) => {
                    if (!data?.error) return closeModal()
                    setLoading(false)
                    setError(
                        data?.error?.response?.data?.msg ||
                        data?.error?.response?.data?.errors[0]?.msg ||
                        JSON.stringify(data)
                    )
                })
                .catch((error) => {
                    setLoading(false)
                    setError(error)
                })
            : console.log('No submit fuction')

        // printerConfig: editarImpresora(submitValues, tmp?.iid),
    }
    // if (submitValues?.price !== undefined) {
    //     if (isNaN(submitValues.price) || submitValues.price === "") {
    //         return setError("Favor de ingresar un numero");
    //     } else if (Number(submitValues.price) <= 0) {
    //         return setError("Favor de ingresar un numero mayor que 0");
    //     } else if (Number(submitValues.price) > 5) {
    //         return setError("Favor de ingresar un numero menor que 5");
    //     }
    // }
    // if (action === 'printerConfig') {
    //     if (pathname === '/dashboard/impresoras') return { price: tmp?.price || 0 }
    // }
    // if (action == 'add' && pathname === '/dashboard/usuarios' && usuario !== undefined && usuario !== '' && clave !== undefined && clave === '') {
    //     return 'Usuario y Clave son requeridos'
    // }

    return submitForm
}
