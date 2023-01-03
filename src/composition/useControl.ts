interface Params<Value = unknown> {
  emit: (...args: any) => void;
  getValueFromEvent: (event: Event) => Value;
}

export const getControlEmits = <Value = unknown>() => ({
  "update:model-value": (_value: Value) => true,
  change: (_value: Value) => true,
});

export function useControl<Value = unknown>({
  emit,
  getValueFromEvent,
}: Params<Value>) {
  const emitInput = (value: Value) => {
    emit("update:model-value", value);
  };

  const emitChange = (value: Value) => {
    emit("change", value);
  };

  const emitInputAndChange = (value: Value) => {
    emitInput(value);
    emitChange(value);
  };

  const onInput = (event: Event) => {
    const value = getValueFromEvent(event);
    emitInput(value);
  };

  const onChange = (event: Event) => {
    const value = getValueFromEvent(event);
    emitChange(value);
  };

  return {
    emitInput,
    emitChange,
    emitInputAndChange,
    onInput,
    onChange,
  };
}
