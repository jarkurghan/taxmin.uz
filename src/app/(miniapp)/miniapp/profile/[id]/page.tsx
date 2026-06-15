"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { usersAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { PredictionCard } from "@/components/prediction-card";
import { getUserDisplayName } from "@/lib/utils";
import type { User, Prediction } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function MiniAppUserProfilePage({ params }: Props) {
  const { id } = use(params);
  const { isHydrated } = useAuth();
  const [data, setData] = useState<(User & { predictions: Prediction[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    usersAPI.getById(id).then(setData).finally(() => setIsLoading(false));
  }, [id, isHydrated]);

  if (!isHydrated || isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl h-52 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="rounded-2xl h-24 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-zinc-500 py-16">Foydalanuvchi topilmadi</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Profile card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="h-20"
          style={{
            background:
              "linear-gradient(135deg, rgba(30,27,75,0.7) 0%, rgba(7,8,13,0.9) 100%)",
          }}
        />

        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          {data.photoUrl ? (
            <Image
              src={data.photoUrl}
              alt=""
              width={76}
              height={76}
              className="rounded-full"
              style={{ border: "3px solid rgba(7,8,13,1)" }}
            />
          ) : (
            <div
              className="w-[76px] h-[76px] rounded-full text-white text-2xl flex items-center justify-center font-bold"
              style={{
                background: "linear-gradient(135deg, #22c55e, #15803d)",
                border: "3px solid rgba(7,8,13,1)",
              }}
            >
              {data.firstName[0]}
            </div>
          )}
        </div>

        <div className="pt-12 pb-6 px-5 text-center">
          <h1 className="text-xl font-bold text-zinc-100">{getUserDisplayName(data)}</h1>
          <div className="mt-4">
            <p className="text-4xl font-display font-bold text-gradient-green">{data.totalPoints}</p>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Jami ball</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em] flex-shrink-0">
            Taxminlar
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
        {data.predictions.length === 0 ? (
          <div className="text-center text-zinc-500 py-10">Taxmin yo'q</div>
        ) : (
          data.predictions.map((p) => (
            <PredictionCard key={p.id} prediction={{ ...p, user: data }} showMatch basePath="/miniapp" />
          ))
        )}
      </div>
    </div>
  );
}
