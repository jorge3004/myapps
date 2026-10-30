const { Router } = require("express")

const {
    uploadFiles,
    getScript
} = require("../controllers/files_controller");

const router = Router()
router.get("/:fileFolder/:fileName", getScript)
router.get("/:fileFolder/:fileName/:nombre", getScript)
// router.post("/", uploadFiles)

module.exports = router;
