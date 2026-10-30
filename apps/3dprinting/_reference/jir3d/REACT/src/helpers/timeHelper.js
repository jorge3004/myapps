const currentTimeUTC = new Date();
const centralTimeOffset = 6 * 60 * 60 * 1000;
export const currentCentralTime = new Date(currentTimeUTC.getTime() - centralTimeOffset);

// export const currentCentralTime = () => {
    
//     return central;
// }
