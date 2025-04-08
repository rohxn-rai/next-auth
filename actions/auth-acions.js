"use server";

import { redirect } from "next/navigation";

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";

export const signup = async (prevState, actionData) => {
  const email = actionData.get("email");
  const password = actionData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Invalid Email Address";
  }

  if (password.trim().length < 8) {
    errors.password = "Invalid Password";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedPassword = hashUserPassword(password);

  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "Email already exists",
        },
      };
    }
    throw error;
  }
};
