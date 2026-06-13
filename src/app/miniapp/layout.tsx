import { AuthProvider } from "@/components/auth-provider";
import { MiniAppInit } from "./miniapp-init";

export const metadata = {
  title: "Taxminlar Ligasi",
};

export default function MiniAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MiniAppInit />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-lg mx-auto px-3 py-4">{children}</main>
      </div>
    </AuthProvider>
  );
}
