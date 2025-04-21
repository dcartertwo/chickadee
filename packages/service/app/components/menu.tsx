import type { FC } from "hono/jsx";

const Menu: FC = () => {
  return (
    <div class="flex flex-row gap-4 justify-between">
      <SelectSite />

      <SelectTimeframe />
    </div>
  );
};
export default Menu;

const SelectSite: FC = () => {
  return (
    <details class="dropdown">
      <summary class="btn m-1">www.chickadee.me</summary>
      <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </details>
  );
};

const SelectTimeframe: FC = () => {
  return (
    <select class="select">
      <option disabled selected>
        Pick a color
      </option>
      <option>Crimson</option>
      <option>Amber</option>
      <option>Velvet</option>
    </select>
  );
};
