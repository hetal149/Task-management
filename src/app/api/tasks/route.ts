import { tasks } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isVerified = verifyToken(token);
    if (!isVerified) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, projectId, status } = body;

    const newTask = {
      id: randomUUID(),
      name,
      projectId,
      description,
      status,
    };
    tasks.push(newTask);

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while creating new task" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isVerified = verifyToken(token);
    if (!isVerified) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      const filteredTasks = tasks.filter((t) => t.status !== "deleted");
      return NextResponse.json(
        { success: true, data: filteredTasks },
        { status: 200 },
      );
    }

    const filteredTasks = tasks.filter(
      (t) => t.projectId === projectId && t.status !== "deleted",
    );

    return NextResponse.json(
      { success: true, data: filteredTasks },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while fetching tasks" },
      { status: 500 },
    );
  }
}
