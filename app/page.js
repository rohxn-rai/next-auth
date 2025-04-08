import AuthForm from "@/components/auth-form";

const Home = async ({ searchParams }) => {
  const formMode = searchParams.mode || "login";
  return <AuthForm mode={formMode} />;
};

export default Home;
