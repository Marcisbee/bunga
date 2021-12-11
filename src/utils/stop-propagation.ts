export function stopPropagation(
  e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>,
) {
  e.stopPropagation();
}
