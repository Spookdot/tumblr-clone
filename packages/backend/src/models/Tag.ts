import { Schema, model, Types } from "mongoose";

export interface Tag {
  name: string;
  posts: Array<Types.ObjectId>;
}

const tagSchema = new Schema<Tag>({
  name: { type: String, required: true },
  posts: [{ type: Types.ObjectId, ref: "Post" }],
});

export const TagModel = model<Tag>("Tag", tagSchema);
