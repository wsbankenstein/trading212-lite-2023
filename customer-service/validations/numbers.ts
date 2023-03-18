const containsNumbersRegex = new RegExp(/[0-9]/);

export function containsNumbers(value: string): boolean {
  return containsNumbersRegex.test(value);
}
