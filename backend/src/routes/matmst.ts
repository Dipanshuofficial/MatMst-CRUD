import { Router } from "express";
import {
  createMaterial,
  getAllMaterials,
  updateMaterial,
  deleteMaterial,
  bulkCreateMaterial,
} from "../controllers/matmst.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// Apply JWT authentication to all material routes
router.use(verifyToken);

router.post("/", createMaterial);
router.post("/bulk", bulkCreateMaterial);
router.get("/", getAllMaterials);
router.put("/:MatCode", updateMaterial);
router.delete("/:MatCode", deleteMaterial);

export default router;
