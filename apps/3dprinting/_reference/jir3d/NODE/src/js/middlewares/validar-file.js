const { request, response } = require("express")

const validarFileUpload = (req = request, res = response, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileJir3d) {
            return res.status(400).json({ msg: 'No files were uploaded.' });
        }
        next()
    } catch (e) {
        console.log(e);
        return res.status(400).json({ Error: e })
    }

}
module.exports = {
    validarFileUpload
}