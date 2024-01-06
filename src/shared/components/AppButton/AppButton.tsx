import React from "react";
import { classNames } from "primereact/utils";
import { HtmlProps } from "../../utility/Util.ts";

interface AppButtonProps extends HtmlProps<HTMLDivElement>{

}

const AppButton: React.FC<AppButtonProps> = (props) => {
  const {className, ...rest} = props;
  return <div
    className={classNames("p-button", className)}
    {...rest}>
  </div>
};


