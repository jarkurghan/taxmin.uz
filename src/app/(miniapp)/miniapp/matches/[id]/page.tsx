"use client";

import { use } from "react";
import { MatchDetail } from "@/components/match-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default function MiniAppMatchPage({ params }: Props) {
  const { id } = use(params);
  return <MatchDetail id={id} basePath="/miniapp" />;
}
