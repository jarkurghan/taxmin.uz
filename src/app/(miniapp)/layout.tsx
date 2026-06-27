import { MiniAppAuthProvider } from "@/components/miniapp-auth-provider";
import { MiniAppHeader } from "@/components/miniapp-header";
import { MiniAppNavBar } from "@/components/miniapp-nav-bar";

export default function MiniAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MiniAppAuthProvider>
      <div className="min-h-screen pb-20">
        <MiniAppHeader />
        <main className="max-w-2xl mx-auto px-1 sm:px-4 py-1 sm:py-5">{children}</main>
        <MiniAppNavBar />
      </div>
    </MiniAppAuthProvider>
  );
}
