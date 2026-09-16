import { LayoutGroup } from "motion/react";
import { Outlet } from "react-router-dom";

import {ScrollToHash} from "../../components";

export default function RouterLayout() {
    return (
        <LayoutGroup>
            <ScrollToHash />
            <Outlet />
        </LayoutGroup>
    );
}