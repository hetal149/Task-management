import { projects } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isVerified = verifyToken(token);
    console.log(isVerified)
    if (!isVerified) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { name, description, userId, status } = body;

    const newProject = {
      id: randomUUID(),
      name,
      userId,
      description,
      status,
    };
    projects.push(newProject);

    return NextResponse.json(
      { success: true, data: newProject },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while creating new project" },
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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "missing user id " },
        { status: 400 },
      );
    }

    const filteredProjects = projects.filter(
      (p) => p.userId === userId && p.status !== "deleted",
    );

    return NextResponse.json(
      { success: true, data: filteredProjects },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while fetching projects" },
      { status: 500 },
    );
  }
}
