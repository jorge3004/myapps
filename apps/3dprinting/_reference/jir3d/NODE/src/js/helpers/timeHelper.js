const currentTimeUTC = new Date();
const centralTimeOffset = 6 * 60 * 60 * 1000;
 const currentCentralTime = new Date(currentTimeUTC.getTime() - centralTimeOffset).toJSON();

module.exports = { currentCentralTime };
// export const currentCentralTime = () => {
    
//     return central;
// }
