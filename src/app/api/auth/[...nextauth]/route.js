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
        const { lowercaseEmail, password } = credentials;

        try {
          await connectMongoDB();

          // Check NormalUser collection
          const normalUser = await NormalUser.findOne({ email: lowercaseEmail });
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
                roleaii: normalUser.roleai ? normalUser.roleai.toString() : "",
                interests: Array.isArray(normalUser.interests) ? normalUser.interests.join(',') : normalUser.interests || "",
              };
            }
          }

          // Check StudentUser collection
          const studentUser = await StudentUser.findOne({ email: lowercaseEmail });
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
                roleaii: studentUser.roleai ? studentUser.roleai.toString() : "",
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
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
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
    async jwt({ token, user, account, profile }) {
      console.log("JWT callback:", { token, account, profile });
      if (user) {
        token.id = user.id;
        token.role = user.role || (user.email.endsWith("@g.sut.ac.th") ? "StudentUser" : "NormalUser");
        token.roleaii = user.roleaii || "";
        token.interests = user.interests || "";
      }
      if (account && (account.provider === "google" || account.provider === "facebook" || account.provider === "github")) {
        const email = profile.email.toLowerCase();
        await connectMongoDB();
        let dbUser;
  
        // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่
        if (email.endsWith("@g.sut.ac.th")) {
          dbUser = await StudentUser.findOne({ email });
        } else {
          dbUser = await NormalUser.findOne({ email });
        }
  
        // ถ้าไม่มีผู้ใช้ที่มีอีเมลนี้ ให้สร้างใหม่
        if (!dbUser) {
          let imageUrl;
          if (account.provider === "facebook") {
            imageUrl = profile.picture.data.url;
          } else if (account.provider === "github") {
            imageUrl = profile.avatar_url;
          } else {
            imageUrl = profile.picture;
          }
  
          if (email.endsWith("@g.sut.ac.th")) {
            dbUser = await StudentUser.create({
              email,
              name: profile.name,
              imageUrl: imageUrl,
            });
          } else {
            dbUser = await NormalUser.create({
              email,
              name: profile.name,
              imageUrl: imageUrl,
            });
          }
        }
  
        // ใช้ข้อมูลจาก dbUser แทนที่จะใช้ข้อมูลจาก profile
        token.id = dbUser._id.toString();
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.imageUrl;
        token.role = email.endsWith("@g.sut.ac.th") ? "StudentUser" : "NormalUser";
        token.roleaii = dbUser.roleai ? dbUser.roleai.toString() : "";
        token.interests = Array.isArray(dbUser.interests) ? dbUser.interests.join(',') : dbUser.interests || "";
      }
      return token;
    },
  
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.roleaii = token.roleaii || "";
        session.user.interests = token.interests || "";
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  
    async signIn({ account, profile }) {
      if (account.provider === "google" || account.provider === "facebook" || account.provider === "github") {
        console.log("Sign in attempt:", { account, profile });
        const email = profile.email.toLowerCase();
        try {
          await connectMongoDB();
  
          // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่
          let existingUser;
          if (email.endsWith("@g.sut.ac.th")) {
            existingUser = await StudentUser.findOne({ email });
          } else {
            existingUser = await NormalUser.findOne({ email });
          }
  
          // ถ้าไม่มีผู้ใช้ที่มีอีเมลนี้ ให้สร้างใหม่
          if (!existingUser) {
            let imageUrl;
            if (account.provider === "facebook") {
              imageUrl = profile.picture.data.url;
            } else if (account.provider === "github") {
              imageUrl = profile.avatar_url;
            } else {
              imageUrl = profile.picture;
            }
  
            if (email.endsWith("@g.sut.ac.th")) {
              await StudentUser.create({
                email,
                name: profile.name,
                imageUrl: imageUrl,
              });
            } else {
              await NormalUser.create({
                email,
                name: profile.name,
                imageUrl: imageUrl,
              });
            }
          }
          // ถ้ามีผู้ใช้อยู่แล้ว ไม่ต้องทำอะไร
          
          return true;
        } catch (error) {
          console.error("Error checking/creating user in database:", error);
          return false;
        }
      }
      return true; // For other providers
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: '/auth/error',
    newUser: "/Ai/role"
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST,  authOption};
