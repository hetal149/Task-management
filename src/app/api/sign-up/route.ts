import { users } from "@/lib/db";
import brcypt from "bcryptjs"
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try {
    const body =await req.json()

    const hashedPassword = await brcypt.hash(body.password,10)
    const newUser = {
        id:randomUUID(),
        name:body.name ,
        email : body.email,
        password:hashedPassword
    }
    users.push(newUser)

    return NextResponse.json({success:true,data:newUser,status:201})
} catch (error) {
    console.log(error)
    return NextResponse.json({success:false,message:"Error while creating new user",status:500})
}
}