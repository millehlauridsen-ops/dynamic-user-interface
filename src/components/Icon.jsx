export default function Icon({ name, size = 22 }) {
  const paths = {
    palette: (
      <>
        <path d="M12 3a9 9 0 0 0 0 18h1.2a2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H18A3 3 0 0 0 21 12a9 9 0 0 0-9-9Z" />
        <circle cx="7.5" cy="10" r=".8" fill="currentColor" stroke="none" />
        <circle cx="10" cy="6.8" r=".8" fill="currentColor" stroke="none" />
        <circle cx="14.2" cy="7" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
    moon: (
      <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
    ),
    ticket: (
      <>
        <path d="M7 3h10v3a2 2 0 0 0 0 4v4a2 2 0 0 0 0 4v3H7v-3a2 2 0 0 0 0-4v-4a2 2 0 0 0 0-4Z" />
        <path d="M10 7h4M10 12h4M10 17h4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 8.5h18C21 15 18 15 18 8Z" />
        <path d="M10 20h4" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z" />
        <path d="M8 3v15M16 6v15" />
        <circle cx="16" cy="8" r="2.2" fill="white" />
        <path d="M16 10.2s-3-2.4-3-4.8a3 3 0 0 1 6 0c0 2.4-3 4.8-3 4.8Z" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="4" cy="6" r=".7" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r=".7" fill="currentColor" stroke="none" />
        <circle cx="4" cy="18" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
    "arrow-left": <path d="m14.5 5-7 7 7 7M8 12h11" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
