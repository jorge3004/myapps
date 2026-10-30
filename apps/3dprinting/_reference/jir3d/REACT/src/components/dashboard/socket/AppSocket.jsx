import React, { useState, useEffect } from 'react';
import { socketJir3d } from '../../../helpers/socketJir3d';
import { useSelector } from 'react-redux';
import { userColor } from '../../../helpers/userColor';

export const AppSocket = () => {
    const [isConnected, setIsConnected] = useState(socketJir3d.connected);
    function connect() {
        socketJir3d.connect();
    }

    function disconnect() {
        socketJir3d.disconnect();
    }
    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }
        function onDisconnect() {
            setIsConnected(false);
        }

        socketJir3d.on('connect', onConnect);
        socketJir3d.on('disconnect', onDisconnect);
        socketJir3d.on('create-something', onFooEvent);

        return () => {
            socketJir3d.off('connect', onConnect);
            socketJir3d.off('disconnect', onDisconnect);
            socketJir3d.off('foo', onFooEvent);
        };
    }, []);
    const { user } = useSelector(state => state.user)
    const { text } = userColor(user)
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function onSubmit(event) {
        event.preventDefault();
        // setIsLoading(true);
        socketJir3d.emit('create-something', value, (msg) => {
            console.log(msg);
        })
        // socket.timeout(5000).emit('create-something', value, (msg) => {
        //     console.log(msg);
        //     setIsLoading(false);
        // });
    }
    return (
        <div className="App">
            <ConnectionState isConnected={isConnected} />
            <ul>
                {
                    onFooEvent.events.map((event, index) =>
                        <li key={index}>{event}</li>
                    )
                }
            </ul>
            <div className='d-flex justify-content-center m-3'>
                <button onClick={connect}>Connect</button>
                <button onClick={disconnect}>Disconnect</button>
            </div>
            <p className={`text-center ${text}`}>State: {'' + isConnected}</p>
            <form onSubmit={onSubmit} className='d-flex justify-content-center'>
                <input onChange={e => setValue(e.target.value)} />
                <button type="submit" disabled={isLoading}>Submit</button>
            </form>        </div>
    )
}

