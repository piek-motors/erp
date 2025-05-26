export class DetailSequence {
  private static id = 0
  static next() {
    return ++this.id
  }
}
