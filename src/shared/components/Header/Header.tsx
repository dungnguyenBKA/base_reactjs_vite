import React from "react";
import HeaderStyles from "./Header.module.scss";
import Row from "../Row";
import { HtmlProps } from "../../utility/Util";

interface HeaderProps extends HtmlProps<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode[];
}

const Header: React.FC<HeaderProps> = ({ title, actions, ref, ...rest }) => {
  return (
    <Row {...rest} className={`${HeaderStyles["header"]} p-2 gap-2`}>
      {title}
      {actions}
    </Row>
  );
};


