import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.SECRET_KEY as string

export function signInToken(payload:any){
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" });

}

export function verifyToken(token: string) {
    console.log(token,JWT_SECRET_KEY)
  try {
    const cleanToken = token.replace(/"/g, "").trim();
    return jwt.verify(cleanToken, JWT_SECRET_KEY);
  } catch(error) {
    console.log(error)
    return null;
  }
}
