import React, { ForwardedRef, forwardRef } from "react";
import { DataTable, DataTableProps, DataTableValue } from "primereact/datatable";
import { Column, ColumnBodyOptions } from "primereact/column";
import _ from "lodash";
import "./BaseTable.scss";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type ColumnMapper<T> = {
  [key in keyof T]?: string;
};

export type ValueMapper<T> = {
  [key in keyof T]?: (data: T[key]) => React.ReactNode;
};

export type FilterSortField<T> = keyof T;

type OnlyTableProps<T> = {
  listData: T[];
  columnMapper?: ColumnMapper<T>;
  valueMapper?: ValueMapper<T> | ((item: T) => ValueMapper<T>);
  filterSortFields?: FilterSortField<T>[];
};

export type BaseTableProps<DataType extends DataTableValue> = DataTableProps<DataType[]> &
  OnlyTableProps<DataType>;

function BaseTableInner<DataType extends DataTableValue>(
  props: BaseTableProps<DataType>,
  ref: ForwardedRef<DataTable<DataType[]>>
) {
  const { listData, filterSortFields, valueMapper, columnMapper, ...rest } = props;
  const headerKeys = _.keys(columnMapper);
  const headerText = _.values(columnMapper);

  const isHaveFilter = Object.keys(filterSortFields ?? {}).length > 0;

  function renderColumn(): React.ReactNode {
    if (listData?.length === 0) {
      return headerKeys?.map((col, index) => {
        return <Column key={index} field={col} header={headerText[index]} />;
      });
    }
    const columns = Object.keys(listData[0]);
    return columns
      .filter((col) => (columnMapper ? columnMapper[col] : true))
      .map((col) => {
        const columnName = columnMapper ? columnMapper[col] : col.toUpperCase();
        return (
          <Column
            filter={filterSortFields?.includes(col)}
            sortable={filterSortFields?.includes(col)}
            body={(data: DataType, options: ColumnBodyOptions): React.ReactNode => {
              if (valueMapper) {
                if (typeof valueMapper == "function") {
                  return valueMapper(data)[col] ? valueMapper(data)[col]?.(data[col]) : JSON.stringify(data[col]);
                }
                return valueMapper[col] ? valueMapper[col]?.(data[col]) : JSON.stringify(data[col]);
              }
              return data[col];
            }}
            key={col}
            style={{
              maxWidth: "250px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              minWidth: "150px"
            }}
            field={col}
            header={columnName}
          />
        );
      });
  }


  return (
    <>
      <DataTable
        ref={ref}
        filterDisplay={isHaveFilter ? "row" : undefined}
        scrollHeight="100%"
        showGridlines
        reorderableColumns
        resizableColumns
        scrollable
        value={props.listData}
        style={{
          height: "100%",
          ...rest.style
        }}
        emptyMessage={() => {
          return <p style={{
            justifyContent: "center",
            textAlign: "center"
          }}>No data!</p>;
        }}
        {...rest}
      >
        {renderColumn()}
      </DataTable>
    </>
  );
}

const BaseTable = forwardRef(BaseTableInner);
export default BaseTable;
