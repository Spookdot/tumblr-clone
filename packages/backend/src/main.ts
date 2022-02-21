import fastify from "fastify";
import fastifySessionPlugin from "@fastify/session";
import fastifyCookie from "fastify-cookie";
import { bootstrap } from "fastify-decorators";
import { resolve } from "path";

declare module "fastify" {
  interface Session {
    username?: string;
    authenticated: boolean;
  }
}

const server = fastify();
server.register(fastifyCookie);
server.register(fastifySessionPlugin, {
  cookieName: "sessionId",
  secret: "AN AMAZING COOKIE AWAITS YOU BEHIND THIS DOOR",
  cookie: { secure: false, sameSite: true },
});

server.register(bootstrap, {
  directory: resolve(__dirname, `routes`),
  mask: /\.controller\./,
});

server.listen(8080);
