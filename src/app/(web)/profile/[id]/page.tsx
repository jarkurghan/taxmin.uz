"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { usersAPI } from "@/lib/api";
import { PredictionCard } from "@/components/prediction-card";
import { getUserDisplayName } from "@/lib/utils";
import type { User, Prediction } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: Props) {
  const { id } = use(params);
  const [data, setData] = useState<(User & { predictions: Prediction[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersAPI.getById(id).then(setData).finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl h-48 animate-pulse" />
        <div className="bg-white rounded-2xl h-24 animate-pulse" />
      </div>
    );
  }

  if (!data) return <div className="text-center text-gray-400 py-12">Foydalanuvchi topilmadi</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        {data.photoUrl ? (
          <Image src={data.photoUrl} alt="" width={72} height={72} className="rounded-full mx-auto mb-3" />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-2xl flex items-center justify-center font-bold mx-auto mb-3">
            {data.firstName[0]}
          </div>
        )}
        <h1 className="text-xl font-bold">{getUserDisplayName(data)}</h1>
        {data.username && <p className="text-sm text-gray-500">@{data.username}</p>}
        <div className="mt-4">
          <p className="text-3xl font-bold text-blue-600">{data.totalPoints}</p>
          <p className="text-sm text-gray-500">jami ball</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-700">Taxminlar</h2>
        {data.predictions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Taxmin yo'q</div>
        ) : (
          data.predictions.map((p) => <PredictionCard key={p.id} prediction={{ ...p, user: data }} showMatch />)
        )}
      </div>
    </div>
  );
}
