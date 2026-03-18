import { Link } from "react-router";

export default function Header() {
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
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            type="button"
          >
            <div className="w-10 rounded-full">
              <img
                alt="avatar"
                src="https://ui-avatars.com/api/?name=john&background=random"
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
              <Link to="/logout">Déconnexion</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
