const containsOnlyLatinCharactersRegex = new RegExp("[a-z ,.'-]");

export function containsOnlyLatinCharacters(value: string): boolean {
  return containsOnlyLatinCharactersRegex.test(value.toLowerCase());
}
