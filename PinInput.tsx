
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  className?: string;
  defaultValue?: string;
}

const PinInput = ({ length = 3, onComplete, className, defaultValue }: PinInputProps) => {
  const [pin, setPin] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    // Auto-focus the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // If defaultValue is provided, set the pin
    if (defaultValue) {
      const defaultPin = defaultValue.split('').slice(0, length);
      const newPin = [...Array(length).fill('')];
      defaultPin.forEach((digit, index) => {
        if (index < length) newPin[index] = digit;
      });
      setPin(newPin);
    }
  }, [length, defaultValue]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    // Only allow numeric input
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // If input is filled, move to the next input
    if (value !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all digits are entered, call onComplete
    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const digits = pastedData.slice(0, length).split('');
    const newPin = [...pin];

    digits.forEach((digit, index) => {
      if (index < length) {
        newPin[index] = digit;
      }
    });

    setPin(newPin);

    // Focus the last filled input or the next empty one
    const lastFilledIndex = Math.min(digits.length - 1, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    // If all digits are entered, call onComplete
    if (newPin.every((digit) => digit !== '') || digits.length >= length) {
      onComplete(newPin.join(''));
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handleBlur = () => {
    setActiveIndex(null);
  };

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {pin.map((digit, index) => (
        <div 
          key={index} 
          className={cn(
            "cyber-border relative group",
            activeIndex === index && "animate-pulse"
          )}
        >
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            className={cn(
              "cyber-input w-16 h-16 text-center text-2xl font-future",
              "transition-all duration-300",
              "focus:animate-glow focus:scale-110 focus:shadow-[0_0_15px_rgba(155,135,245,0.7)]",
              "group-hover:shadow-[0_0_10px_rgba(155,135,245,0.3)]"
            )}
          />
          <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none"></div>
          <div className={cn(
            "absolute -z-10 inset-0 bg-gradient-to-r from-cyber-purple/20 to-cyber-blue/20 rounded-md opacity-0 transition-opacity",
            "group-hover:opacity-100"
          )}></div>
        </div>
      ))}
    </div>
  );
};

export default PinInput;
