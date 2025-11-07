
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRows = await db
      .select({ credites: user.credites })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    const userData = userRows[0];

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ credits: userData.credites });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}