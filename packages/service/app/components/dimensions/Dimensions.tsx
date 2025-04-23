import { type FC } from "hono/jsx";
import {
  IDimensionBars,
} from "../../lib/models";
import DimensionCardSource from "./DimensionCardSource";
import DimensionCardPage from "./DimensionCardPage";
import DimensionCardLocation from "./DimensionCardLocation";
import DimensionCardDevice from "./DimensionCardDevice";

const Dimensions: FC<{
  dimensions: IDimensionBars[];
}> = ({ dimensions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DimensionCardSource dimensions={dimensions} />
      <DimensionCardPage dimensions={dimensions} />
      <DimensionCardLocation dimensions={dimensions} />
      <DimensionCardDevice dimensions={dimensions} />
    </div>
  );
};

export default Dimensions;
