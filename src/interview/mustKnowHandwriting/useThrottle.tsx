import React, { useState, useEffect, useRef } from "react";

/**
 * useThrottle hook
 * 限制值在 delay 时间内最多更新一次
 *
 * @param value - 要节流的值
 * @param delay - 节流时间（毫秒）
 * @returns 节流后的值
 */

function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const timeout = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - timeSinceLastExecution);

      return () => clearTimeout(timeout);
    }
  }, [value, delay]);

  return throttledValue;
}

const ThrottleDemo = () => {
  const [input, setInput] = useState("");
  const throttledInput = useThrottle(input, 1000);
  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <p>即时输入：{input}</p>
      <p>节流输出：{throttledInput}</p>
    </div>
  );
};

export default ThrottleDemo;
