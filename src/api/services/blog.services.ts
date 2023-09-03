import { BlogModel } from "../models/blogModel";
import { authModel } from "../models/userModels";
import { blogInterface } from "../interfaces/blog.interface";
import CustomAPIError from "../helpers/custom-errors";
import { StatusCodes } from "http-status-codes";
import { validateMongoDbID } from "../helpers/validateDbId";

export const createBlog = async (blogPost: blogInterface) => {
  const newBlog = await BlogModel.create({ ...blogPost });
  if (!newBlog)
    throw new CustomAPIError(
      "Your Post was not created Successfully.",
      StatusCodes.BAD_REQUEST
    );
  return newBlog;
};

export const updateBlog = async (
  blogId: string,
  updateData: Partial<blogInterface>
) => {
  const updatepost = await BlogModel.findByIdAndUpdate(
    { _id: blogId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatepost)
    throw new CustomAPIError(
      `The blog with the id: ${blogId} was not found to be updated`,
      StatusCodes.NOT_FOUND
    );
  return updatepost;
};

export const getSingleBlog = async (blogID: string) => {
  const blogExists = await BlogModel.findById(blogID);
  if (!blogExists) {
    throw new CustomAPIError(
      `The blog with the ID ${blogID} does not exist`,
      StatusCodes.NOT_FOUND
    );
  }
  // Increment numViews by 1
  await BlogModel.findByIdAndUpdate(
    blogID,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );

  return blogExists;
};

export const getAllBlogs = async (): Promise<blogInterface[] | void> => {
  const allBlogs = await BlogModel.find();
  if (allBlogs.length <= 0) {
    throw new CustomAPIError(`No blogs found`, StatusCodes.NO_CONTENT);
  }
  return allBlogs;
};

export const deleteBlog = async (blogId: string) => {
  const blog = await BlogModel.findOneAndDelete({ _id: blogId });
  if (!blog)
    throw new CustomAPIError(
      `Blog with id: ${blogId} is not found`,
      StatusCodes.BAD_REQUEST
    );
};

export const likeBlogService = async (blogId: string, userId: string) => {
  
  // Find the blog which you want to be liked
  const blog = await BlogModel.findById(blogId);
  // validateMongoDbID(blogId);
  console.log("blog ID: ", blogId);

  if (!blog) {
    throw new CustomAPIError(
      `The blog with ID ${blogId} does not exist`,
      StatusCodes.NOT_FOUND
    );
  }

  const isLiked: boolean = blog.isLiked;

  // Check if the user has already disliked this blog
  const alreadyDisliked: boolean = blog.dislikes.some(
    (dislikedUserId) => dislikedUserId.toString() === userId
  );

  if (alreadyDisliked) {
    // Remove the user's dislike
    await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: userId },
        isDisliked: false,
      },
      { new: true }
    );
  }
  let updatedBlog;

  if (isLiked) {
    // Remove the user's like
    updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: userId },
        isLiked: false,
      },
      { new: true }
    );
  } else {
    // Add the user's like
    updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: userId },
        isLiked: true,
      },
      { new: true }
    );
  }

  return updatedBlog;
};