import { Controller, GET, POST } from "fastify-decorators";
import { FastifyRequest, FastifyReply } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { JSONSchemaType } from "ajv";

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

@Controller({ route: "/api/" })
export default class AuthController {
  @GET({ url: "/ping" })
  async ping() {
    return "pong\n";
  }

  @GET({ url: "authenticated" })
  async authenticated(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<{ authenticated: boolean; username?: string }> {
    const { authenticated, username } = request.session;
    return { authenticated: authenticated || false, username };
  }

  @POST({ url: "login", options: { schema: { body: loginDataSchema } } })
  async login(
    request: FastifyRequest<{ Body: LoginData }>,
    reply: FastifyReply
  ) {
    const { username, password } = request.body;
    let message = "";
    if (username === "spookdot" && password === "penis") {
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
