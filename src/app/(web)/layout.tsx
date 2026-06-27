import { Header } from "@/components/header";
import { NavBar } from "@/components/nav-bar";
import { AuthProvider } from "@/components/auth-provider";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen pb-20">
        <Header />
        <main className="max-w-2xl mx-auto px-1 sm:px-4 py-1 sm:py-5">{children}</main>
        <NavBar />
      </div>
    </AuthProvider>
  );
}
