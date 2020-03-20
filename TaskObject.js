export default class TaskObject {
  constructor(args) {
    const { text, key, checked, timestamp, order } = args;
    this.text = text || "";
    this.key = key || Date.now();
    this.checked = checked || false;
    this.timestamp = timestamp || Date.now();
    this.order = order || 0;
  }
}
