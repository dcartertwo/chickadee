import type { FC } from "hono/jsx";
import type { ITimeframe } from "../lib/db";

const Menu: FC<{ sid: string; tf: ITimeframe }> = ({ sid, tf }) => {
  return (
    <div class="flex flex-col xs:flex-row gap-4 justify-between items-center">
      <SelectSite sid={sid} />
      <SelectTimeframe tf={tf} />
    </div>
  );
};
export default Menu;

const SelectSite: FC<{ sid: string }> = ({ sid }) => {
  const items = ["chickadee.me", "begehr.me", "404.com"]; // TODO! get em

  return (
    <details class="dropdown">
      <summary class="btn m-1 space-x-1">
        <span class="icon-[carbon--link] scale-150" />
        <span>{sid}</span>
        <span class="icon-[carbon--caret-down]" />
      </summary>
      <ul class="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
        {items.map((item) => (
          <li key={item}>
            <a href={`/${item}`}>{item}</a>
          </li>
        ))}
      </ul>
    </details>
  );
};

const SelectTimeframe: FC<{ tf: ITimeframe }> = ({ tf }) => {
  // TODO take from ZTimeframe
  const items = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  return (
    <select class="select">
      {items.map(({ label, value }) => (
        <option key={value} value={value} selected={tf === value}>
          {label}
        </option>
      ))}
    </select>
  );
};
