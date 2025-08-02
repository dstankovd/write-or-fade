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

const pages = [{ key: "sample", label: "Sample", href: "/sample" }];

export default function App() {
  return (
    <>
      <Header left={[<HeaderStat label="App" value="Boilerplate" />]} />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">App boilerplate</CardTitle>
          <CardDescription>
            Quick start next.js + tailwindcss + shadcn
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 items-center justify-center">
          {pages.map((page) => (
            <Button key={page.key} size="lg" asChild>
              <Link className="w-full max-w-xs text-lg py-6" href={page.href}>
                {page.label}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
