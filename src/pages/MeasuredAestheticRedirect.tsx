import { useEffect } from "react";

/** Hands off to the standalone Measured Aesthetic experience served from /public. */
export const MeasuredAestheticRedirect = () => {
  useEffect(() => {
    window.location.replace("/measured-aesthetic/index.html");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Opening the experience…</p>
    </main>
  );
};