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
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

type SessionState = "idle" | "writing" | "fading" | "completed";

const parseParams = () => {
  const searchParams = useSearchParams();
  const goalType = searchParams.get("goalType") ?? undefined;
  const goalValue = searchParams.get("goalValue")
    ? parseInt(searchParams.get("goalValue") ?? "0", 10)
    : undefined;
  const countdownDuration = searchParams.get("countdownDuration")
    ? parseInt(searchParams.get("countdownDuration") ?? "0", 10)
    : undefined;
  const isHardcoreMode = searchParams.get("isHardcoreMode") === "true";

  if (!goalType || !goalValue || !countdownDuration) {
    toast.error("Invalid session parameters");
    return null;
  }

  if (isNaN(countdownDuration) || countdownDuration <= 0) {
    toast.error("Invalid countdown duration");
    return null;
  }

  if (!isNaN(goalValue) && goalValue <= 0) {
    toast.error("Invalid hardcore mode");
    return null;
  }

  if (!["time", "words"].includes(goalType)) {
    toast.error("Invalid goal type");
    return null;
  }

  return {
    goalType: goalType as "time" | "words",
    goalValue: goalValue.toString(),
    countdownDuration,
    isHardcoreMode,
  };
};

const ErrorComponent = ({ error }: { error: string }) => (
  <Card className="w-full max-w-md shadow-lg">
    <CardHeader className="text-center">
      <CardTitle className="text-3xl font-bold">Error</CardTitle>
      <CardDescription>{error}</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4 items-center justify-center">
      <Button variant="outline" asChild>
        <Link href="/">Go Back</Link>
      </Button>
    </CardContent>
  </Card>
);

export default function Sample() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [text, setText] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [fadeLevel, setFadeLevel] = useState(0);
  const [writingTime, setWritingTime] = useState(0);
  const [isGoalAchieved, setIsGoalAchieved] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const params = parseParams();
  if (!params) return <ErrorComponent error="Invalid session parameters" />;
  const { goalType, goalValue, countdownDuration, isHardcoreMode } = params;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    switch (sessionState) {
      case "idle":
        break;
      case "writing":
        if (getProgress() >= 100) {
          setIsGoalAchieved(true);
          setSessionState("completed");
          toast.success("Goal achieved! 🎉");

          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          return;
        }

        setCountdown((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            setSessionState("fading");
            return 0;
          }

          setWritingTime((prev) => prev + 1);
          return next;
        });
        break;

      case "fading":
        setFadeLevel((prev) => Math.min(prev + 0.1, 1));

        if (fadeLevel >= 1 && isHardcoreMode) {
          setText("");
          setFadeLevel(0);
          setSessionState("idle");
          setCountdown(countdownDuration);
          setWritingTime(0);
          toast.error("Text faded away!");
        }
        break;
    }
  }, [sessionState, elapsedTime, goalType, goalValue]);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const getProgress = useCallback(() => {
    if (!goalType || !goalValue) return 0;

    if (goalType === "words") {
      return Math.min((wordCount / Number.parseInt(goalValue)) * 100, 100);
    } else if (goalType === "time") {
      const targetMinutes = Number.parseInt(goalValue);
      const elapsedMinutes = writingTime / 60;
      return Math.min((elapsedMinutes / targetMinutes) * 100, 100);
    }
    return 0;
  }, [goalType, goalValue, wordCount, writingTime]);

  const countdownLabel = useCallback(() => {
    if (sessionState === "idle") return null;

    if (sessionState === "fading") {
      return (
        <div className="flex items-center gap-1 text-sm text-red-500 animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-bold">Fading</span>
        </div>
      );
    }

    let color = "text-foreground";
    if (countdown === 3) color = "text-red-100";
    else if (countdown === 2) color = "text-red-300";
    else if (countdown === 1) color = "text-red-500";

    return (
      <div className={`flex items-center gap-1 text-sm ${color}`}>
        <span className="font-bold">{countdown}</span>
      </div>
    );
  }, [sessionState, countdown]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (isGoalAchieved) return;
    if (sessionState !== "writing") {
      setSessionState("writing");
    }

    setCountdown(countdownDuration);
    setFadeLevel(0);
  };

  return (
    <>
      <Header
        left={[
          <HeaderStat label="Words" value={`${wordCount}`} />,
          <HeaderStat label="" value={`${getProgress().toFixed(0)}%`} />,
        ]}
        right={[
          countdownLabel(),
          <Link href="/">
            <Button variant="outline">Back</Button>
          </Link>,
        ]}
      />
      <div className="w-full max-w-4xl relative px-6">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={sessionState === "idle" ? "Start writing..." : ""}
          className="w-full h-96 bg-transparent text-foreground text-lg leading-relaxed resize-none outline-none placeholder:text-muted-foreground border-none"
          style={{
            opacity: 1 - fadeLevel,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </div>
    </>
  );
}
