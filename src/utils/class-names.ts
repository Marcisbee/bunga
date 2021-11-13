type ClassNameOption = string | boolean | null | undefined;

export function cc(classNames: ClassNameOption[]): string {
  return classNames
    .filter((value) => {
      if (value == null || typeof value === 'boolean' || value === '') {
        return false;
      }

      return true;
    })
    .join(' ');
}
