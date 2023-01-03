import { getRandomString } from "@/utils/getRandomString";
import type { Validator } from "@/utils/validation";
import type { FormItem } from "@/services/form/types";
import {
  combineValidators,
  createGroupEveryValidValidator,
} from "@/utils/validation";
import type { FormChildren } from "@/services/form/types";

type GroupValue = {
  [key: string]: any;
};

export class FormGroup implements FormItem {
  protected id: string;
  protected children: FormChildren; // TODO: should be REF
  protected validators: Validator<FormGroup>[];

  constructor(
    children: FormChildren = {},
    validators: Validator<FormGroup>[] = []
  ) {
    this.id = getRandomString(10);
    this.children = children;
    this.validators = validators.length
      ? validators
      : [createGroupEveryValidValidator()];
  }

  public getId() {
    return this.id;
  }

  public getErrors() {
    const validator = combineValidators(...this.validators);
    const result = validator.validate(this);
    if (result) {
      return ([] as string[]).concat(result);
    }
    return [];
  }

  public getChildren(): FormChildren {
    return this.children;
  }

  public getChild<Item extends FormItem>(name: string): Item {
    const item = this.children[name] as Item | undefined;
    if (!item) {
      throw new Error(`Child with name "${name}" not found`);
    }
    return item;
  }

  public getValue(): GroupValue {
    const value = {} as GroupValue;
    for (const [name, child] of Object.entries(this.children)) {
      value[name] = child.getValue();
    }
    return value;
  }

  public setValue(value: GroupValue) {
    Object.entries(value).forEach(([name, v]) => {
      const child = this.getChild(name);
      child.setValue(v);
    });
  }
}
