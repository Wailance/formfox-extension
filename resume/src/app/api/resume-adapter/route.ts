import { NextResponse } from "next/server";
import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { requireUserIdFromRequest } from "@/lib/authServer";
import { openai } from "@/lib/openai";
import { consumeCredit, getCredits } from "@/lib/resumeCreditsDb";
import { packList } from "@/lib/resumePricing";

const execFileAsync = promisify(execFile);

async function extractTextFromResume(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || file.type === "text/plain") {
    return file.text();
  }

  if (name.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const tempPath = join(tmpdir(), `resume-${randomUUID()}.docx`);

    try {
      await writeFile(tempPath, Buffer.from(arrayBuffer));
      const { stdout } = await execFileAsync("textutil", [
        "-convert",
        "txt",
        "-stdout",
        tempPath
      ]);
      return stdout;
    } finally {
      await unlink(tempPath).catch(() => undefined);
    }
  }

  throw new Error("Поддерживаются только .txt и .docx");
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserIdFromRequest(request);

    const formData = await request.formData();
    const vacancyText = String(formData.get("vacancyText") ?? "").trim();
    const resumeFile = formData.get("resumeFile");

    if (!vacancyText) {
      return NextResponse.json({ error: "vacancyText is required" }, { status: 400 });
    }

    if (!(resumeFile instanceof File)) {
      return NextResponse.json({ error: "resumeFile is required" }, { status: 400 });
    }

    const sourceResume = (await extractTextFromResume(resumeFile)).trim();
    if (!sourceResume) {
      return NextResponse.json({ error: "Could not read resume text" }, { status: 400 });
    }

    const currentCredits = await getCredits(userId);
    if (currentCredits <= 0) {
      return NextResponse.json(
        {
          error: "no credits left",
          code: "NO_CREDITS",
          remaining: currentCredits,
          pricing: packList
        },
        { status: 402 }
      );
    }

    const prompt = [
      "Ты опытный карьерный консультант по резюме на русском языке.",
      "Твоя задача: адаптировать исходное резюме под вакансию.",
      "Правила:",
      "1) Пиши естественно и по-человечески, без шаблонных ИИ-фраз.",
      "2) Не выдумывай факты и опыт, которых нет в исходном резюме.",
      "3) Усиливай релевантный опыт через формулировки, структуру и акценты.",
      "4) На выходе только готовый текст резюме для отправки, без пояснений.",
      "5) Язык: русский.",
      "",
      "Текст вакансии:",
      vacancyText,
      "",
      "Исходное резюме:",
      sourceResume
    ].join("\n");

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }]
        }
      ]
    });

    const adaptedResume = response.output_text?.trim();
    if (!adaptedResume) {
      return NextResponse.json({ error: "Failed to generate adapted resume" }, { status: 500 });
    }

    const consumeResult = await consumeCredit(userId);
    if (!consumeResult.ok) {
      return NextResponse.json(
        {
          error: "no credits left",
          code: "NO_CREDITS",
          remaining: consumeResult.remaining,
          pricing: packList
        },
        { status: 402 }
      );
    }

    return NextResponse.json({ adaptedResume, remaining: consumeResult.remaining });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

