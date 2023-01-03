import type { FormGroup } from "@/services/form/FormGroup";

export type Error = string;
export type ValidateFunction<V> = (value: V) => Error | Error[] | undefined;

export class Validator<V> {
  public name = "";
  public stopped = false;
  protected readonly validateCallback: ValidateFunction<V>;

  constructor(name: string, validateCallback: ValidateFunction<V>) {
    this.validateCallback = validateCallback;
    this.name = name;
  }

  public stop(): Validator<V> {
    this.stopped = true;
    return this;
  }

  public validate(value: V): Error | Error[] | undefined {
    return this.validateCallback(value);
  }
}

export function combineValidators<V>(
  ...validators: Validator<V>[]
): Validator<V> {
  const names = validators.map(({ name }) => name);
  return new Validator<V>(`Combined from ${names.join(", ")}`, (value) => {
    let errors = [] as string[];
    for (const validator of validators) {
      const errorsResult = validator.validate(value);
      if (!errorsResult) {
        continue;
      }
      errors = errors.concat(errorsResult);
      if (validator.stopped) {
        break;
      }
    }
    return errors;
  });
}

export function createRequiredValidator(
  errorMessage = `Please provide a valid value`
): Validator<any> {
  return new Validator("Required", (value) => {
    if (!value) {
      return errorMessage;
    }
    if (Array.isArray(value) && !value.length) {
      return errorMessage;
    }
  }).stop();
}

export function createLengthValidator({
  maxChars = 0,
  minChars = 0,
}: {
  maxChars?: number;
  minChars?: number;
}): Validator<string> {
  return new Validator("Length", (value) => {
    if (!value) {
      return;
    }
    if (value.length > maxChars) {
      return `Must be under ${maxChars} characters`;
    }
    if (value.length < minChars) {
      return `Must be at least ${minChars} characters long`;
    }
  });
}

export function createUrlValidator(): Validator<string> {
  return new Validator("Url", (value) => {
    if (!value) {
      return;
    }
    try {
      new URL(value);
    } catch (e) {
      return "Must be a valid URL";
    }
  });
}

export function createGroupEveryValidValidator(
  errorMessage = `Every field must be valid`
): Validator<FormGroup> {
  return new Validator("Group", (group) => {
    if (!group) {
      return;
    }
    const hasError = Object.values(group.getChildren()).some(
      (child) => child.getErrors().length
    );
    if (hasError) {
      return errorMessage;
    }
  });
}
