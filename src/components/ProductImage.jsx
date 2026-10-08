import { useState } from 'react';

export default function ProductImage({ src, name }) {
  const [bad, setBad] = useState(false);
  return (
    <div className="pimg">
      {src && !bad ? <img src={src} alt={name} loading="lazy" onError={() => setBad(true)} /> : (name || '?').charAt(0).toUpperCase()}
    </div>
  );
}
