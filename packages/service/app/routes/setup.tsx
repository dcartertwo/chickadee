import { createRoute } from "honox/factory";
import { Footer, Header } from "../components/common";

export default createRoute(async (c) => {
  return c.render(<h1>TODO! Setup a new site!</h1>);
});
