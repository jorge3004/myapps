// const { v4: uuidv4 } = require('uuid');
const path = require("path");
const fs = require("fs")
const uploadFilesFc = (files, validExtensions = ["gcode"], folder = "", tid = "") => {
    return new Promise((resolve, reject) => {
        const { fileJir3d } = files;
        const split = fileJir3d.name.split(".")
        const extension = split[split.length - 1]
        if (!validExtensions.includes(extension)) {
            return reject(`La extensión _${extension}_ no es permitida`)
        }
        // const newName = uuidv4() + "." + extension
        const newName = `${tid}_${new Date().getTime()}.gcode`
        const uploadPath = path.join(__dirname, '../uploads/', folder, newName);
        fileJir3d.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }
            resolve(uploadPath)
        });
    })
}
const getFilePath = (folder = "", file = "") => {
    if (folder === "gcodes" || folder === "repositorio")
        file = file + ".gcode"
    const filePath = path.join(__dirname, '../uploads/', folder, "/", file)
    if (fs.existsSync(filePath)) {
        return filePath
    }
    return false
}

module.exports = { uploadFilesFc, getFilePath }