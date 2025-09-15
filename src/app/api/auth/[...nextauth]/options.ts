import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";
import { comparePassword } from "@/helpers/bcrypt";
import { redisClient } from "@/lib/redis";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<null | {
        id:string,
        _id: string | undefined;
        email: string;
        name: string;
        username: string;
        isVerified: boolean;
        isAcceptingMessage: boolean;
        sessionToken: string;
      }> {
        if (!credentials) return null;

        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) throw new Error("User not found!");
        if (!user.isVerified) throw new Error("Verify your account before login!");

        const isMatch = await comparePassword(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials!");

        const existingSession = await redisClient.get(`session:${user._id}`);
        if (existingSession) {
          throw new Error("You are already logged in on another device.");
        }

        const sessionToken = crypto.randomUUID();
        await redisClient.setex(
          `session:${user._id}`,
          60 * 60 * 24 * 7, // 7 days
          sessionToken
        );

        return {
          id:user.id,
          _id: user._id?.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
          sessionToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.sessionToken = user.sessionToken;
        token.name = user.name;
      }

      if (token._id && token.sessionToken) {
        const activeSession = await redisClient.get(`session:${token._id}`);
        if (!activeSession) throw new Error("Session expired. Please login again.");
        if (activeSession !== token.sessionToken) {
          throw new Error("You have been logged out due to login from another device.");
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id!;
        session.user.username = token.username!;
        session.user.isVerified = token.isVerified!;
        session.user.isAcceptingMessage = token.isAcceptingMessage!;
        session.user.sessionToken = token.sessionToken!;
        session.user.name = token.name!;
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
  events: {
    async signOut({ token }) {
      if (token?._id) {
        await redisClient.del(`session:${token._id}`);
      }
    },
  },
  secret: process.env.NEXT_AUTH_SCRETE as string,
};
