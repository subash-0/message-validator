import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "@/helpers/bcrypt";
import { headers } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials?.identifier },
            { username: credentials?.identifier },
          ],
        });

        if (!user) throw new Error("User not found!");
        if (!user.isVerified) throw new Error("Verify your account before login!");

        const isMatch = await comparePassword(
          credentials?.password ?? "",
          user.password
        );

        if (!isMatch) throw new Error("Invalid credentials!");

        return {
          id: (user._id as string),
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const headersList = await headers(); // ✅ don't use await
      const ip =
        headersList.get("x-forwarded-for") ||
        headersList.get("x-real-ip") || // fallback if deployed behind proxy
        "unknown";

      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
        token.ip = ip;
      } 
        // On subsequent requests → compare IP
        if (token.ip && token.ip !== ip) {
         
          throw new Error("You are logged in from other device");
        
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
        session.user.ip = token.ip;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/sign-in",
    verifyRequest: "/verify-email",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SCRETE as string,
};
