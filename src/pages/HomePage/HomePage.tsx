import React from "react";
import useAuth from "../../hooks/useAuth.ts";
import { Button } from "primereact/button";
import Assets from "../../assets/Assets.ts";
import { Avatar } from "primereact/avatar";
import "./styles/HomePage.scss";
import Scaffold, { TypeLoading } from "../../shared/components/Scaffold/Scaffold.tsx";
import usePageState from "../../hooks/usePageState.ts";

const HomePage: React.FC = () => {
  const { signOut, user } = useAuth();
  const { isLoading, setLoading, repository } = usePageState();

  return (
    <Scaffold
      isLoading={isLoading}
      typeLoading={TypeLoading.OVERLAY}>
      <div className="home-page-wrapper">
        <div
          className={"flex flex-row p-3"}
          style={{
            alignItems: "center"
          }}
        >
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
          >{`Hello, ${user?.username}`}</p>

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
        </div>
      </div>
    </Scaffold>
  );
};

export default HomePage;
