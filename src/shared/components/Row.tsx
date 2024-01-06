import React from "react";
import { HtmlProps } from "../utility/Util";

const Row = React.forwardRef<HTMLDivElement, HtmlProps<HTMLDivElement>>((props, ref) => {
  return <div
    ref={ref}
    {...props}
    className={"flex flex-row " + props.className}
  />;
})

export default Row;
