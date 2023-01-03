import type { SelectOption } from "@/types";
import type { Validator } from "@/utils/validation";

export interface FormItem<Value = unknown> {
  getId(): string;
  getErrors(): string[];
  getValue(): Value;
  setValue(value: Value): void;
}

export type FormChildren = Record<string, FormItem>;

export enum FormControlType {
  Text = "text",
  Select = "select",
  Number = "number",
  NumberFromRange = "numberFromRange",
  Checkbox = "checkbox",
  CheckboxString = "checkboxString",
}
export interface BaseFormControlConfig<Type extends FormControlType, Value> {
  type: `${Type}`;
  value: Value;
  validators?: Validator<Value>[];
  updateOn?: "change" | "input";
}
export type FormControlTextInputConfig = BaseFormControlConfig<
  FormControlType.Text,
  string
>;
export type FormControlNumberInputConfig = BaseFormControlConfig<
  FormControlType.Number,
  number
>;
export interface FormControlNumberFromRangeInputConfig
  extends BaseFormControlConfig<FormControlType.NumberFromRange, number> {
  min: number;
  max: number;
}
export interface FormControlSelectConfig
  extends BaseFormControlConfig<FormControlType.Select, string> {
  options: SelectOption[];
}
export type FormControlCheckboxConfig = BaseFormControlConfig<
  FormControlType.Checkbox,
  boolean
>;
export interface FormControlCheckboxStringConfig
  extends BaseFormControlConfig<FormControlType.CheckboxString, string> {
  checkedValue: string;
  uncheckedValue: string;
}
export type FormControlConfig =
  | FormControlTextInputConfig
  | FormControlNumberInputConfig
  | FormControlNumberFromRangeInputConfig
  | FormControlSelectConfig
  | FormControlCheckboxConfig
  | FormControlCheckboxStringConfig;
