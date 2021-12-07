export function stopPropagation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  e.preventDefault();
  e.stopPropagation();
}
