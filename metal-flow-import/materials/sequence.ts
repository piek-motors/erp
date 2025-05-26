export class MaterialSequence {
  private static id = 0
  static next() {
    return ++this.id
  }
}
