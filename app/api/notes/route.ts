import { NextResponse } from "next/server";
import { createNote } from "@/lib/dashboard-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const note = await createNote(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create note." },
      { status: 500 }
    );
  }
}
