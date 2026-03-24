# 🚀 TaskFlow — Frontend

Application frontend de **TaskFlow**, un outil de gestion de projets et de tâches style Kanban. Développée avec **React 19**, **TypeScript**, **Vite** et stylisée avec **TailwindCSS v4** et **DaisyUI v5**.

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Lancement](#-lancement)
- [Structure du projet](#-structure-du-projet)
- [Pages et routes](#-pages-et-routes)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture technique](#-architecture-technique)
- [Scripts disponibles](#-scripts-disponibles)

---

## 🌟 Aperçu

TaskFlow permet aux utilisateurs de :

- **Créer un compte** et **se connecter** (authentification par cookies)
- **Gérer des projets** (créer, supprimer, visualiser)
- **Organiser des tâches** dans des colonnes de type Kanban
- **Gérer les colonnes** (ajouter, supprimer)
- **Suivre les tâches** avec des priorités (low, medium, high) et un statut de complétion

---

## 🛠 Technologies utilisées

| Technologie | Version | Rôle |
|---|---|---|
| **React** | 19.1 | Bibliothèque UI |
| **TypeScript** | 5.8 | Typage statique |
| **Vite** | 6.2 | Build tool & serveur de développement |
| **TailwindCSS** | 4.2 | Framework CSS utilitaire |
| **DaisyUI** | 5.5 | Composants UI pré-stylisés |
| **React Router** | 7.4 | Routage côté client |
| **React Icons** | 5.6 | Icônes SVG |

---

## 📦 Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- Le **serveur backend** TaskFlow doit être lancé (par défaut sur `http://localhost:3310`)

---

## ⚙ Installation

```bash
# Cloner le dépôt (si ce n'est pas déjà fait)
git clone <url-du-repo>

# Se placer dans le dossier client
cd client

# Installer les dépendances
npm install
```

---

## 🔐 Variables d'environnement

Créer un fichier `.env` à la racine du dossier `client` en s'inspirant du fichier `.env.sample` :

```env
# URL de l'API backend (accessible dans le code via import.meta.env.VITE_API_URL)
VITE_API_URL=http://localhost:3310
```

> **Note :** L'URL de l'API est aussi définie dans `src/constants/api.ts`. Assurez-vous que les deux valeurs sont cohérentes.

---

## ▶ Lancement

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:3000**.

> Le proxy Vite redirige automatiquement les requêtes `/api` vers `http://localhost:5000`.

---

## 📁 Structure du projet

```
client/
├── index.html                  # Point d'entrée HTML (thème DaisyUI : aqua)
├── package.json                # Dépendances et scripts
├── vite.config.ts              # Configuration Vite (proxy, TailwindCSS)
├── tsconfig.json               # Configuration TypeScript
├── .env.sample                 # Variables d'environnement exemple
│
├── public/                     # Fichiers statiques (logo, etc.)
│
└── src/
    ├── main.tsx                # Point d'entrée React (routes + providers)
    ├── App.tsx                 # Layout principal (Header + Outlet + Footer)
    ├── Index.css               # Import TailwindCSS + configuration DaisyUI
    │
    ├── components/             # Composants réutilisables
    │   ├── header/
    │   │   └── Header.tsx      # Barre de navigation (recherche, avatar, auth)
    │   ├── footer/
    │   │   └── Footer.tsx      # Pied de page
    │   ├── project/
    │   │   └── Project.tsx     # Liste et gestion des projets
    │   └── columnsDisplay/
    │       └── ColumnsDisplay.tsx  # Affichage Kanban (colonnes + tâches)
    │
    ├── pages/                  # Pages de l'application
    │   ├── auth/
    │   │   ├── Login.tsx       # Page de connexion
    │   │   └── Register.tsx    # Page d'inscription
    │   ├── home/
    │   │   └── Home.tsx        # Page d'accueil (redirige si non connecté)
    │   ├── profile/
    │   │   └── Profile.tsx     # Page de profil utilisateur
    │   ├── project/
    │   │   ├── Create.tsx      # Formulaire de création de projet
    │   │   └── ProjectUuid.tsx # Vue détaillée d'un projet
    │   └── static pages/
    │       ├── About.tsx       # Page À propos
    │       ├── Contact.tsx     # Page Contact
    │       ├── Privacy.tsx     # Politique de confidentialité
    │       └── Terms.tsx       # Conditions d'utilisation
    │
    ├── contexts/               # Contextes React
    │   ├── authContext.ts      # Définition du contexte + hook useAuth
    │   └── AuthContext.tsx     # Provider d'authentification
    │
    ├── constants/              # Constantes
    │   └── api.ts              # URL de base de l'API
    │
    ├── types/                  # Interfaces TypeScript
    │   ├── IProject.ts         # Interface Project
    │   ├── ITask.ts            # Interface Task
    │   ├── Icolumn.ts          # Interface Column
    │   ├── ProjectDTO.ts       # DTO pour les projets
    │   └── TaskDTO.ts          # DTO pour les tâches
    │
    ├── services/               # Services (réservé pour les appels API)
    └── assets/                 # Ressources statiques
```

---

## 🗺 Pages et routes

| Route | Page | Description | Auth requise |
|---|---|---|---|
| `/` | `Home` | Accueil — Affiche la liste des projets | ✅ Oui |
| `/login` | `Login` | Formulaire de connexion | ❌ Non |
| `/register` | `Register` | Formulaire d'inscription | ❌ Non |
| `/profile` | `Profile` | Profil de l'utilisateur connecté | ✅ Oui |
| `/projects/create` | `Create` | Créer un nouveau projet | ✅ Oui |
| `/projects/:uuid` | `ProjectUuid` | Vue détaillée d'un projet (Kanban) | ✅ Oui |
| `/about` | `About` | Page À propos | ❌ Non |
| `/terms` | `Terms` | Conditions d'utilisation | ❌ Non |
| `/privacy` | `Privacy` | Politique de confidentialité | ❌ Non |
| `/contact` | `Contact` | Page Contact | ❌ Non |

---

## ✨ Fonctionnalités

### 🔑 Authentification
- Inscription avec email, nom d'utilisateur et mot de passe
- Connexion avec email et mot de passe
- Déconnexion
- Authentification persistante via **cookies** (`credentials: "include"`)
- Vérification automatique de la session au chargement (`/users/profile`)

### 📂 Gestion des projets
- Créer un projet avec nom, description et statut (public/privé)
- Voir la liste de ses projets sur la page d'accueil
- Supprimer un projet
- Accéder à un projet via son UUID

### 📊 Kanban (Colonnes & Tâches)
- Afficher les colonnes d'un projet
- Ajouter une nouvelle colonne
- Supprimer une colonne
- Ajouter des tâches dans une colonne avec priorité (low, medium, high)
- Marquer une tâche comme complétée

### 👤 Profil utilisateur
- Visualiser les informations du profil

### 🎨 Interface utilisateur
- Header responsive avec barre de recherche et menu avatar (dropdown)
- Thème DaisyUI "aqua" par défaut
- Design responsive (grid adaptatif pour les projets)
- Avatars générés automatiquement via [ui-avatars.com](https://ui-avatars.com)

---

## 🏗 Architecture technique

### Gestion de l'état
L'application utilise le **Context API** de React pour gérer l'état d'authentification :

```
AuthProvider (Context)
└── user, loading, login(), register(), logout()
    └── Accessible partout via le hook useAuth()
```

### Communication avec l'API
Les appels API sont faits avec **`fetch`** natif. Toutes les requêtes authentifiées utilisent `credentials: "include"` pour transmettre les cookies de session.

```
Frontend (port 3000) → API Backend (port 3310)
                      → Proxy Vite /api → port 5000
```

### Typage TypeScript

Les types sont organisés en **interfaces** et **DTOs** :
- **Interfaces** (`IProject`, `ITask`, `IColumn`) : représentent les données complètes venant de la BDD
- **DTOs** (`ProjectDTO`, `TaskDTO`) : représentent les données envoyées lors de la création/modification

---

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement Vite (port 3000) |
| `npm run build` | Compile TypeScript puis crée le build de production |
| `npm run preview` | Prévisualise le build de production |
| `npm run check-types` | Vérifie les types TypeScript sans compiler |

---

## 📝 Notes supplémentaires

- Le thème DaisyUI est configuré dans `index.html` via l'attribut `data-theme="aqua"`.
- Tous les thèmes DaisyUI sont activés dans `Index.css` (`themes: all`).
- Le projet fait partie d'un monorepo (`@js-monorepo/client`).
- Le dossier `services/` est prévu pour y placer les appels API centralisés (actuellement vide).
