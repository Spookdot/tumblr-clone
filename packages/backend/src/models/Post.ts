import { Schema, model, Types } from "mongoose";

export interface Post {
  author?: Types.ObjectId;
  title: string;
  content: string;
  tags?: Array<Types.ObjectId>;
}

const postSchema = new Schema<Post>({
  author: { type: Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
});

export const PostModel = model<Post>("Post", postSchema);
