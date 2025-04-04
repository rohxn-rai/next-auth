"use server";

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
};
