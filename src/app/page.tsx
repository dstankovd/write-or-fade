import { Header, HeaderStat } from "@/components/header";
import { SessionStarter } from "@/components/session-starter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  return (
    <>
      <Header left={[<HeaderStat value="Write or Fade" />]} />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            New writing session
          </CardTitle>
          <CardDescription>
            Write continuously or watch your text disappear
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 items-center justify-center">
          <SessionStarter />
        </CardContent>
      </Card>
    </>
  );
}
