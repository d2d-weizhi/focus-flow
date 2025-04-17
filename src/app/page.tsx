'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { DoorRight } from 'lucide-react';

const calculateBreakTime = (focusTime: number) => {
  return focusTime < 30 ? 30 - focusTime : 60 - focusTime;
};

const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="none"
        stroke="rgba(128, 128, 128, 0.3)"
        strokeWidth="20"
      />
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth="20"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

const TimerDisplay: React.FC<{ time: number }> = ({ time }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold">
      {formattedTime}
    </div>
  );
};

const CycleIndicator: React.FC<{ focusTime: number; breakTime: number; elapsedTime: number }> = ({ focusTime, breakTime, elapsedTime }) => {
  const totalCycleTime = focusTime + breakTime;
  const focusPercentage = (focusTime / totalCycleTime) * 100;
  const breakPercentage = (breakTime / totalCycleTime) * 100;
  const cycleProgress = (elapsedTime % totalCycleTime) / totalCycleTime * 100;

  const segments = [
    { percentage: focusPercentage, color: 'white' },
    { percentage: breakPercentage, color: 'teal' },
    { percentage: focusPercentage, color: 'white' },
    { percentage: breakPercentage, color: 'teal' },
  ];

  return (
    <div className="relative w-full h-4 flex items-center mb-4 rounded-full bg-gray-700/40 overflow-hidden">
      {segments.map((segment, index) => {
        return (
          <div
            key={index}
            style={{
              width: `${segment.percentage}%`,
              height: '100%',
              backgroundColor: segment.color,
            }}
          />
        );
      })}
      <div
        className="absolute top-0 left-0 h-full bg-accent/50"
        style={{
          width: `${cycleProgress > 100 ? 100 : cycleProgress}%`,
        }}
      ></div>
    </div>
  );
};

export default function Home() {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(calculateBreakTime(focusTime));
  const [time, setTime] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [elapsedCycles, setElapsedCycles] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [customFocusTime, setCustomFocusTime] = useState<number>(25);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const progress = (time / (isFocus ? focusTime * 60 : breakTime * 60)) * 100;

  const startTimer = useCallback(() => {
    if (timerId.current) return;

    timerId.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerId.current!);
          timerId.current = null;
          setElapsedTime(0);

          if (isFocus) {
            setIsFocus(false);
            setTime(breakTime * 60);
          } else {
            setIsFocus(true);
            setTime(focusTime * 60);
            setElapsedCycles(prevCycles => prevCycles + 1);
          }

          return 0;
        } else {
          setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
          return prevTime - 1;
        }
      });
    }, 1000);
  }, [isFocus, focusTime, breakTime]);

  const pauseTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  };

  const stopTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    setIsRunning(false);
    setIsFocus(true);
    setTime(focusTime * 60);
    setElapsedCycles(0);
    setElapsedTime(0);
  };

  const toggleTimer = () => {
    setIsRunning((prevIsRunning) => {
      if (!prevIsRunning) {
        startTimer();
      } else {
        pauseTimer();
      }
      return !prevIsRunning;
    });
  };

  useEffect(() => {
    setTime(focusTime * 60);
    setBreakTime(calculateBreakTime(focusTime));
  }, [focusTime]);

  useEffect(() => {
    if (time === 0) {
      stopTimer();
    }
  }, [time]);

  const applyCustomTime = () => {
    setFocusTime(customFocusTime);
    setOpen(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      <a href="#" className="absolute top-4 right-4 text-foreground hover:text-accent">
        <DoorRight className="h-6 w-6" />
      </a>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="absolute top-4 left-1/2 -translate-x-1/2 text-foreground hover:text-accent">
          <Button variant="ghost" size="sm">
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timer Settings</DialogTitle>
            <DialogDescription>
              Set a custom focus time. The break time will be calculated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="focusTime" className="text-right">
                Focus Time
              </Label>
              <Input id="focusTime" value={customFocusTime} className="col-span-3" onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setCustomFocusTime(value);
                }
              }} />
            </div>
            <Slider
              defaultValue={[customFocusTime]}
              max={59}
              step={1}
              onValueChange={(value) => {
                setCustomFocusTime(value[0]);
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={applyCustomTime}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <CircularProgress progress={100 - progress} />
        <TimerDisplay time={time} />
      </div>

      <CycleIndicator focusTime={focusTime} breakTime={breakTime} elapsedTime={elapsedTime} />

      <div className="flex gap-4 mt-8">
        <Button onClick={toggleTimer} className="w-32">
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button variant="destructive" onClick={stopTimer} className="w-32">
          Stop
        </Button>
      </div>
    </div>
  );
}

