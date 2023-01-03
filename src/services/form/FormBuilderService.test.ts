import { describe, expect, test } from "vitest";
import { ServiceType } from "@/serviceTypes";
import type { FormBuilderService } from "@/services/form/FormBuilderService";
import setupFunctionalTest from "@/test/setup";
import { createRequiredValidator, Validator } from "@/utils/validation";
import type { FormGroup } from "@/services/form/FormGroup";
import type { FormControl } from "@/services/form/FormControl";
import { FormControlType } from "@/services/form/types";

const { container } = setupFunctionalTest();

const builder = container.get<FormBuilderService>(
  ServiceType.FormBuilderService
);

describe("FormBuilderService", () => {
  test("should create control", () => {
    const control = builder.control({
      type: FormControlType.Text,
      value: "test",
    });

    expect(control.getValue()).toBe("test");
    expect(control.getErrors().length).toBe(0);
  });

  test("should validate control", () => {
    const control = builder.control({
      type: FormControlType.Text,
      value: "",
      validators: [createRequiredValidator("errorMessage")],
    });

    expect(control.getValue()).toBe("");
    expect(control.getErrors()).toEqual(["errorMessage"]);
  });

  test("should create group", () => {
    const group = builder.group({
      email: builder.control({
        type: FormControlType.Text,
        value: "emailValue",
      }),
      password: builder.control({
        type: FormControlType.Text,
        value: "passwordValue",
      }),
    });

    expect(group.getValue()).toEqual({
      email: "emailValue",
      password: "passwordValue",
    });
    expect(group.getErrors().length).toBe(0);
  });

  test("should validate children of group", () => {
    const group = builder.group({
      email: builder.control({
        type: FormControlType.Text,
        value: "",
        validators: [createRequiredValidator("emailError")],
      }),
      password: builder.control({
        type: FormControlType.Text,
        value: "passwordValue",
      }),
    });

    expect(group.getErrors()).toEqual(["Every field must be valid"]);
  });

  test("should validate group using a custom validator", () => {
    const group = builder.group(
      {
        password: builder.control({
          type: FormControlType.Text,
          value: "123",
        }),
        passwordRepeat: builder.control({
          type: FormControlType.Text,
          value: "12345",
        }),
      },
      [
        new Validator<FormGroup>("customValidator", (group) => {
          const passwordControl = group.getChild<FormControl>("password");
          const passwordRepeatControl =
            group.getChild<FormControl>("passwordRepeat");
          if (passwordControl.getValue() !== passwordRepeatControl.getValue()) {
            return "Passwords must match";
          }
        }),
      ]
    );

    expect(group.getErrors()).toEqual(["Passwords must match"]);

    group.getChild<FormControl>("passwordRepeat").setValue("123");

    expect(group.getErrors()).toEqual([]);
  });
});
