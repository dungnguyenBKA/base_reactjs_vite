import React from "react";
import Assets from "../../../assets/Assets.ts";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import Row from "../../../shared/components/Row.tsx";
import useAuth from "../../../hooks/useAuth.ts";

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = (props) => {
  const {} = props;
    const { signOut, user } = useAuth();

    return <Row
    className={"flex flex-row p-3"}
    style={{
        alignItems: "center"
    }}>
      <img
        src={Assets.icAccton}
        style={{
            height: 60
        }}
        alt={""}
      />

      <div className={"flex-1"} />

      <Avatar label="A" shape="circle" />

      <p
        style={{
            padding: 4
        }}
      >{`Hello, ${user?.user_name}`}</p>

      <Button
        style={{
            padding: 4
        }}
        onClick={() => {
            signOut();
        }}
      >
          Log out
      </Button>
  </Row>
};

export default Header
