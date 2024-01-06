import React from "react";
import { InputText, InputTextProps } from "primereact/inputtext";
import Column from "./Column";
import Row from "./Row";
import { NotDefined } from "../config/AppData";
import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";

export type InputTextType = {
  TEXT: InputTextProps,
  MULTI_LINE: InputTextareaProps
}

interface AppInputTextProps<KEY extends keyof InputTextType> {
  label?: React.ReactNode;
  onTextChange?: (text: string) => void;
  errorText?: string;
  isRequired?: boolean;
  value: NotDefined<string>;
  textType?: KEY;
  additionProps?: InputTextType[KEY];
  onlyView?: boolean,
}

export default function AppInputText<TYPE extends keyof InputTextType>(props: AppInputTextProps<TYPE>) {
  const {
    value,
    label,
    isRequired,
    onTextChange,
    errorText,
    textType,
    onlyView = false
  } = props;

  function renderTextInput() {
    switch (textType) {
      case "MULTI_LINE": {
        const rest = props.additionProps as InputTextareaProps;

        return <InputTextarea
          className="w-full"
          id={`#${label}`}
          cols={3}
          onChange={(e) => {
            return onTextChange?.(e.target.value);
          }}
          value={value || ""}
          {...rest}
        />;
      }
      default: {
        const rest = props.additionProps as InputTextProps;

        return <InputText
          className="w-full"
          id={`#${label}`}
          onChange={(e) => {
            onTextChange?.(e.target.value);
          }}
          value={value || ""}
          {...rest}
        />;
      }
    }
  }

  return (
    <Column>
      <Row className="flex align-items-center">
        {
          label &&
          <Row
            style={{
              minWidth: "219px",
              width: "220px",
              wordBreak: "break-word"
            }}
            className="mb-1">
            {label} &nbsp; {
            isRequired ?
              <div style={{ color: "red" }}> *</div>
              :
              null
          }
          </Row>
        }

        <>
          {renderTextInput()}
        </>

      </Row>

      {
        errorText && (
          <small className="p-error mb-2">
            {errorText}
          </small>
        )
      }
    </Column>
  );
}


