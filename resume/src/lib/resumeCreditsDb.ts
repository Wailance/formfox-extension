import { supabaseAdmin } from "@/lib/supabase";

const CREDITS_TABLE = "resume_credits";
const PAYMENTS_TABLE = "resume_payments";

export async function getOrCreateCredits(userId: string) {
  const { data: existing, error: selectError } = await supabaseAdmin
    .from(CREDITS_TABLE)
    .select("user_id, credits")
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) throw new Error(selectError.message);
  if (existing) return existing.credits as number;

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from(CREDITS_TABLE)
    .insert({ user_id: userId, credits: 1 })
    .select("credits")
    .single();

  if (insertError) throw new Error(insertError.message);
  return (inserted?.credits as number) ?? 1;
}

export async function getCredits(userId: string) {
  return getOrCreateCredits(userId);
}

export async function consumeCredit(userId: string) {
  const current = await getOrCreateCredits(userId);
  if (current <= 0) return { ok: false as const, remaining: 0 };

  const { data, error } = await supabaseAdmin
    .from(CREDITS_TABLE)
    .update({ credits: current - 1 })
    .eq("user_id", userId)
    .select("credits")
    .single();

  if (error) throw new Error(error.message);
  return { ok: true as const, remaining: (data?.credits as number) ?? current - 1 };
}

export async function addCreditsFromPayment(params: {
  userId: string;
  paymentId: string;
  credits: number;
  amountRub: number;
  packKey: string;
}) {
  const { userId, paymentId, credits, amountRub, packKey } = params;

  const { data: existingPayment, error: paymentSelectError } = await supabaseAdmin
    .from(PAYMENTS_TABLE)
    .select("payment_id")
    .eq("payment_id", paymentId)
    .maybeSingle();
  if (paymentSelectError) throw new Error(paymentSelectError.message);
  if (existingPayment) {
    return { alreadyProcessed: true, remaining: await getOrCreateCredits(userId) };
  }

  const current = await getOrCreateCredits(userId);
  const next = current + credits;

  const { error: updateError } = await supabaseAdmin
    .from(CREDITS_TABLE)
    .update({ credits: next })
    .eq("user_id", userId);
  if (updateError) throw new Error(updateError.message);

  const { error: paymentInsertError } = await supabaseAdmin.from(PAYMENTS_TABLE).insert({
    payment_id: paymentId,
    user_id: userId,
    credits_added: credits,
    amount_rub: amountRub,
    pack_key: packKey
  });
  if (paymentInsertError) throw new Error(paymentInsertError.message);

  return { alreadyProcessed: false, remaining: next };
}

