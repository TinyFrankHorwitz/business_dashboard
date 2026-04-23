import { NextResponse } from "next/server";
import { createJob } from "@/lib/dashboard-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const job = await createJob(body);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create job." },
      { status: 500 }
    );
  }
}
