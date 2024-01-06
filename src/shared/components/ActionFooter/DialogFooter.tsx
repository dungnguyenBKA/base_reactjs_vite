import { Button } from "primereact/button";
import React from "react";
import Row from "../Row.tsx";
import styles from "./DialogFooter.module.scss"

interface ActionFooterProps {
  onSubmit?: () => void,
  onCancel?: () => void
}

function DialogFooter(props: ActionFooterProps) {
  const { onSubmit, onCancel } = props;

  return <Row className={`${styles.footDialog} gap-2`}>
    <div className={"flex-1"}/>
    <Button
      outlined
      severity="danger"
      label={"Cancel"}
      onClick={onCancel} />
    <Button label={"Submit"} onClick={onSubmit} />
  </Row>;
}


