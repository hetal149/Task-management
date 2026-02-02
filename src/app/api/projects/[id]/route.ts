import { projects } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { randomUUID } from "crypto";
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

    const existingProject = projects.find((p) => p.id == id);

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: `Project with id ${id} is not found` },
        { status: 404 },
      );
    }

    existingProject.name = name;
    existingProject.description = description;
    existingProject.status = status;

    return NextResponse.json(
      { success: true, data: existingProject },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while updating project" },
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
    console.log(id);
    const filteredProject = projects.find((p) => p.id === id);
    if (!filteredProject) {
      return NextResponse.json(
        { success: false, message: `Project with id ${id} is not found` },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: filteredProject },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while fetching project" },
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
    const existingProject = projects.find((p) => p.id === id);

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: `Project with id ${id} is not found` },
        { status: 404 },
      );
    }

    existingProject.status = "deleted";

    return NextResponse.json(
      { success: true, data: existingProject },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while deleting project" },
      { status: 500 },
    );
  }
}
