import { useRef, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  const currentValue = useRef(value);

  function updateValue(nextValue) {
    const next = typeof nextValue === "function"
      ? nextValue(currentValue.current)
      : nextValue;
    // Gem før navigation, så den næste side kan læse de opdaterede data.
    window.localStorage.setItem(key, JSON.stringify(next));
    currentValue.current = next;
    setValue(next);
  }

  return [value, updateValue];
}
