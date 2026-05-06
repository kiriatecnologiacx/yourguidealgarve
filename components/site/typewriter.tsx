"use client";

import { useEffect, useState } from "react";

export function Typewriter({
  phrases,
  className,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseAtEnd = 1600,
}: {
  phrases: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAtEnd?: number;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[index % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === phrase) {
      timeout = setTimeout(() => setDeleting(true), pauseAtEnd);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
    } else {
      timeout = setTimeout(
        () => {
          if (deleting) {
            setText(phrase.slice(0, text.length - 1));
          } else {
            setText(phrase.slice(0, text.length + 1));
          }
        },
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases, typeSpeed, deleteSpeed, pauseAtEnd]);

  return (
    <span className={`typewriter-caret ${className ?? ""}`}>{text}</span>
  );
}
