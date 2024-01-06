import { SelectItem } from "primereact/selectitem";

export interface AppSelectItem<T = any> extends SelectItem {
  value: T,
  label: string
}

export type NotDefined<T> = T | undefined | null

