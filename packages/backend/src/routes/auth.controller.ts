import { Controller, GET, POST } from "fastify-decorators";
import { FastifyRequest, FastifyReply } from "fastify";
import { JSONSchemaType } from "ajv";
import { hash, verify } from "argon2";
import { UserModel } from "../models/User";

interface LoginData {
  username: string;
  password: string;
}

const loginDataSchema: JSONSchemaType<LoginData> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["username", "password"],
};

@Controller({ route: "/api/user/" })
export default class AuthController {
  @GET({ url: "authenticated" })
  async authenticated(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<{ authenticated: boolean; username?: string }> {
    const { authenticated, username } = request.session;
    return { authenticated: authenticated || false, username };
  }

  @POST({
    url: "changePassword",
    options: { schema: { body: loginDataSchema } },
  })
  async changePassword(
    request: FastifyRequest<{ Body: LoginData }>,
    reply: FastifyReply
  ) {
    const { username, password } = request.body;
    const user = await UserModel.findOne({ username });
    if (user !== null) {
      user.password = password;
      await user.save();
      return "Password change successfully";
    } else {
      reply.code(400);
      return "This user does not exist";
    }
  }

  @POST({ url: "register", options: { schema: { body: loginDataSchema } } })
  async register(
    request: FastifyRequest<{ Body: LoginData }>,
    reply: FastifyReply
  ) {
    const { username, password } = request.body;
    if (
      username === "" ||
      username === undefined ||
      password === "" ||
      password === undefined
    ) {
      reply.code(400);
      return { message: "Username and Password both need to be given" };
    }
    const passwordHash = await hash(password);
    const user = new UserModel({ username, password: passwordHash });
    await user.save();
    return { message: "User successfully created" };
  }

  @POST({ url: "login", options: { schema: { body: loginDataSchema } } })
  async login(
    request: FastifyRequest<{ Body: LoginData }>,
    reply: FastifyReply
  ) {
    const { username, password } = request.body;
    let message = "";
    const user = await UserModel.findOne({ username }, "password");
    if (user !== null && (await verify(user.password, password))) {
      request.session.set("authenticated", true);
      request.session.set("username", username);
      message = "Successful login";
    } else {
      reply.code(400);
      message = "Incorrect login";
    }
    return { message };
  }

  @POST({ url: "logout" })
  async logout(request: FastifyRequest, reply: FastifyReply) {
    request.session.set("authenticated", false);
    request.session.set("username", undefined);
    return { message: "Successfully logged out" };
  }
}
