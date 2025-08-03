"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Link from "next/link";

export function SessionStarter() {
  const [config, setConfig] = useState({
    goalType: "time",
    goalValue: "",
    countdownDuration: 10,
    isHardcoreMode: false,
  });

  return (
    <div className="space-y-6 w-full max-w-sx flex items-start flex-col">
      <Tabs
        defaultValue="time"
        className="w-full"
        onValueChange={(value) =>
          setConfig((prev) => ({
            ...prev,
            goalType: value as "time" | "words",
            goalValue: "", // Reset goalValue when changing goalType
          }))
        }
      >
        <TabsList className="w-full">
          <TabsTrigger value="time" className="flex flex-1">
            ⏱️ Time-based
          </TabsTrigger>
          <TabsTrigger value="words" className="flex flex-1">
            📝 Word count target
          </TabsTrigger>
        </TabsList>
        <TabsContent value="time">
          <div className="space-y-3 pt-3">
            <Label className="font-medium">Minutes to write</Label>
            <Input
              type="number"
              placeholder="15"
              value={config.goalValue}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  goalValue: e.target.value,
                }))
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="words" className=" space-y-20">
          <div className="space-y-3 pt-3">
            <Label className="font-medium">Target word count</Label>
            <Input
              type="number"
              placeholder="500"
              value={config.goalValue}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  goalValue: e.target.value,
                }))
              }
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-3 w-full">
        <Label className="font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Countdown Duration
        </Label>
        <Select
          value={config.countdownDuration.toString()}
          onValueChange={(value) =>
            setConfig((prev) => ({
              ...prev,
              countdownDuration: Number(value),
            }))
          }
        >
          <SelectTrigger className="h-12 rounded-xl w-full ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {[3, 5, 10, 15, 30].map((seconds) => (
              <SelectItem
                key={seconds}
                value={seconds.toString()}
                className="rounded-lg"
              >
                {seconds} seconds
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hardcore"
            checked={config.isHardcoreMode}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                isHardcoreMode: e.target.checked,
              }))
            }
            className="w-5 h-5"
          />
          <Label
            htmlFor="hardcore"
            className="text-stone-700 dark:text-stone-300 font-medium"
          >
            <Tooltip>
              <TooltipTrigger> 💀 Hardcore Mode</TooltipTrigger>
              <TooltipContent>
                <p>
                  ⚠️ In hardcore mode, your text will be permanently deleted if
                  it fades completely.
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
        </div>
      </div>

      <Link
        className={
          "w-full " +
          (config.goalType && config.goalValue ? "" : "pointer-events-none")
        }
        href={{
          pathname: "/session",
          query: {
            goalType: config.goalType,
            goalValue: config.goalValue,
            countdownDuration: config.countdownDuration,
            isHardcoreMode: config.isHardcoreMode,
          },
        }}
      >
        <Button
          disabled={!config.goalType || !config.goalValue}
          className="w-full"
        >
          Start Writing {config.isHardcoreMode ? " 💀" : " ✍️"}
        </Button>
      </Link>
    </div>
  );
}
