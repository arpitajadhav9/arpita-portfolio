import { useState, useEffect, useCallback } from "react";

function HeroSentence({ sentences, reduced }) {
  const [text, setText] = useState("");
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const current = sentences[sentenceIdx];

  const tick = useCallback(() => {
    if (reduced || sentences.length <= 1) return;

    if (!isDeleting) {
      if (text.length < current.length) {
        setText(current.slice(0, text.length + 1));
      } else {
        setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (text.length > 0) {
        setText(current.slice(0, text.length - 1));
      } else {
        setIsDeleting(false);
        setSentenceIdx((prev) => (prev + 1) % sentences.length);
      }
    }
  }, [text, isDeleting, current, sentences.length, reduced]);

  useEffect(() => {
    if (reduced || sentences.length <= 1) return;
    const speed = isDeleting ? 35 : 65;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, reduced, sentences.length]);

  if (reduced || sentences.length <= 1) {
    return (
      <p className="hero-sentence hero-sentence--static">
        {sentences[0]}
      </p>
    );
  }

  return (
    <div className="hero-sentence-wrapper" aria-live="polite" aria-atomic="true">
      <span className="hero-sentence-prefix">&gt;&nbsp;</span>
      <p className="hero-sentence hero-sentence--typing">
        {text}
        <span className="hero-cursor" />
      </p>
    </div>
  );
}

export default HeroSentence;
