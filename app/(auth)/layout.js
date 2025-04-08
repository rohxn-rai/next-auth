import "../globals.css";

import { logout } from "@/actions/auth-acions";

export const metadata = {
  title: "Next Auth",
  description: "Next.js Authentication",
};

const AuthLayout = ({ children }) => {
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
