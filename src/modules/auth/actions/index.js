"use server";

import db from "../../../lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;

    const newUser = await db.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        clerkId: id,
        name:
          firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName || lastName || null,
        image: imageUrl || null,
        email: emailAddresses[0]?.emailAddress || "",
      },
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error onboarding user:", error);
    return { success: false };
  }
};
