import React, {PropsWithChildren} from "react";
import LoadingPage from "../../../pages/LoadingPage/LoadingPage";

export enum TypeLoading {
  OVERLAY
}

interface ScaffoldProps extends PropsWithChildren {
  isLoading: boolean,
  error?: boolean,
  typeLoading?: TypeLoading
}

const Scaffold: React.FC<ScaffoldProps> = (props) => {
  const {children, isLoading, typeLoading, error} = props;

  if (!isLoading) {
    return children;
  }

  if (typeLoading == TypeLoading.OVERLAY) {
    return <div style={{
      position: "relative",
    }}>
      {children}
      <LoadingPage style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000
      }}/>
    </div>;
  }

  return <LoadingPage/>;
}

Scaffold.defaultProps = {
  typeLoading: TypeLoading.OVERLAY
}

export default Scaffold;
