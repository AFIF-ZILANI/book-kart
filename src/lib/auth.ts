import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import dbConnect from "./db";
import UserModel from "@/models/User.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ profile, account }) {
            await dbConnect();
            const userExists = await UserModel.findOne({ email: profile?.email });
            console.log("User Exists:", userExists);
            console.log("Account Info:", account);
            if (!userExists) {
                // If user does not exist, create a new user
                const newUser = await UserModel.create({
                    name: profile?.name || "", // Use profile name or fallback to email prefix
                    email: profile?.email || "", // Use profile email or empty string
                    image: profile?.picture || "", // Use profile picture or empty string
                    oauth_provider: account?.provider || "google", // Fixed provider type
                    oauth_id: account?.providerAccountId || "", // Use providerAccountId from account
                });
                console.log("New user created:", newUser);
                if (!newUser) {
                    console.error("Failed to create new user");
                    return false; // Prevent sign-in if user creation fails
                }
                return true; // Allow sign-in
            }
            return true; // Allow sign-in
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
});
