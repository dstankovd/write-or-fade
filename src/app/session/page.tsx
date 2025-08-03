import Editor from "@/components/editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "lucide-react";

const parseParams = (searchParams: { [key: string]: string }) => {
  const goalType = searchParams["goalType"] ?? undefined;
  const goalValue = searchParams["goalValue"]
    ? parseInt(searchParams["goalValue"] ?? "0", 10)
    : undefined;
  const countdownDuration = searchParams["countdownDuration"]
    ? parseInt(searchParams["countdownDuration"] ?? "0", 10)
    : undefined;
  const isHardcoreMode = searchParams["isHardcoreMode"] === "true";

  if (!goalType || !["time", "words"].includes(goalType)) {
    return { error: "Invalid goal type" };
  }

  if (goalValue === undefined || isNaN(goalValue)) {
    return { error: "Invalid goal value" };
  }

  if (countdownDuration === undefined || isNaN(countdownDuration)) {
    return { error: "Invalid countdown duration" };
  }
  if (isHardcoreMode === undefined) {
    return { error: "Invalid hardcore mode" };
  }

  return {
    goalType: goalType as "time" | "words",
    goalValue: goalValue.toString(),
    countdownDuration,
    isHardcoreMode,
  };
};

export default async function Sample({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = parseParams(await searchParams);

  if (params.error) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Error</CardTitle>
          <CardDescription>{params.error}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center justify-center">
          <Button variant="outline" asChild>
            <Link href="/">Go Back</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Editor
      goalType={params.goalType as "time" | "words"}
      goalValue={params.goalValue as string}
      countdownDuration={params.countdownDuration as number}
      isHardcoreMode={params.isHardcoreMode as boolean}
    />
  );
}
