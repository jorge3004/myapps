import { io } from 'socket.io-client';
import { defaults } from '../data/initializations';

// "undefined" means the URL will be computed from the `window.location` object
const URL = defaults.jir3dAPIs.default
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socketJir3d = io(URL, {
    autoConnect: false
});