const emailRegexSimple = new RegExp("[.*@*...*]");

export function isValidishEmail(value: string): boolean {
  return emailRegexSimple.test(value);
}
