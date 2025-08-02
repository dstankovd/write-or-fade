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

export default function Sample() {
  const backButton = () => (
    <Link href="/">
      <Button variant="outline">Back</Button>
    </Link>
  );

  return (
    <>
      <Header
        left={[<HeaderStat label="Page" value="Sample" />]}
        right={[backButton()]}
      />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Sample page</CardTitle>
          <CardDescription>Sample page content goes here.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 items-center justify-center"></CardContent>
      </Card>
    </>
  );
}
