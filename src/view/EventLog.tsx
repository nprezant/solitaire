class EventRecord {
  public name: string;
  public time: number;

  constructor(name: string, time?: number) {
    this.name = name;
    this.time = time ?? performance.now();
  }
}

class EventLog {
  private eventHistory: Array<EventRecord> = [];

  private maxLen = 100;
  private cleanLen = 20;

  private maxClickTime = 200; // milliseconds
  private justHappenedTolerance = 200 // milliseconds

  public log(name: string, time?: number) {
    this.eventHistory.push(new EventRecord(name, time));
    this.clean();
  }

  public clean() {
    if (this.eventHistory.length > this.maxLen) {
      this.eventHistory.length = this.cleanLen;
    }
  }

  public wasClick(): boolean {

    var down = this.findRecentEvent('pointerdown');
    var up = this.findRecentEvent('pointerup');

    if (down === undefined || up === undefined) {
      return false;
    }

    if (performance.now() - up.time > this.justHappenedTolerance) {
      return false; // Must have just happened
    }

    if (up.time < down.time) {
      return false; // Must be down, then up.
    }

    if (up.time - down.time > this.maxClickTime) {
      return false; // Down then up real quick is a click
    }

    return true;
  }

  private findRecentEvent(name: string): EventRecord | undefined {

    for (let i = this.eventHistory.length - 1; i >= 0; --i) {
      const e = this.eventHistory[i];
      if (e.name === name) {
        return e;
      }
    }

    return undefined; // Not found
  }
}

export default EventLog;