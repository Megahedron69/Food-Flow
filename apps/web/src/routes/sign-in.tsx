import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input
} from "@foodflow/ui";

export function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Connect Supabase Auth flows here when auth policy is finalized.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input type="email" placeholder="Email" disabled />
          <Button disabled>Continue</Button>
        </CardContent>
      </Card>
    </main>
  );
}
