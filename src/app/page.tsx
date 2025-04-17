"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { DoorOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const calculatePercentage = (elapsedTime: number, totalTime: number) => {
  return (elapsedTime / totalTime) * 100;
};

const getElapsedTime = (initialTime: number, remainingTime: number) => initialTime - remainingTime;

export default function Home() {
  const [focusTime, setFocusTime] = useState(25 * 60); // Default 25 minutes
  const [remainingTime, setRemainingTime] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // State to track if it's a break
  const [currentCycle, setCurrentCycle] = useState(0); // State to track the current cycle
  const [breakDuration, setBreakDuration] = useState(calculateBreakDuration(25 * 60)); // Default break duration
  const [initialFocusTime, setInitialFocusTime] = useState(focusTime);
  const [cycleInterval, setCycleInterval] = useState(focusTime + breakDuration);
  
  function calculateBreakDuration(focusTimeSeconds: number) {
    const focusTimeMinutes = focusTimeSeconds / 60;
    if (focusTimeMinutes < 30) {
      return (30 - focusTimeMinutes) * 60;
    } else {
        return (60 - focusTimeMinutes) * 60;
      }
  }
  const [open, setOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const timerId = useRef<number | null>(null);

  const totalCycles = 4; // 4-hour cycle
  // const cycleInterval = focusTime + breakDuration;
  const totalTime = totalCycles * cycleInterval;

  const startTimer = () => {
    if (timerId.current !== null) {
      return; // Prevent starting multiple timers
    }

    timerId.current = window.setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          setCurrentCycle((prevCycle) => (prevCycle + 1) % (totalCycles * 2));
          clearInterval(timerId.current!);
          timerId.current = null; // Clear the timer ID

          if (!isBreak) {
            toast({
              title: "Focus time ended!",
              description: "Time for a break.",
            });
            setIsBreak(true);
            setRemainingTime(breakDuration);
            setInitialFocusTime(breakDuration);

            setIsRunning(false); // Pause after focus time
          } else { 
            toast({
              title: "Break time ended!",
              description: "Back to work!",
            });
            setIsBreak(false);
            setRemainingTime(focusTime);
            setInitialFocusTime(focusTime);
            setIsRunning(false); // Pause after break time
          }
          return 0;
        }

        if (prevTime === 10) {
          setAnimationClass("animate-blink-once");
          setTimeout(() => {
            setAnimationClass("");
          }, 1000);
        } else if (prevTime === 5) {
          setAnimationClass("animate-blink-twice");
          setTimeout(() => {
            setAnimationClass("");
          }, 1500);
        }

        return prevTime - 1;
      });
    }, 1000);
    setIsRunning(true);
    setIsPause(false);
  };

  const pauseTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null; // Clear the timer ID
      setIsRunning(false);
      setIsPause(true);
    }
  };

  const stopTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null; // Clear the timer ID
    }
    setIsRunning(false);
    setIsPause(false);
    setIsBreak(false);
    setRemainingTime(focusTime);
    setInitialFocusTime(focusTime);
  };

  // Update remaining time when focus time changes
  useEffect(() => {
    setRemainingTime(focusTime);
    setInitialFocusTime(focusTime);
    setBreakDuration(calculateBreakDuration(focusTime));
  }, [focusTime]);

  const percentage = calculatePercentage(remainingTime, initialFocusTime);
  const strokeDashoffset = 283-(283 * percentage) / 100;
  console.log(strokeDashoffset);

  return (    
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900/60 to-background text-foreground">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={() => window.close()}>
          <DoorOpen className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Focus Time</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Focus Time</DialogTitle>
            <DialogDescription>
              Adjust the focus duration for your Pomodoro sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="focusTime" className="text-right">
                Focus Time (minutes)
              </Label>
              <Input
                type="number"
                id="focusTime"
                value={focusTime / 60}
                onChange={(e) => {
                  const newFocusTime = parseInt(e.target.value);
                  setFocusTime(newFocusTime * 60);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setOpen(false)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative w-80 h-80 mt-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            transform="rotate(-90, 50, 50)"
            cx="50" cy="50" r="45"
            stroke="#565656"
            strokeWidth="4"
            fill="none"
          />          
          <circle
            cx="50" cy="50" r="45"
            transform="rotate(-90, 50, 50)"
            stroke="hsl(var(--foreground)/100)"
            className={`${animationClass}`}
            strokeWidth="4"
            fill="none"
            style={{
              strokeDasharray: 283, strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.3s ease 0s',
            }}            
          />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold"
            style={{ fill: "#f0f0f0" }}
          >
            {formatTime(remainingTime)}
          </text>
        </svg>
      </div>

      <div className="mt-4 flex items-center space-x-2 opacity-60">
        {Array.from({ length: totalCycles }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="h-1 w-20 rounded-full bg-white/30 relative">            
              {(isRunning || isPause) && currentCycle === index * 2 && (                
                <div
                  className="absolute top-0 left-0 h-full bg-white/50"
                  style={{
                    width: `${calculatePercentage(
                      getElapsedTime(focusTime, remainingTime), focusTime
                    )}%`,
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              )}            
            </div>
            {index < totalCycles - 1 && (
              <div className="h-1 w-5 rounded-full bg-white/30 relative">
              {(isRunning || isPause) && currentCycle === index * 2 + 1 && (
                <div
                  className="absolute top-0 left-0 h-full bg-white/50"
                  style={{
                    width: `${calculatePercentage(
                      getElapsedTime(breakDuration, remainingTime), breakDuration
                    )}%`,
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 flex space-x-4">
      <Button
          variant="default"
          onClick={isRunning ? pauseTimer : startTimer}
        >        
          {isPause ? "Resume" : isRunning ? "Pause" : "Start"}
        </Button>


        <Button variant="stop" className={`${(isRunning || isBreak || isPause) ? "" : "hidden"}`} onClick={stopTimer}>Stop</Button>
      </div>
    </div>
  );
}

















