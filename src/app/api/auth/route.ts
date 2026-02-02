import { User, users } from "@/lib/db";
import { signInToken } from "@/lib/jwt";
import brcypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try {
    const body =await req.json()

    const existingUser = users.find((u)=>u.email===body.email) as User
    console.log(existingUser)
    if(!existingUser){
        return NextResponse.json({success:false,message:"Invalid Credentials"},{status:404})
    }
    const isPasswordMatched = await brcypt.compare(body.password,existingUser?.password)

    if(!isPasswordMatched){
        return NextResponse.json({success:false,message:"Invalid password"},{status:400})
    }

    const token = signInToken({
        email: existingUser.email,

      });
      
    const res =  NextResponse.json({success:true,data:{name:existingUser.name,email:existingUser.email,id:existingUser.id},token},{status:201})

    return res
} catch (error) {
    console.error(error)
    return NextResponse.json({success:false,message:"Error while creating new user"},{status:500})
}
}