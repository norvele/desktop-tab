import { injectable } from "inversify";
import { FormGroup } from "@/services/form/FormGroup";
import { FormControl } from "@/services/form/FormControl";
import type { FormChildren } from "@/services/form/types";
import type { Validator } from "@/utils/validation";
import type { FormControlConfig } from "@/services/form/types";

@injectable()
export class FormBuilderService {
  public group(children: FormChildren, validators: Validator<any>[] = []) {
    return new FormGroup(children, validators);
  }

  public control<Config extends FormControlConfig = FormControlConfig>(
    config: Config
  ) {
    return new FormControl(config);
  }
}
