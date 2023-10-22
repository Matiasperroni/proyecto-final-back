import { Router } from 'express';
import { changeRole, addDocuments, getAllUsers, deleteInactiveUsers } from '../controllers/users.controller.js';
import uploader from '../utils/multer.js';

const router = Router();

router.get("/getusers", getAllUsers)
router.delete("/deleteinactive", deleteInactiveUsers)
router.get("/premium/:uid", changeRole)
router.post("/:uid/documents", uploader('documents').array('documents'), addDocuments)
router.get("/now", async (req, res) => {
    res.send(req.session.user)
})


export default router;