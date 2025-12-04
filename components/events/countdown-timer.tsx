'use client';

import { useState, useEffect } from 'react';
import { formatCountdown, getTimeUntilEvent } from '@/lib/events';
import type { Event } from '@/types';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  event: Event;
  className?: string;
  onComplete?: () => void;
}

export function CountdownTimer({ event, className, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeUntilEvent(event));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeUntilEvent(event));
    
    const interval = setInterval(() => {
      const newTimeLeft = getTimeUntilEvent(event);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event, onComplete]);

  if (!mounted || timeLeft <= 0) {
    return null;
  }

  const { days, hours, minutes, seconds } = formatCountdown(timeLeft);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <TimeUnit value={days} label="Days" />
      <span className="text-2xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={hours} label="Hours" />
      <span className="text-2xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={minutes} label="Min" />
      <span className="text-2xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={seconds} label="Sec" />
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
        <span className="text-2xl font-bold text-primary tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

interface CompactCountdownProps {
  event: Event;
  className?: string;
}

export function CompactCountdown({ event, className }: CompactCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeUntilEvent(event));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeUntilEvent(event));
    
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilEvent(event));
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (!mounted || timeLeft <= 0) {
    return null;
  }

  const { days, hours, minutes } = formatCountdown(timeLeft);

  if (days > 0) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        {days}d {hours}h left
      </span>
    );
  }

  if (hours > 0) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        {hours}h {minutes}m left
      </span>
    );
  }

  return (
    <span className={cn('text-sm text-orange-500 font-medium', className)}>
      {minutes}m left
    </span>
  );
}

