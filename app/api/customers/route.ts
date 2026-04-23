import { NextResponse } from "next/server";
import { createCustomer } from "@/lib/dashboard-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await createCustomer(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create customer." },
      { status: 500 }
    );
  }
}
