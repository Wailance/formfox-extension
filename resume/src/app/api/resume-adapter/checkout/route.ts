import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { requireUserIdFromRequest } from "@/lib/authServer";
import { RESUME_PRICING, type ResumePackKey } from "@/lib/resumePricing";

export async function POST(request: Request) {
  try {
    const userId = await requireUserIdFromRequest(request);

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!shopId || !secretKey || !appUrl) {
      return NextResponse.json(
        { error: "YooKassa or app URL is not configured" },
        { status: 500 }
      );
    }

    const { pack } = (await request.json()) as { pack?: ResumePackKey };

    if (!pack || !(pack in RESUME_PRICING)) {
      return NextResponse.json({ error: "pack is required" }, { status: 400 });
    }

    const selected = RESUME_PRICING[pack];
    const body = {
      amount: {
        value: selected.rub.toFixed(2),
        currency: "RUB"
      },
      confirmation: {
        type: "redirect",
        return_url: `${appUrl}/account?paid=1`
      },
      capture: true,
      description: `Адаптация резюме (${selected.credits} ${
        selected.credits === 1 ? "кредит" : "кредитов"
      })`,
      metadata: {
        pack,
        credits: String(selected.credits),
        amountRub: String(selected.rub),
        userId
      }
    };

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": randomUUID(),
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`
      },
      body: JSON.stringify(body)
    });

    const data = (await response.json()) as {
      id?: string;
      confirmation?: { confirmation_url?: string };
      description?: string;
    };

    if (!response.ok || !data.id || !data.confirmation?.confirmation_url) {
      return NextResponse.json(
        { error: data.description ?? "Failed to create YooKassa payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: `${data.confirmation.confirmation_url}`,
      paymentId: data.id
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

