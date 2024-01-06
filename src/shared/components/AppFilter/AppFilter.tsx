import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import Row from "../Row";
import Column from "../Column";
import { SelectItem } from "primereact/selectitem";

export interface IOption {
  key: string;
  value: string;
}

export interface IFilterOptions {
  filter_by: IOption[];
  match_if: IOption[];
}

export type FilterValue = {
  [key in keyof IFilterOptions]: IOption
} & {
  content: string
}

type AppFilterProps = {
  filterOptions: IFilterOptions,
  setFilter: (request: FilterValue) => void,
  filterValue: FilterValue,
};

const AppFilter: React.FC<AppFilterProps> = (props) => {
  const { filterOptions, setFilter, filterValue } = props;

  const [filterByItem, setFilterByItem] = useState(filterValue.filter_by);
  const [matchIfItem, setMatchIfItem] = useState(filterValue.match_if);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleFilterData = () => {
    const request: FilterValue = {
      match_if: matchIfItem,
      filter_by: filterByItem,
      content: searchValue || ""
    };
    setFilter(request);
  };

  return (
    <Row className={"gap-2 p-2"} style={{
      background: "var(--surface-0)"
    }}>
      <Column
        className={"gap-1"}
        style={{
          flexGrow: 1
        }}>
        <span> Filter By</span>
        <Dropdown
          value={filterByItem}
          onChange={(e: DropdownChangeEvent) => {
            setFilterByItem(e.value as IOption);
          }}
          options={filterOptions.filter_by.map(item => {
            return {
              value: item,
              label: item.key
            } as SelectItem;
          })}
        />
      </Column>

      <Column
        style={{
          flexGrow: 1
        }}
        className={"gap-1"}>
        <span>Match If</span>
        <Dropdown
          value={matchIfItem}
          onChange={(e: DropdownChangeEvent) => {
            setMatchIfItem(e.value as IOption);
          }}
          options={filterOptions.match_if.map(item => {
            return {
              value: item,
              label: item.key
            } as SelectItem;
          })}
        />
      </Column>

      <Column
        style={{
          flexGrow: 3
        }}
        className={"gap-1"}>
        <span>Value</span>
        <InputText
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
          placeholder="Enter your key" />
      </Column>

      <Column style={{
        alignSelf: "self-end"
      }}>
        <Button onClick={handleFilterData}>Apply</Button>
      </Column>
    </Row>
  );
};

