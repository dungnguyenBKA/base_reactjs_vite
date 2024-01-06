import React from "react";
import { HtmlProps } from "../utility/Util";

const Column = React.forwardRef<HTMLDivElement, HtmlProps<HTMLDivElement>>((props, ref) => {
  return <div
    ref={ref}
    {...props}
    className={"flex flex-column " + props.className}
  />;
})

export default Column;
