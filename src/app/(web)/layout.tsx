import { Header } from "@/components/header";
import { AuthProvider } from "@/components/auth-provider";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthProvider>
  );
}
