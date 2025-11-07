import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, type } = await request.json(); // type: 'win' or 'loss'

    if (typeof amount !== "number" || !["win", "loss"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Get current credits
    const userData = await db
      .select({ credites: user.credites })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userData || userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentCredits = userData[0].credites ?? 0;

    // Calculate new credits
    const newCredits =
      type === "win"
        ? currentCredits + amount
        : Math.max(0, currentCredits - amount);

    // Update credits
    await db
      .update(user)
      .set({
        credites: newCredits,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({
      credits: newCredits,
      message: type === "win" ? "Credits added" : "Credits deducted",
    });
  } catch (error) {
    console.error("Error updating credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
