import { NextResponse } from "next/server";
import { getMessages } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ messages: await getMessages() }); }
