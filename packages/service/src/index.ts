import { Hono } from "hono";
import test from "./test";

const app = new Hono();

app.route("/test", test);

export default app;
