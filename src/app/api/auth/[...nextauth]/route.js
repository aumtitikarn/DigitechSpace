import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { connectMongoDB } from "../../../../../lib/mongodb";
import StudentUser from "../../../../../models/StudentUser";
import NormalUser from "../../../../../models/NormalUser";
import bcrypt from "bcryptjs";

const authOption = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();

          // Check NormalUser collection
          const normalUser = await NormalUser.findOne({ email });
          if (normalUser) {
            const passwordMatch = await bcrypt.compare(
              password,
              normalUser.password
            );
            if (passwordMatch) {
              return {
                ...normalUser.toObject(),
                role: "NormalUser",
                id: normalUser._id.toString(),
                roleaii: normalUser.roleai? normalUser.roleai.toString() : "",
                interests: Array.isArray(normalUser.interests) ? normalUser.interests.join(',') : normalUser.interests || "",
              };
            }
          }

          // Check StudentUser collection
          const studentUser = await StudentUser.findOne({ email });
          if (studentUser) {
            const passwordMatch = await bcrypt.compare(
              password,
              studentUser.password
            );
            if (passwordMatch) {
              return {
                ...studentUser.toObject(),
                role: "StudentUser",
                id: studentUser._id.toString(),
                roleaii: studentUser.roleai? studentUser.roleai.toString() : "",
                interests: Array.isArray(studentUser.interests) ? studentUser.interests.join(',') : studentUser.interests || "",
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id; 
        token.roleaii = user.roleaii || ""; 
        token.interests = user.interests || ""; // Use default value if undefined
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id; 
        session.user.roleaii = token.roleaii || "";
        session.user.interests = token.interests || "";
      }
      return session;
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
