import { MenuItemType } from "../types";
import MenuItem from "./menu-item";

const NestedMenu: React.FC<{ data: MenuItemType[]; isShowing: boolean; }> = ({ data, isShowing }) => (
    <nav>
        <ul className="space-y-1">
            {data.map((item) => <MenuItem key={item.label} item={item} level={0} isShowing={isShowing} />)}
        </ul>
    </nav>
);

export default NestedMenu