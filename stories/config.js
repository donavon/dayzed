import { configure, storiesOf } from "@storybook/react";
import React from "react";

import Single from "./examples/single";
import Multi from "./examples/multi";
import MinMax from "./examples/minMax";
import MonthsToDisplay from "./examples/monthsToDisplay";
import Interesting from "./examples/interestingLayout";
import Range from "./examples/range";

function loadStories() {
  storiesOf("Examples", module)
    .add("Single Date Selection", () => <Single />)
    .add("Single Date (Monday)", () => <Single firstDayOfWeek={1} />)
    .add("Multi Date Selection", () => <Multi />)
    .add("Min and Max Date", () => <MinMax />)
    .add("Display Multiple Months", () => <MonthsToDisplay />)
    .add("Range", () => <Range />)
    .add("Interesting Layout", () => <Interesting />)
}

configure(loadStories, module);
