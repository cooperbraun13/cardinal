import { NextResponse } from "next/server";
import { handleApi, requireUser } from "@/lib/api";
import { recommendSchema } from "@/lib/validation";
import { recommendCard } from "@/services/data";

export const POST = handleApi(async (req: Request) => {
  const user = await requireUser();
  const body = recommendSchema.parse(await req.json());
  const { recommendation, alternatives } = await recommendCard(user.id, body.category, body.amount);
  if (!recommendation) {
    return NextResponse.json({
      recommendedCard: null,
      alternatives: [],
      message: "Add an active card to get recommendations.",
    });
  }
  return NextResponse.json({
    recommendedCard: recommendation.cardName,
    rewardRate: recommendation.rewardRate,
    estimatedRewards: recommendation.estimatedRewards,
    recommendation,
    alternatives,
  });
});
