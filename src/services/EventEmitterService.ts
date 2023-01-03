import { injectable } from "inversify";

type EventCode = string;
type ListenerId = string;
type ListenerCallback<P = any> = (payload: P) => void;

interface Listener<P = any> {
  id: ListenerId;
  eventCode: EventCode;
  callback: ListenerCallback<P>;
}

@injectable()
export class EventEmitterService {
  protected listeners: Listener[] = [];

  public on<T>(
    eventCode: EventCode,
    callback: ListenerCallback<T>
  ): ListenerId {
    const id = (Date.now().toString() + Math.random().toString()) as ListenerId;

    this.listeners.push({
      id,
      eventCode,
      callback,
    });
    return id;
  }

  public remove(id: ListenerId) {
    const index = this.listeners.findIndex((listener) => listener.id === id);
    this.listeners.slice(index, 1);
  }

  public emit(eventCode: EventCode, payload?: any) {
    this.listeners.forEach((listener) => {
      if (listener.eventCode !== eventCode) {
        return;
      }
      listener.callback(payload);
    });
  }
}
