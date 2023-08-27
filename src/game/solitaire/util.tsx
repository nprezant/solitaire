function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage);
}

export { throwExpression }