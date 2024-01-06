import Column from "../Column";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { AppSelectItem } from "../../config/AppData";
import React, { useRef } from "react";
import styles from "./AppInputDropdown.module.scss";
import Row from "../Row.tsx";

interface AppInputDropdownProps<DataType> extends DropdownProps {
  label?: string;
  currentValue?: DataType;
  onChangeValue?: (newValue: DataType) => void;
  options?: AppSelectItem<DataType>[];
  errorText?: string;
  right?: React.ReactNode;
  orientation?: "col" | "row";
}

function AppInputDropdown<DataType>(props: AppInputDropdownProps<DataType>) {
  const {
    errorText,
    label,
    currentValue,
    onChangeValue,
    options,
    right,
    orientation = "row",
    style,
    ...rest
  } = props;
  const refLabel = useRef<HTMLDivElement>(null);
  const refRight = useRef<HTMLDivElement>(null);

  const Wrap = orientation === "row" ? Row : Column;

  return (
    <Column style={style}>
      <Wrap
        className="flex align-items-center">
        {
          label &&
          <div
            ref={refLabel}
            style={{
              minWidth: "219px",
              width: "220px",
              wordBreak: "break-word",
              color: props?.disabled ? "var(--gray-200)" : ""
            }}
          >
            <label>{label}</label>
          </div>
        }

        <div style={{
          width: `calc(100% - ${orientation === "row" ? (refLabel?.current?.clientWidth || 0) : 0}px - ${refRight?.current?.clientWidth || 0}px)`
        }}>
          <AppDropdown
            value={currentValue}
            onChange={(e) => {
              onChangeValue?.(e.value as DataType);
            }}
            style={{}}
            className="w-full"
            options={options}
            virtualScrollerOptions={{ itemSize: 38 }}
            {...rest} />
        </div>

        {
          right && <div ref={refRight}>{right}</div>
        }
      </Wrap>

      {errorText && (
        <small className="p-error mt-1" style={{ marginLeft: "220px" }}>
          {errorText}
        </small>
      )}
    </Column>
  );
}

interface AppDropdownProps<DataType> extends DropdownProps {
  label?: string;
  currentValue?: DataType;
  onChangeValue?: (newValue: DataType) => void;
  options?: AppSelectItem<DataType>[];
  errorText?: string;
}

export function AppDropdown<DataType>(props: AppDropdownProps<DataType>) {
  const {
    errorText,
    label,
    currentValue,
    onChangeValue,
    options,
    ...rest
  } = props;

  return (
    <Dropdown
      className={styles.dropdown}
      value={currentValue}
      onChange={(e) => {
        onChangeValue?.(e.value as DataType);
      }}
      options={options}
      {...rest}
    />
  );
}

