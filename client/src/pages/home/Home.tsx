import { Navigate } from "react-router";
import { useAuth } from "../../contexts/authContext";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-10">
        Bienvenue sur TaskFlow, {user.username} !
      </h1>
    </>
  );
}
