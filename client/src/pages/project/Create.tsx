import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ProjectDTO } from "../../types/ProjectDTO";
const API_URL = "http://localhost:3310/api";
export default function Create() {
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "public",
  });
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création du projet");
      }
      setProject(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      navigate("/");
    }
  }, [project, navigate]);

  return (
    <>
      <form onSubmit={handleSubmit} className="flex justify-center bg-base-100">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Créer un projet</legend>

          {error && (
            <div className="alert alert-error text-sm mb-2">
              <span>{error}</span>
            </div>
          )}

          <label className="label" htmlFor="name">
            Nom du projet
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="input"
            placeholder="Nom du projet"
            required
          />

          <label className="label" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="text"
            className="input"
            placeholder="Description du projet"
            required
          />
          <label className="label" htmlFor="status">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select select-bordered"
            required
          >
            <option value="public">Public</option>
            <option value="private">Privé</option>
          </select>

          <button
            type="submit"
            className="btn btn-neutral mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Créer le projet"
            )}
          </button>
        </fieldset>
      </form>
    </>
  );
}
