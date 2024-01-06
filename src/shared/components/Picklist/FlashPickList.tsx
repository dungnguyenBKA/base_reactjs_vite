import { PickListProps } from "primereact/picklist";
import React, { useLayoutEffect, useRef, useState } from "react";
import { CloseModal } from "../../../hooks/useModal";
import BaseTable, { BaseTableProps, ColumnMapper, ValueMapper } from "../Table/BaseTable";
import { DataTable, DataTableValue } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import Column from "../Column";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import Row from "../Row";

export interface FlashPickListProps<DataType extends DataTableValue> extends PickListProps {
  close: CloseModal<DataType[]>,
  header?: string,
  selectedList: DataType[],
  sourceList: DataType[],
  idField: keyof DataType,
  filterBy?: Extract<keyof DataType, string>,
  columnMapper?: ColumnMapper<DataType>;
  valueMapper?: ValueMapper<DataType> | ((item: DataType) => ValueMapper<DataType>);
  tableProps?: Omit<BaseTableProps<DataType>, "listData">
}

function FlashPickList<DataType extends DataTableValue>(props: FlashPickListProps<DataType>) {
  const { tableProps, columnMapper, valueMapper, close, header, selectedList, sourceList, idField, filterBy } = props;
  
  const [source, setSource] = useState<DataType[]>(sourceList.filter(item => {
    return !selectedList.some(_item => _item[idField] === item[idField]);
  }));
  const [target, setTarget] = useState<DataType[]>(selectedList);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  
  const [sourceSelection, setSourceSelection] = useState<DataType[]>([]);
  const [selectedSelection, setSelectedSelection] = useState<DataType[]>([]);
  
  const tableSourceRef = useRef<DataTable<DataType[]>>(null);
  const tableTargetRef = useRef<DataTable<DataType[]>>(null);
  
  
  function reset() {
    setSourceSelection([]);
    setSelectedSelection([]);
  }
  
  function moveAllToSelected() {
    setSource([]);
    setTarget(sourceList);
    
    reset();
  }
  
  function moveAllToSource() {
    setSource(sourceList);
    setTarget([]);
    
    reset();
  }
  
  function moveToSelected() {
    const newTarget = [...sourceSelection, ...target];
    const newSource = sourceList.filter(data => !newTarget.some(item => item[idField] === data[idField]));
    
    setTarget(newTarget);
    setSource(newSource);
    
    reset();
  }
  
  function moveBackToSource() {
    const newSource = [...selectedSelection, ...source];
    const newTarget = sourceList.filter(data => !newSource.some(item => item[idField] === data[idField]));
    
    setTarget(newTarget);
    setSource(newSource);
    
    reset();
  }
  
  const [dialogWidth, setDialogWidth] = useState(0);
  
  useLayoutEffect(() => {
    setDialogWidth(dialogRef.current?.clientWidth || 1000);
  }, []);
  
  return <Dialog
    draggable={false}
    visible
    style={{
      width: "60%"
    }}
    header={header}
    onHide={close}>
    <Column className={"gap-2"}>
      <div
        ref={dialogRef}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <BaseTable
          ref={tableSourceRef}
          virtualScrollerOptions={{
            itemSize: 50
          }}
          selectionMode="multiple"
          selection={sourceSelection}
          onSelectionChange={(e) => setSourceSelection(e.value as DataType[])}
          dragSelection
          style={{
            width: dialogWidth / 2,
            border: `2px solid var(--surface-border)`,
            borderRadius: 4,
            overflow: "hidden"
          }}
          scrollHeight={"500px"}
          valueMapper={valueMapper}
          columnMapper={columnMapper}
          listData={source}
          {...tableProps as any}
        />
        
        <Column
          className={"gap-2 p-2 justify-content-center"}>
          <Button
            onClick={moveAllToSelected}
            icon={PrimeIcons.ANGLE_DOUBLE_RIGHT} />
          <Button
            onClick={moveToSelected}
            icon={PrimeIcons.ANGLE_RIGHT} />
          <Button
            onClick={moveBackToSource}
            icon={PrimeIcons.ANGLE_LEFT} />
          <Button
            onClick={moveAllToSource}
            icon={PrimeIcons.ANGLE_DOUBLE_LEFT} />
        </Column>
        
        <BaseTable
          ref={tableTargetRef}
          virtualScrollerOptions={{
            itemSize: 50
          }}
          style={{
            width: dialogWidth / 2,
            border: `2px solid var(--surface-border)`,
            borderRadius: 10,
            overflow: "hidden"
          }}
          selectionMode="multiple"
          selection={selectedSelection}
          onSelectionChange={(e) => setSelectedSelection(e.value as DataType[])}
          dragSelection
          scrollHeight={"500px"}
          valueMapper={valueMapper}
          columnMapper={columnMapper}
          listData={target}
          {...tableProps as any}
        />
      </div>
      
      <Row className={"flex align-content-center justify-content-center gap-2"}>
        {
          Object.keys(tableProps?.filterSortFields ?? {}).length > 0 &&
          <Button onClick={() => {
            tableSourceRef.current?.reset();
            tableTargetRef.current?.reset();
          }} label={"Clear Filter"} />
        }
        
        <Button onClick={() => close(target)} label={"Submit"} />
      </Row>
    
    </Column>
  </Dialog>;
}

export default FlashPickList;
