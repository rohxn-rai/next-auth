"use server";

import { redirect } from "next/navigation";

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";

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

export const login = async (prevState, FormData) => {
  const email = FormData.get("email");
  const password = FormData.get("password");

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: "Could not find a user with this email address.",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        email: "Could not authenticate user, please check your credentials.",
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect("/training");
};

export const auth = async (mode, prevState, FormData) => {
  if (mode === "login") {
    return login(prevState, FormData);
  }
  return signup(prevState, FormData);
};

export const logout = async () => {
  await destroySession();
  redirect("/");
};
