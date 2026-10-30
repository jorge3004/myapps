import React, { useState, useEffect } from 'react';
import { socketJir3d } from '../helpers/socketJir3d';
import { useSelector } from 'react-redux';
import { editUser } from '../store/thunks/thunksUsers';
// import { userColor } from '../../../helpers/userColor';
import { useDispatch } from 'react-redux';
import { currentCentralTime } from '../helpers/timeHelper';


export const useSocket = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    // const [isConnected, setIsConnected] = useState(socketJir3d.connected);
    useEffect(() => {
        socketJir3d.connect();
        function onConnect() {
            socketJir3d.emit('jir3dUserConnected', { uid: user.uid, lastConnection: currentCentralTime });
        }
        function onDisconnect() {
            console.log('disconnected')
            // dispatch(editUser({ connected: false }, user.uid));
            // setIsConnected(false);
        }
        function onSendJir3dUserEvent() {
            // setIsConnected(false);
        }
        socketJir3d.on('connect', onConnect);
        socketJir3d.on('disconnect', onDisconnect);
        socketJir3d.on('jir3dUserConnected', onSendJir3dUserEvent);

        return () => {
            socketJir3d.disconnect()
            socketJir3d.off('connect', onConnect);
            socketJir3d.off('disconnect', onDisconnect);
            socketJir3d.off('jir3dUserConnected', onSendJir3dUserEvent);
        };
    }, []);
    // const { user } = useSelector(state => state.user)
    // const { text } = userColor(user)
    // const [value, setValue] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    // function onSubmit(event) {
    //     event.preventDefault();
    //     // setIsLoading(true);
    //     socketJir3d.emit('create-something', value, (msg) => {
    //         console.log(msg);
    //     })
    //     // socket.timeout(5000).emit('create-something', value, (msg) => {
    //     //     console.log(msg);
    //     //     setIsLoading(false);
    //     // });
    // }
    return
}

