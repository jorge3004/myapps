const { Router } = require("express")
// const { check } = require("express-validator")
const {
    validarCampos,
    validarFileUpload,
} = require("../middlewares");

const {
    repositorioPost,
    repositorioGet,
    repositorioGetAll,
    repositorioDelete,
    repositorioGetUidTid,
    repositorioGetUidTidDesc,
    repositorioPut
} = require("../controllers/repositorio_controller");


const router = Router()

router.get("/", repositorioGetAll)
router.get("/:uidOrfilename", repositorioGet)
router.get("/:uid/:tidORfilename", repositorioGetUidTid)
router.get("/:uid/:tid/:desc", repositorioGetUidTidDesc)
router.post("/:uid/:tid", validarFileUpload, repositorioPost)
router.put("/:rid", repositorioPut)
router.delete("/:rid", repositorioDelete)

module.exports = router;
