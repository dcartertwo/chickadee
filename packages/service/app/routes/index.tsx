import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.redirect("/chickadee.me"); // TODO! redirect to default sid
});
