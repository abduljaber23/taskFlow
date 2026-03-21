import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/authContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          TaskFlow
        </Link>
      </div>

      <div className="flex-1 justify-center hidden md:flex">
        <input
          type="text"
          placeholder="Rechercher"
          className="input input-bordered w-full max-w-xs rounded-xl outline-none"
        />
      </div>

      <div className="flex-1 justify-end flex gap-2 items-center">
        <input
          type="text"
          placeholder="Rechercher"
          className="input input-bordered w-37 md:hidden rounded-xl outline-none"
        />
        {user ? (
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              type="button"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="avatar"
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                />
              </div>
            </button>

            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profil
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-500 text-left"
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">
              Connexion
            </Link>
            <Link to="/register" className="btn btn-primary">
              Inscription
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
