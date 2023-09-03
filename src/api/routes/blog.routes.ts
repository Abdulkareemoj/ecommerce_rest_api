import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware";
import {
  create_new_blog,
  update_blog,
  get_single_blog,
  getallBlogs,
  deleteblog,
  likeBlogController,
} from "../controllers/blog.controllers";

const router = express.Router();

router.post("/posts", auth, isAdmin, create_new_blog);
router.patch("/posts/:id", auth, isAdmin, update_blog);
router.get("/posts/:id", auth, get_single_blog);
router.get("/posts", auth, getallBlogs);
router.delete("/posts/:id", auth, isAdmin, deleteblog);
router.put("/likes", auth, likeBlogController);

export default router;
