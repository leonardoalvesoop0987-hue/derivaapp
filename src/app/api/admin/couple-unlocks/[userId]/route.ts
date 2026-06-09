import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const adminSession = await getSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { id: adminSession.userId }
    });

    if (!admin?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId } = await params;
    const body = await req.json();
    const { groupKey, enable } = body;

    // Validate request
    if (!groupKey || typeof enable !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid parameters: groupKey, enable" },
        { status: 400 }
      );
    }

    // Verify unlock group exists
    const group = await prisma.unlockGroup.findUnique({
      where: { key: groupKey }
    });

    if (!group) {
      return NextResponse.json(
        { error: "Unlock group not found" },
        { status: 404 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create or update couple unlock
    const coupleUnlock = await prisma.coupleUnlock.upsert({
      where: {
        user_id_unlock_group_key: {
          user_id: userId,
          unlock_group_key: groupKey
        }
      },
      create: {
        user_id: userId,
        unlock_group_key: groupKey,
        is_enabled: enable,
        enabled_at: enable ? new Date() : null
      },
      update: {
        is_enabled: enable,
        enabled_at: enable ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      groupKey,
      enabled: coupleUnlock.is_enabled,
      message: `${groupKey} is now ${enable ? "enabled" : "disabled"} for user`
    });
  } catch (error) {
    console.error("[Admin Couple Unlock Error]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
