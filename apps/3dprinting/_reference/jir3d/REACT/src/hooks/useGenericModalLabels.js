import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { impresora, usuario } from '../data/initializations';
import { addImpresora, editarImpresora, removeImpresora } from '../store/thunks/thunksImpresoras';
import { addUser, deleteUser, editUser, errorUser } from '../store/thunks/thunksUsers';
// import { jir3dRoles } from '../helpers/jir3dRoles';
export const useGenericModalLabels = (action, tmp, submitValues) => {
    const { user } = useSelector((state) => state.user);
    // const { admin } = jir3dRoles(user)
    const { lan, uid } = user
    const { pathname } = useLocation();
    const formInputFunction = (action) => {
        if (action === 'add') {
            if (pathname === '/dashboard/usuarios') return usuario
            if (pathname === '/dashboard/impresoras') return impresora
        }
        if (action === 'edit') {
            if (pathname === '/dashboard/usuarios') {
                if (uid === tmp?.uid) return { usuario: tmp?.usuario, clave: '' }
                return { usuario: tmp?.usuario }
            }
            if (pathname === '/dashboard/impresoras') return { nombre: tmp?.nombre }
        }
        if (action === 'printerConfig') {
            if (pathname === '/dashboard/impresoras') return { price: tmp?.price || 0 }
        }
    }
    const formSwitchFunction = (action) => {
        if (action === 'delete') return
        if (pathname === '/dashboard/usuarios') {
            if (tmp?.uploadActivated !== undefined) return { uploadActivated: tmp.uploadActivated }
            return { uploadActivated: false }
        }
        if (pathname === '/dashboard/impresoras') {
            if (tmp?.isActive !== undefined) return { isActive: tmp.isActive }
            return { isActive: false }
        }
    }
    const actionObject = {
        add: lan === 'MX' ? 'Agregar' : 'Add',
        edit: lan === 'MX' ? 'Editar' : 'Edit',
        delete: lan === 'MX' ? 'Eliminar' : 'Delete',
        printerConfig: lan === 'MX' ? 'Configurar' : 'Configure',
    }
    const deleteActionObject = {
        MX: `Si`,
        US: `Yes`,
    }
    const deleteCancelLabel = {
        MX: `No`,
        US: `No`,
    }
    const submitLabelFunction = () => {
        switch (action) {
            case 'delete':
                return deleteActionObject[lan]
            default:
                return actionObject[action] || ''
        }
    }
    const cancelLabelFunction = () => {
        switch (action) {
            case 'delete':
                return deleteCancelLabel[lan]
            default:
                return lan === 'MX' ? 'Cancelar' : 'Cancel'
        }
    }
    const switchLabelObject = {
        add: lan === 'MX' ? 'Activar modulo UPLOAD' : "Activate UPLOAD Module",
        edit: lan === 'MX' ? 'Activar modulo UPLOAD' : "Activate UPLOAD Module",
        // uploadActivated: lan === 'MX' ? 'Activar modulo UPLOAD' : "Activate UPLOAD Module",
        isActive: 'On/Off'
    }
    const pathObject = {
        '/dashboard/impresoras': lan === 'MX' ? 'Impresora' : 'Printer',
        '/dashboard/usuarios': lan === 'MX' ? 'Usuario' : 'User',
    }
    const concatenateTitle = () => {
        if (!action) return 'No action / No title'
        const actionTitle = actionObject[action] || 'No action'
        const pathTitle = pathObject[pathname] || 'No path'
        return `${actionTitle} ${pathTitle}`
    }
    return {
        submitLabel: submitLabelFunction(),
        cancelLabel: cancelLabelFunction(),
        switchLabel: switchLabelObject[action] || 'No action',
        path: pathObject[pathname] || 'No path',
        title: concatenateTitle(),
        formInputValues: formInputFunction(action),
        formswitchValues: formSwitchFunction(action),
    }
}
// const switchLabelObject =  {
//     uploadActivated: {
//         MX: 'Activar modulo UPLOAD',
//         US: 'Activate UPLOAD Module',
//     },
//     printerConfig: {
//         MX: 'On',
//         US: 'Off',
//     }
// }