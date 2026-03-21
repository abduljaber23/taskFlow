import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/authContext";

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-10">
        <p className="text-error">
          Vous devez être connecté pour voir cette page.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn btn-link"
        >
          Se connecter
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-box shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Mon Profil</h1>

      <div className="flex flex-col items-center gap-4">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
              alt="Avatar"
            />
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex justify-between border-b border-base-300 pb-2">
            <span className="font-semibold text-gray-500">ID :</span>
            <span>{user.uuid}</span>
          </div>
          <div className="flex justify-between border-b border-base-300 pb-2">
            <span className="font-semibold text-gray-500">
              Nom d'utilisateur :
            </span>
            <span>{user.username}</span>
          </div>

          <div className="flex justify-between border-b border-base-300 pb-2">
            <span className="font-semibold text-gray-500">Email :</span>
            <span>{user.email}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-outline btn-sm"
          >
            Retour
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-error btn-sm"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
