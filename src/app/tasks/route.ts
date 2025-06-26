import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // ✅ FIXED
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { content } = await req.json();

    const task = await db.insert(tasks).values({ 
      userId, 
      content 
    }).returning();

    return NextResponse.json(task[0]);
  } catch (error) {
    console.error("[TASK_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth(); // ✅ FIXED
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("[TASK_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}