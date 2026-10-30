const { request, response, json } = require("express");
const { uploadFilesFc } = require("../helpers/upload-files");
const { searchGcodeParams } = require("../helpers/gcode");
const { Repositorio } = require("../models/repositorio");
const fs = require("fs")
const { Carrito } = require("../models/carrito");
const { Op } = require("sequelize");



const repositorioGet = async (req = request, res = response = response) => {
    const { uidOrfilename } = req.params
    try {
        const splitted = uidOrfilename.split("_").length
        let repositorio = {}
        if (splitted === 1)
            repositorio = await Repositorio.findAll({ where: { uid: uidOrfilename, estado: true }, group: 'tid' })
        else
            repositorio = await Repositorio.findOne({ where: { uploadPath: { [Op.substring]: uidOrfilename + ".gcode" } } })

        if (!repositorio)
            return res.status(404).json({ msg: "Repositorio no encontrado" })

        return res.json(repositorio)
    } catch (e) {
        console.log(e);
        return res.status(400).json({ Error: e })
    }
};
const repositorioGetAll = async (req = request, res = response = response) => {
    try {
        const repositorio = await Repositorio.findAll({ where: { estado: true }, group: 'tid' })
        return res.json(repositorio)
    } catch (e) {
        console.log(e);
        return res.status(400).json({ Error: e })
    }
};
const repositorioGetUidTid = async (req = request, res = response = response) => {
    // const { tidORfilename } = req.params
    const { uid, tidORfilename } = req.params

    try {
        let repositorio = {}
        repositorio = await Repositorio.findOne({
            where: {
                uid, uploadPath: { [Op.substring]: tidORfilename + ".gcode" }, estado: true
                // uid, uploadPath: { [Op.substring]: tidORfilename + ".gcode" }, estado: true
            }
        })
        if (!repositorio)
            repositorio = await Repositorio.findAll({ where: { uid, tid: tidORfilename, estado: true } })

        return res.json(repositorio)

    } catch (e) {
        console.log(e);
        return res.status(400).json({ Error: e })
    }

};
const repositorioGetUidTidDesc = async (req = request, res = response = response) => {
    const { uid, tid, desc } = req.params

    try {
        const repositorio = await Repositorio.findAll({
            where: {
                uid, tid, desc, estado: true
            }
        })
        // repositorio = await Repositorio.findOne({
        //     where: {
        //         uid, tid,
        //         [Op.or]: [{ desc: comodin }, { uploadPath: { [Op.substring]: comodin + ".gcode" } }], estado: true
        //     }
        // })
        return res.json(repositorio)

    } catch (e) {
        console.log(e);
        return res.status(400).json({ Error: e })
    }

};
const repositorioPost = async (req = request, res = response = response) => {
    const { tid, uid } = req.params
    const { desc } = req.body
    try {
        const uploadPath = await uploadFilesFc(req.files, undefined, "repositorio", tid)
        // const uploadPath = "/home/node/app/src/uploads/repositorio/44_1678904795928.gcode"
        let repositorio = await searchGcodeParams(uploadPath)
        repositorio = { ...repositorio, ...req.body, ...req.params, uploadPath }
        const carrito = await Carrito.findOne({ where: { tid, uid } })
        if (!carrito.uploaded)
            await carrito.update({ uploaded: true })

        const isRepoFound = await Repositorio.findOne({ where: { tid, uid, estado: false } })
        // const isRepoFound = await Repositorio.findOne({ where: { tid, uid, desc } })

        if (isRepoFound) {
            await isRepoFound.update({ ...repositorio, estado: true })
            await isRepoFound.save()
        } else {
            await Repositorio.create(repositorio)
        }

        res.json({ repositorio })
    } catch (e) {
        res.json({ msg: e })
    }

};
const repositorioPut = async (req = request, res = response, next) => {
    const { rid } = req.params
    try {
        const file = req.files?.fileJir3d
        const { desc } = req.body
        if (file) {
            const repositorio = await Repositorio.findOne({ where: { rid } })
            const { uploadPath, tid } = repositorio
            if (fs.existsSync(uploadPath)) {
                fs.unlinkSync(uploadPath)
            }
            const newuploadPath = await uploadFilesFc(req.files, undefined, "repositorio", tid)
            let newrepositorio = await searchGcodeParams(newuploadPath)
            repositorio.update({ ...newrepositorio, uploadPath: newuploadPath, desc })


            return res.json({ repositorio })
        } else {
            const repositorio = await Repositorio.findByPk(rid)
            if (!repositorio)
                return res.status(400).json({ msg: "No existe en base de datos" })
            const newRepo = await repositorio.update({ desc })
            return res.json(newRepo)
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ Error: e })
    }

}
const repositorioDelete = async (req = request, res = response, next) => {
    try {
        const { rid } = req.params
        const repositorio = await Repositorio.findOne({ where: { rid } })
        const { uploadPath, cid } = repositorio
        if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath)
        }
        await repositorio.update({ uploadPath: "", estado: false })
        const carrito = await Carrito.findOne({ where: { cid } })
        // const repositorio2 = await Repositorio.findOne({ where: { rid } })
        await carrito.update({ uploaded: false })
        return res.json({ repositorio })
    } catch (e) {
        console.log(e);
        return res.status(400).json({ Error: e })
    }

}
module.exports = {
    repositorioPost,
    repositorioGet,
    repositorioDelete,
    repositorioGetUidTid,
    repositorioGetUidTidDesc,
    repositorioPut,
    repositorioGetAll


}