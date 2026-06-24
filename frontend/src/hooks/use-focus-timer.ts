import { useState, useEffect, useRef } from 'react';

export type TimerMode = 'focus' | 'short_break' | 'long_break';

export interface UseFocusTimerReturn {
  mode: TimerMode;
  secondsLeft: number;
  isActive: boolean;
  totalDuration: number;
  notes: string;
  setNotes: (notes: string) => void;
  setMode: (mode: TimerMode) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  formattedTime: string;
}

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export function useFocusTimer(): UseFocusTimerReturn {
  const [mode, setModeState] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODE_DURATIONS.focus);
  const [isActive, setIsActive] = useState(false);
  const [notes, setNotes] = useState('');
  
  const timerRef = useRef<any>(null);

  const totalDuration = MODE_DURATIONS[mode];

  // Set mode & reset
  const setMode = (newMode: TimerMode) => {
    setModeState(newMode);
    setIsActive(false);
    setSecondsLeft(MODE_DURATIONS[newMode]);
  };

  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(MODE_DURATIONS[mode]);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Decoupled timer completion effect to toggle isActive off safely
  useEffect(() => {
    if (secondsLeft === 0 && isActive) {
      setIsActive(false);
    }
  }, [secondsLeft, isActive]);

  // Format time (tabular format)
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    mode,
    secondsLeft,
    isActive,
    totalDuration,
    notes,
    setNotes,
    setMode,
    toggleTimer,
    resetTimer,
    formattedTime,
  };
}
