export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'ukendt';
  return new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}
