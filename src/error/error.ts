export class FooError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FooError.prototype);
  }

  get throwError() {
   return console.error(new FooError(this.message));
  }
}
