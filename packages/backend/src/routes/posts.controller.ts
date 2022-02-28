import { Controller, GET, POST } from "fastify-decorators";
import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { Types } from "mongoose";
import { JSONSchemaType } from "ajv";
import { Post, PostModel } from "../models/Post";
import { User, UserModel } from "../models/User";
import { Tag, TagModel } from "../models/Tag";

interface PostData {
  title: string;
  content: string;
  tags: Array<string>;
}

interface PostById {
  id: string;
}

interface PostSearch {
  q: string;
}

const postDataSchema: JSONSchemaType<PostData> = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    tags: { type: "array", items: { type: "string" }, default: [] },
  },
  required: ["title", "content"],
};

const postByIdSchema: JSONSchemaType<PostById> = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const postSearchSchema: JSONSchemaType<PostSearch> = {
  type: "object",
  properties: {
    q: { type: "string" },
  },
  required: ["q"],
};

@Controller({ route: "/api/posts/" })
export default class PostController {
  @POST({ url: "create", options: { schema: { body: postDataSchema } } })
  async create(request: Request<{ Body: PostData }>, reply: Reply) {
    if (!request.session.authenticated) {
      reply.code(400);
      return "You need to be logged in to post something";
    }

    const { title, content, tags } = request.body;
    const username = request.session.username;

    const author = await UserModel.findOne({ username }, "_id");
    if (!author) {
      reply.code(400);
      return "User doesn't exist";
    }

    const post = new PostModel({
      author: author._id,
      title,
      content,
      tags: [],
    });

    if (!post || post.tags === undefined) {
      reply.code(500);
      return "Was unable to create post";
    }

    for await (const tagName of tags) {
      let tag = await TagModel.findOne({ name: tagName }, "_id posts");
      if (!tag) {
        tag = new TagModel({ name: tagName, posts: [] });
      }
      tag.posts.push(post._id);
      post.tags.push(tag._id);
      await tag.save();
    }

    await post.save();
    return `Successfully created post ${post._id}`;
  }

  @GET({ url: "/", options: { schema: { querystring: postByIdSchema } } })
  async getPostById(
    request: Request<{ Querystring: PostById }>,
    reply: Reply
  ): Promise<Post | string> {
    const { id } = request.query;

    const post = await PostModel.findById(id, "title author content tags")
      .populate<{ tags: Array<Tag> }>("tags", "name")
      .populate<{ author: User }>("author", "username");

    if (post === null) {
      reply.code(400);
      return "Post doesn't exist";
    }

    return post;
  }

  @GET({
    url: "search",
    options: { schema: { querystring: postSearchSchema } },
  })
  async searchPosts(
    request: Request<{ Querystring: PostSearch }>,
    reply: Reply
  ): Promise<Array<Post | null> | string> {
    const { q: searchTerms } = request.query;
    const tagNames = searchTerms.split("+").flatMap((x) => x.split(" "));
    const tags: Array<Tag | null> = (
      await Promise.all(tagNames.map((name) => TagModel.findOne({ name })))
    ).filter((x) => {
      return x && x !== null;
    });

    let foundPosts: Array<Types.ObjectId> = tags.pop()!.posts;
    for (const tag of tags) {
      if (tag === null) {
        continue;
      }

      foundPosts = foundPosts.filter((x) => tag.posts.includes(x));
    }

    if (!foundPosts) {
      reply.code(400);
      return "No posts found with that Tag";
    }

    const posts = await Promise.all(
      foundPosts.map((_id) =>
        PostModel.findOne({ _id }, "title author").populate(
          "author",
          "username"
        )
      )
    );

    return posts;
  }
}
