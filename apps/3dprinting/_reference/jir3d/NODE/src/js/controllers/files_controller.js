const { request, response, json } = require("express");
const { uploadFilesFc, getFilePath } = require("../helpers/upload-files");
const { Impresora } = require("../models/impresora");
var fs = require('fs').promises
var fsn = require('fs')


const uploadFiles = async (req = request, res = response = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileJir3d) {
        res.status(400).json({ msg: 'No files were uploaded.' });
        return;
    }
    try {
        const name = await uploadFilesFc(req.files, undefined, "nuevo")
        res.json({ name })
    } catch (e) {
        res.json({ msg: e })
    }
};
const getScript = async (req = request, res = response) => {
    const { fileFolder, fileName, nombre } = req.params
    // function autoCorrect(text, correction) {
    //     const reg = new RegExp(Object.keys(correction).join("|"), "g");
    //     return text.replace(reg, (matched) => correction[matched]);
    // }
    try {
        if (nombre && (fileFolder === "gcodes" || fileFolder === "repositorio")) {
            printer = await Impresora.findOne({ where: { nombre } })
            const { nozzleTemp, bedTemp, bedParam } = printer
            const filePath = getFilePath(fileFolder, fileName)
            const data = await fs.readFile(filePath, 'utf8');
            // const correction = {
            //     "Z0 ;bedParam": "Z" + bedParam,
            //     "M104 S200": "M104 S" + nozzleTemp,
            //     "M109 S200": "M109 S" + nozzleTemp
            // };
            //M140 S40
            // M190 S40
            // M104 S180
            // M109 S180
            // var result = autoCorrect(data, correction)
            var result1 = data.replace(/M104 S\d+/g, "M104 S" + nozzleTemp);
            var result2 = result1.replace(/M109 S\d+/g, "M109 S" + nozzleTemp);
            var result3 = result2.replace(/M140 S\d+/g, "M140 S" + bedTemp);
            var result4 = result3.replace(/M190 S\d+/g, "M190 S" + bedTemp);
            var result = result4.replace(/Z\d+ ;bedParam/g, "Z" + bedParam);

            const tempPath = "/app/src/uploads/gcodes/temps/" + nombre
            await fs.writeFile(tempPath, result, 'utf8');
            return res.sendFile(tempPath)
        }
        const filePath = getFilePath(fileFolder, fileName)
        if (!filePath)
            return res.status(400).json({ msg: "File not found" })
        return res.sendFile(filePath)
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: e })
    }
}
module.exports = {
    uploadFiles,
    getScript
}