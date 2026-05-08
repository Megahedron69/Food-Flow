export function AuthLoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="text-center">
        <p className="font-display text-xl font-semibold">FoodFlow</p>
        <p className="mt-2 text-sm text-muted-foreground">Restoring session...</p>
      </div>
    </div>
  );
}
