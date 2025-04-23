import { Fragment, type FC } from "hono/jsx";
import type { IBar, IDimensionBars } from "../../lib/models";

export const DimensionsCardSource: FC<{
  dimensions: IDimensionBars[];
}> = ({ dimensions }) => {
  return (
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Top Sources</h2>

        <div class="tabs tabs-border">
          <DimensionTab
            group="source"
            label="Referrer"
            dimension={dimensions.find((d) => d.dimension === "ref")}
            isDefault={true}
          />
          <DimensionTab
            group="source"
            label="UTM Source"
            dimension={dimensions.find((d) => d.dimension === "utm_source")}
            isDefault={false}
          />
          <DimensionTab
            group="source"
            label="UTM Medium"
            dimension={dimensions.find((d) => d.dimension === "utm_medium")}
            isDefault={false}
          />
          <DimensionTab
            group="source"
            label="UTM Campaign"
            dimension={dimensions.find((d) => d.dimension === "utm_campaign")}
            isDefault={false}
          />
        </div>
      </div>
    </div>
  );
};

export const DimensionsCardPage: FC<{
  dimensions: IDimensionBars[];
}> = ({ dimensions }) => {
  return (
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Top Pages</h2>

        <div class="tabs tabs-border">
          <DimensionTab
            group="page"
            label="Path"
            dimension={dimensions.find((d) => d.dimension === "path")}
            isDefault={true}
          />
          <DimensionTab
            group="page"
            label="Hash"
            dimension={dimensions.find((d) => d.dimension === "hash")}
            isDefault={false}
          />
        </div>
      </div>
    </div>
  );
};

export const DimensionsCardLocation: FC<{
  dimensions: IDimensionBars[];
}> = ({ dimensions }) => {
  return (
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Top Locations</h2>

        <div class="tabs tabs-border">
          <DimensionTab
            group="location"
            label="Country"
            dimension={dimensions.find((d) => d.dimension === "country")}
            isDefault={true}
          />
          <DimensionTab
            group="location"
            label="Region"
            dimension={dimensions.find((d) => d.dimension === "region")}
            isDefault={false}
          />
          <DimensionTab
            group="location"
            label="City"
            dimension={dimensions.find((d) => d.dimension === "city")}
            isDefault={false}
          />
          <DimensionTab
            group="location"
            label="Timezone"
            dimension={dimensions.find((d) => d.dimension === "timezone")}
            isDefault={false}
          />
        </div>
      </div>
    </div>
  );
};

export const DimensionsCardDevice: FC<{
  dimensions: IDimensionBars[];
}> = ({ dimensions }) => {
  return (
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Top Devices</h2>

        <div class="tabs tabs-border">
          <DimensionTab
            group="device"
            label="Browser"
            dimension={dimensions.find((d) => d.dimension === "browser")}
            isDefault={true}
          />
          <DimensionTab
            group="device"
            label="OS"
            dimension={dimensions.find((d) => d.dimension === "os")}
            isDefault={false}
          />
          <DimensionTab
            group="device"
            label="Device"
            dimension={dimensions.find((d) => d.dimension === "device")}
            isDefault={false}
          />
          <DimensionTab
            group="device"
            label="Locale"
            dimension={dimensions.find((d) => d.dimension === "locale")}
            isDefault={false}
          />
        </div>
      </div>
    </div>
  );
};

// * Helper Components

const DimensionTab: FC<{
  group: string;
  label: string;
  dimension?: IDimensionBars;
  isDefault?: boolean;
}> = ({ group, label, dimension, isDefault }) => {
  return (
    <Fragment>
      <input
        type="radio"
        name={`tabs-${group}`}
        class="tab"
        aria-label={label}
        checked={isDefault ?? false}
      />
      <div class="tab-content p-4">
        <DimensionContent title="Referrer" bars={dimension?.bars ?? []} />
      </div>
    </Fragment>
  );
};

const DimensionContent: FC<{
  bars: IBar[];
  title?: string;
}> = ({ bars, title }) => {
  return (
    <div class="space-y-1">
      <div class="flex justify-between text-sm opacity-70 mb-2">
        <div>{title}</div>
        <div>Visitors</div>
      </div>

      {bars.map((bar) => (
        <div class="flex items-center justify-between py-2" key={bar.value}>
          <div class="flex items-center gap-2">
            <span>{bar.value}</span>
          </div>
          <span>{bar.count}</span>
        </div>
      ))}
    </div>
  );
};
