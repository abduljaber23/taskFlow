import type { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";

interface RecaptchaV3Response {
  success: boolean;
  score?: number; // Score entre 0.0 (bot) et 1.0 (humain) — v3 uniquement
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

// Seuil minimum du score reCAPTCHA v3 (0.5 recommandé par Google)
const SCORE_THRESHOLD = 0.5;

/**
 * Middleware Express — vérifie le token reCAPTCHA v3 envoyé par le client.
 * Le client doit inclure { recaptchaToken: "<token>" } dans le body JSON.
 * Bloque les requêtes avec un score inférieur au seuil (bots détectés).
 * En mode développement (NODE_ENV=development), la vérification est ignorée.
 */
export const verifyCaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Bypass en développement pour faciliter les tests (Swagger, Postman…)
  // if (process.env.NODE_ENV === "development") {
  //   next();
  //   return;
  // }

  const { recaptchaToken } = req.body as { recaptchaToken?: string };

  if (!recaptchaToken) {
    res.status(400).json({ message: "Token reCAPTCHA manquant" });
    return;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error(
      "RECAPTCHA_SECRET_KEY non définie dans les variables d'environnement",
    );
    res.status(500).json({ message: "Erreur de configuration serveur" });
    return;
  }

  try {
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const params = new URLSearchParams({
      secret: secretKey,
      response: recaptchaToken,
      remoteip: req.ip ?? "",
    });

    const response = await fetch(`${verifyUrl}?${params.toString()}`, {
      method: "POST",
    });

    const data = (await response.json()) as RecaptchaV3Response;

    if (!data.success) {
      res.status(400).json({
        message: "Vérification reCAPTCHA échouée",
        errors: data["error-codes"],
      });
      return;
    }

    // Vérification du score (v3 uniquement)
    if (data.score !== undefined && data.score < SCORE_THRESHOLD) {
      res.status(403).json({
        message: "Activité suspecte détectée, accès refusé",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("Erreur lors de la vérification reCAPTCHA :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la vérification reCAPTCHA" });
  }
};
