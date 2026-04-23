import { NextResponse } from "next/server";
import { deleteNote } from "@/lib/dashboard-store";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await deleteNote(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete note." },
      { status: 500 }
    );
  }
}
