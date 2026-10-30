const dbValidators = require("./db_Validator")
const createAccessToken = require("./generar-jwt")
const googleVerify = require("./google-verify")
const uploadFiles = require("./upload-files")

module.exports = {
    ...dbValidators,
    ...createAccessToken,
    ...googleVerify,
    ...uploadFiles,
}