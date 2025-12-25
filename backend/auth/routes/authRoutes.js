import express from 'express';
import { login, register } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddl.js';
import { roleMiddleware } from '../middlewares/roleMiddl.js';


const router=express.Router();

router.post("/register",register);
router.post("/login",login);

// Protected route example
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

// Admin-only route example
router.get("/admin-data", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "This is admin-only data" });
});
export default router;