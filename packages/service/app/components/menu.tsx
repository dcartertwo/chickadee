import type { FC } from "hono/jsx";

const Menu: FC<{ sid: string }> = ({ sid }) => {
  return (
    <div class="flex flex-col xs:flex-row gap-4 justify-between items-center">
      <SelectSite sid={sid} />
      <SelectTimeframe />
    </div>
  );
};
export default Menu;

const SelectSite: FC<{ sid: string }> = ({ sid }) => {
  const items = ["chickadee.me", "test.com"]; // TODO! get em

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

const SelectTimeframe: FC = () => {
  // TODO!
  const items = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];
  const selected = items[0];

  return (
    <select class="select">
      {items.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
