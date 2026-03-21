import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/authContext";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(formData.email, formData.username, formData.password);
      navigate("/login");
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center bg-base-100">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Inscription</legend>

        {error && (
          <div className="alert alert-error text-sm mb-2">
            <span>{error}</span>
          </div>
        )}

        <label className="label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          onChange={handleChange}
          value={formData.username}
          name="username"
          type="text"
          className="input"
          placeholder="Username"
          required
        />

        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          onChange={handleChange}
          value={formData.email}
          name="email"
          type="email"
          className="input"
          placeholder="Email"
          required
        />

        <label className="label" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          onChange={handleChange}
          value={formData.password}
          name="password"
          type="password"
          className="input"
          placeholder="Mot de passe"
          required
        />

        <button
          type="submit"
          className="btn btn-neutral mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "S'inscrire"
          )}
        </button>

        <div className="text-center mt-4">
          <p>Vous avez déjà un compte ?</p>
          <Link to="/login" className="link link-hover">
            Se connecter
          </Link>
        </div>
      </fieldset>
    </form>
  );
}
