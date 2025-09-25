import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect, { collectionNamesObj } from "./db.connect";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        // Get users collection
        const usersCollection = await dbConnect(
          collectionNamesObj.usersCollection
        );
        const user = await usersCollection.findOne({ email });

        if (!user) return null;
        if (password !== user.password) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
