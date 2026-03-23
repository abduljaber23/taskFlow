import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { useAuth } from "../../contexts/authContext";
import type { IProject } from "../../types/IProject";

const API_URL = "http://localhost:3310/api";

export default function Project() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/projects/user/${user?.uuid}`, {
          credentials: "include",
        });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjects();
  }, [user]);

  const deleteProject = async (uuid: string) => {
    try {
      await fetch(`${API_URL}/projects/${uuid}`, {
        method: "DELETE",
        credentials: "include",
      });

      setProjects((prev) =>
        prev.filter((project: IProject) => project.uuid !== uuid),
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center md:justify-between items-center mb-8">
          <Link
            to="/projects/create"
            className="btn btn-success text-white btn-sm md:btn-md"
          >
            + Créer un projet
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-base-content/60 text-center py-10">
            Aucun projet trouvé
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project: IProject) => (
              <div
                key={project.uuid}
                className="card bg-mist-950 border border-base-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="card-body flex flex-col justify-between p-5">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`badge ${
                          project.status === "public"
                            ? "badge-success text-white"
                            : "badge-error text-white"
                        }`}
                      >
                        {project.status === "public" ? "Public" : "Privé"}
                      </span>

                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                        onClick={() => deleteProject(project.uuid)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <h2 className="card-title text-lg text-indigo-50">
                      {project.name}
                    </h2>
                    <p className="text-sm text-indigo-100 mt-1 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-xs text-indigo-100">
                      {new Date(project.createdAt).toLocaleDateString()} —{" "}
                      {new Date(project.createdAt).getHours()}h
                      {new Date(project.createdAt).getMinutes()}
                    </p>

                    <Link
                      to={`/projects/${project.uuid}`}
                      className="btn btn-soft btn-sm text-sm"
                    >
                      Voir le projet
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
