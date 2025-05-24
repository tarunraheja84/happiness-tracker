import GoogleProvider from 'next-auth/providers/google'
import NextAuth from "next-auth"

const handler = async (req: any, res: any) => {
  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        async profile(profile: any) {
          let userData: any = {
            email: profile.email || null,
          };

          try {
            userData.name = profile.name;
          } catch (error) {
            console.error(error);
          }
          return { id: profile.sub, ...profile, ...userData }
        }
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
      async jwt({ token, trigger,user, session }) {
        if (trigger === "update"){
          return {...token, ...session.user}
        }
        return { ...token, ...user }
      },
      async session({ session, token, user }) {
        session.user = token;
        return session;
      }
    }
  })
}

export { handler as GET, handler as POST }