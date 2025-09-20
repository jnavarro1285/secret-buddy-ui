import { useEffect, useState } from 'react'

/**
 * Simple text-based roulette animation: cycles through names for `duration` ms and then resolves with finalName.
 * Props:
 * - names: string[]
 * - duration: ms
 * - onFinish(name)
 */
export default function Roulette({ names = [], duration = 2500, selected = null, onFinish }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (names.length === 0) return;
    let elapsed = 0;
    const tick = 100;
    const id = setInterval(() => {
      elapsed += tick;
      setCurrent((prev) => (prev + 1) % names.length);
      if (elapsed >= duration) {
        clearInterval(id);
        onFinish && onFinish(names[current]);
      }
    }, tick);
    return () => clearInterval(id);
  }, [names]);

  if (names.length === 0) return null;

  return (
    <div className="w-full flex items-center justify-center">
      <div className="text-2xl font-mono p-6 bg-white rounded shadow-md">
        {names[current]}
      </div>
    </div>
  );
}
