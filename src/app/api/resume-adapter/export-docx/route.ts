import { NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text?: string };
  if (!text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const base = `resume-${randomUUID()}`;
  const txtPath = join(tmpdir(), `${base}.txt`);
  const docxPath = join(tmpdir(), `${base}.docx`);

  try {
    await writeFile(txtPath, text, "utf-8");
    await execFileAsync("textutil", ["-convert", "docx", txtPath, "-output", docxPath]);

    const docxBuffer = await readFile(docxPath);
    return new NextResponse(docxBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename=\"adapted-resume.docx\"'
      }
    });
  } finally {
    await unlink(txtPath).catch(() => undefined);
    await unlink(docxPath).catch(() => undefined);
  }
}

