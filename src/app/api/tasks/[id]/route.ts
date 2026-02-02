import { tasks } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const { id } = await params;
    const { name, description, status } = body;

    const existingTask = tasks.find((t) => t.id === id);

    if (!existingTask) {
      return NextResponse.json(
        { success: false, message: `Task with id ${id} is not found` },
        { status: 404 },
      );
    }

    existingTask.name = name;
    existingTask.description = description;
    existingTask.status = status;

    return NextResponse.json(
      { success: true, data: existingTask },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while updating task" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isVerified = verifyToken(token);
    if (!isVerified) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const filteredTask = tasks.find((t) => t.id === id);
    if (!filteredTask) {
      return NextResponse.json(
        { success: false, message: `Task with id ${id} is not found` },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: filteredTask },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while fetching tasks" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isVerified = verifyToken(token);
    if (!isVerified) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingTask = tasks.find((t) => t.id === id);

    if (!existingTask) {
      return NextResponse.json(
        { success: false, message: `Task with id ${id} is not found` },
        { status: 404 },
      );
    }

    existingTask.status = "deleted";

    return NextResponse.json(
      { success: true, data: existingTask },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while deleting task" },
      { status: 500 },
    );
  }
}
