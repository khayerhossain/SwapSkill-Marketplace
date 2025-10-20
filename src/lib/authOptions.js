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
    // Ensure user exists for OAuth logins and capture role from DB
    async signIn({ user, account }) {
      try {
        const usersCollection = await dbConnect(
          collectionNamesObj.usersCollection
        );
        if (!user?.email) return false;
        const existing = await usersCollection.findOne({ email: user.email });
        if (!existing) {
          await usersCollection.insertOne({
            name: user.name || "",
            email: user.email,
            role: "user",
            createdAt: new Date(),
            provider: account?.provider || "credentials",
          });
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    async jwt({ token, user }) {
      // On initial sign-in, seed token fields
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user.role || "user").toString().trim().toLowerCase();
      }

      // Always refresh role from DB to ensure correctness for middleware
      if (token.email) {
        const usersCollection = await dbConnect(
          collectionNamesObj.usersCollection
        );
        const dbUser = await usersCollection.findOne({ email: token.email });
        const dbRole = dbUser?.role
          ? dbUser.role.toString().trim().toLowerCase()
          : undefined;
        token.role = dbRole || token.role || "user";
        if (!token.id && dbUser?._id) {
          token.id = dbUser._id.toString();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {

        let profileImage = null;
    if (token.email) {
      try {
        const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
        const dbUser = await usersCollection.findOne({ email: token.email });
        if (dbUser?.profileImage) {
          profileImage = dbUser.profileImage; // 
        }
      } catch (err) {
        console.error("Error fetching profileImage for session:", err);
      }
    }
        
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          image: profileImage || session.user.image,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Normalize redirects. For baseUrl or auth pages, send to root and let middleware route by role
      try {
        if (url.startsWith("/")) {
          if (url === "/" || url === "/login" || url === "/auth/signin") {
            return `${baseUrl}/`;
          }
          return `${baseUrl}${url}`;
        }
        const to = new URL(url);
        if (to.origin === baseUrl) return url;
        return baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};
