import { MembersOf } from "./TypeUtils";

export default class MoveEvent {
  public accepted = false;
  public rejected = false;

  public get resolved(): boolean {
    return this.accepted || this.rejected;
  }

  private _accept;
  private _reject;

  public accept() {
    if (this.resolved) {
      console.warn('Event has already been resolved');
      return;
    }
    this.accepted = true;
    this._accept();
  }

  public reject() {
    if (this.resolved) {
      console.warn('Event has already been resolved');
      return;
    }
    this.rejected = true;
    this._reject();
  }

  constructor(accept: VoidFunction, reject: VoidFunction) {
    this._accept = accept;
    this._reject = reject;
  }
}
