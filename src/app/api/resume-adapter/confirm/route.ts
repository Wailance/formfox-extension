import { NextResponse } from "next/server";
import { requireUserIdFromRequest } from "@/lib/authServer";
import { addCreditsFromPayment, getCredits } from "@/lib/resumeCreditsDb";

export async function POST(request: Request) {
  try {
    const userId = await requireUserIdFromRequest(request);

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) {
      return NextResponse.json({ error: "YooKassa is not configured" }, { status: 500 });
    }

    const { paymentId } = (await request.json()) as { paymentId?: string };
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId is required" }, { status: 400 });
    }

    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`
      }
    });
    const payment = (await response.json()) as {
      status?: string;
      paid?: boolean;
      metadata?: Record<string, string | undefined>;
      description?: string;
    };
    if (!response.ok) {
      return NextResponse.json(
        { error: payment.description ?? "Failed to fetch payment" },
        { status: 500 }
      );
    }

    if (!(payment.status === "succeeded" && payment.paid)) {
      return NextResponse.json({ error: "Payment is not completed" }, { status: 400 });
    }

    const metadataCredits = Number(payment.metadata?.credits ?? "0");
    const amountRub = Number(payment.metadata?.amountRub ?? "0");
    const packKey = String(payment.metadata?.pack ?? "");
    const metadataUser = payment.metadata?.userId;
    if (!metadataCredits || Number.isNaN(metadataCredits) || !amountRub || !packKey) {
      return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 });
    }

    if (metadataUser && metadataUser !== userId) {
      return NextResponse.json({ error: "User mismatch" }, { status: 400 });
    }

    const result = await addCreditsFromPayment({
      userId,
      paymentId,
      credits: metadataCredits,
      amountRub,
      packKey
    });

    return NextResponse.json({ remaining: result.remaining ?? (await getCredits(userId)) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

