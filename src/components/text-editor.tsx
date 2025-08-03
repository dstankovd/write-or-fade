"use client";

import { Header, HeaderStat } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Sample() {
  const backButton = () => (
    <Link href="/">
      <Button variant="outline">Back</Button>
    </Link>
  );

  const [text, setText] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [fadeLevel, setFadeLevel] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGoalAchieved, setIsGoalAchieved] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(5);
  const [isHardcoreMode, setIsHardcoreMode] = useState(false);

  const [mounted, setMounted] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(Date.now());
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const getProgress = useCallback(() => {
    if (!goalType || !goalValue) return 0;

    if (goalType === "words") {
      return Math.min((wordCount / Number.parseInt(goalValue)) * 100, 100);
    } else if (goalType === "time") {
      const targetMinutes = Number.parseInt(goalValue);
      const elapsedMinutes = elapsedTime / 60;
      return Math.min((elapsedMinutes / targetMinutes) * 100, 100);
    }
    return 0;
  }, [goalType, goalValue, wordCount, elapsedTime]);

  // Check if goal is achieved
  useEffect(() => {
    if (sessionState === "writing" && !isGoalAchieved) {
      const progress = getProgress();
      if (progress >= 100) {
        setIsGoalAchieved(true);
        setSessionState("completed");
        setIsCountingDown(false);
        setFadeLevel(0);
        toast({
          title: "🎉 Goal Achieved!",
          description: "You can now safely copy your text. Great work!",
        });
      }
    }
  }, [getProgress, sessionState, isGoalAchieved, toast]);

  // Elapsed time tracker
  useEffect(() => {
    if (sessionState === "writing" && sessionStartTime) {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    }

    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, [sessionState, sessionStartTime]);

  // Countdown and fade logic
  useEffect(() => {
    if (sessionState === "writing" && !isGoalAchieved) {
      if (isCountingDown) {
        // Configurable countdown
        countdownTimerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              // Start continuous fading after countdown
              setIsCountingDown(false);
              startContinuousFade();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isCountingDown, sessionState, isGoalAchieved]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startContinuousFade = () => {
    fadeTimerRef.current = setInterval(() => {
      setFadeLevel((currentFade) => {
        const newFadeLevel = currentFade + 0.02;
        if (newFadeLevel >= 0.95) {
          return 0.95; // Cap at 95%
        }
        return newFadeLevel;
      });
    }, 100);
  };

  useEffect(() => {
    if (
      isHardcoreMode &&
      fadeLevel >= 0.95 &&
      sessionState === "writing" &&
      !isGoalAchieved &&
      text.length > 0
    ) {
      setText("");
      setFadeLevel(0);
      setIsCountingDown(false);

      if (fadeTimerRef.current) {
        clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }

      toast({
        title: "💀 Text Deleted!",
        description: "Your text has been permanently deleted. Keep writing!",
        variant: "destructive",
      });
    }
  }, [
    fadeLevel,
    isHardcoreMode,
    sessionState,
    isGoalAchieved,
    text.length,
    toast,
  ]);

  const stopContinuousFade = () => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    lastTypingTimeRef.current = Date.now();

    if (sessionState === "writing" && !isGoalAchieved) {
      stopContinuousFade();

      setIsCountingDown(true);
      setCountdown(countdownDuration);
      setFadeLevel(0);
    }
  };

  // Copy text
  const copyText = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Text copied!",
        description: "Your writing has been copied to clipboard.",
      });
    }
  };

  return (
    <>
      <Header
        left={[<HeaderStat label="Page" value="Sample" />]}
        right={[backButton()]}
      />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Session page</CardTitle>
          <CardDescription>Session page content goes here.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 items-center justify-center"></CardContent>
      </Card>
    </>
  );
}
