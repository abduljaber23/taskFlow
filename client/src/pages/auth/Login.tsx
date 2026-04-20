import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/authContext";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

interface LoginFormData {
  email: string;
  password: string;
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Chargement du script reCAPTCHA v3
  useEffect(() => {
    const scriptId = "recaptcha-v3-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const getRecaptchaToken = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(SITE_KEY, {
            action: "login",
          });
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const recaptchaToken = await getRecaptchaToken();
      await login(formData.email, formData.password, recaptchaToken);
      navigate("/");
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
        <legend className="fieldset-legend">Connexion</legend>

        {error && (
          <div className="alert alert-error text-sm mb-2">
            <span>{error}</span>
          </div>
        )}

        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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
          name="password"
          value={formData.password}
          onChange={handleChange}
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
            "Se connecter"
          )}
        </button>

        <div className="text-center mt-4">
          <p>Pas de compte ?</p>
          <Link to="/register" className="link link-hover">
            S'inscrire
          </Link>
        </div>
      </fieldset>
    </form>
  );
}
