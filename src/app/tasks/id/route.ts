import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth(); // ✅ FIXED
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { completed } = await req.json();

    const updatedTask = await db
      .update(tasks)
      .set({ completed })
      .where(eq(tasks.id, params.id))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error("[TASK_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth(); // ✅ FIXED
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await db
      .delete(tasks)
      .where(eq(tasks.id, params.id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TASK_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}