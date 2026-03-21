import { Navigate } from "react-router";
import Project from "../../components/project/Project";
import { useAuth } from "../../contexts/authContext";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Project />
    </>
  );
}
