import { useMemo, useState } from "react";

/**
 * Displays an image when available; falls back to a branded block with two-letter initials.
 */
const ImageInitials = ({ src, name, className = "", placeholderClass = "" }) => {
  const [failed, setFailed] = useState(false);

  const initials = useMemo(() => {
    if (!name) return "??";
    const letters = (name.match(/[A-Za-z]/g) || []).slice(0, 2);
    const text = letters.length ? letters.join("") : name.slice(0, 2);
    return text.toUpperCase();
  }, [name]);

  if (src && !failed) {
    return <img src={src} alt={name} className={className} onError={() => setFailed(true)} />;
  }

  return (
    <div className={`${placeholderClass || className} flex items-center justify-center bg-brand-50 text-brand-700 font-semibold`}>
      {initials}
    </div>
  );
};

export default ImageInitials;
