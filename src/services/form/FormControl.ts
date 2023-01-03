import { getRandomString } from "@/utils/getRandomString";
import { combineValidators } from "@/utils/validation";
import type { FormItem } from "@/services/form/types";
import type { Ref } from "vue";
import { ref } from "vue";
import type { BaseFormControlConfig } from "@/services/form/types";
import type { FormControlConfig } from "@/services/form/types";

export class FormControl<
  Config extends BaseFormControlConfig<any, any> = FormControlConfig
> implements FormItem
{
  protected id: string;
  protected value = ref() as Ref<Config["value"]>;
  protected config = ref() as Ref<Config>;
  protected validators: Config["validators"] = [];

  constructor(config: Config) {
    this.id = getRandomString(10);
    this.value.value = config.value;
    this.config.value = config;
    this.validators = config.validators || [];
  }

  public getId() {
    return this.id;
  }

  public getErrors() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const validator = combineValidators(...this.validators!);
    const result = validator.validate(this.value.value);
    if (result) {
      return ([] as string[]).concat(result);
    }
    return [];
  }

  public setValue(value: Config["value"]) {
    this.value.value = value;
  }

  public getValue(): Config["value"] {
    return this.value.value;
  }

  public setConfig(config: Config) {
    this.config.value = config;
  }

  public getConfig(): Config {
    return this.config.value;
  }
}
