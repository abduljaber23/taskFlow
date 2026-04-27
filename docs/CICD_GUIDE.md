# 🚀 Guide CI/CD avec GitHub Actions — Projet taskFlow

> **À qui s'adresse ce guide ?**
> Tu n'as jamais fait de CI/CD, tu ne sais pas trop ce que c'est, et tu veux comprendre simplement. Ce guide est fait pour toi.

---

## 📖 Table des matières

1. [C'est quoi le CI/CD ?](#1-cest-quoi-le-cicd-)
2. [Comment ça marche avec GitHub Actions ?](#2-comment-ça-marche-avec-github-actions-)
3. [Les fichiers importants](#3-les-fichiers-importants)
4. [Ton premier workflow expliqué ligne par ligne](#4-ton-premier-workflow-expliqué-ligne-par-ligne)
5. [Créer un workflow pour taskFlow](#5-créer-un-workflow-pour-taskflow)
6. [Les secrets GitHub — cacher les infos sensibles](#6-les-secrets-github--cacher-les-infos-sensibles)
7. [Voir les résultats sur GitHub](#7-voir-les-résultats-sur-github)
8. [Erreurs fréquentes et solutions](#8-erreurs-fréquentes-et-solutions)
9. [Récapitulatif visuel](#9-récapitulatif-visuel)

---

## 1. C'est quoi le CI/CD ?

**CI/CD**, ce sont deux choses différentes :

| Sigle | Nom complet | Ce que ça fait |
|-------|-------------|----------------|
| **CI** | Intégration Continue | Vérifie automatiquement que ton code ne casse rien à chaque `git push` |
| **CD** | Déploiement Continu | Envoie automatiquement ton code en production si tout est OK |

### 🧠 Exemple concret (sans code)

Imagine que tu travailles en équipe sur `taskFlow`. Sans CI/CD :
- Tu pousses ton code → tu espères que ça marche 🤞
- Ton collègue récupère ton code → ça plante chez lui
- 1h perdue à chercher pourquoi

Avec CI/CD :
- Tu pousses ton code → GitHub vérifie tout automatiquement en 2 minutes
- Si quelque chose est cassé → tu reçois une notification rouge ❌
- Si tout va bien → tu reçois un ✅ vert et tout le monde est content

---

## 2. Comment ça marche avec GitHub Actions ?

GitHub Actions, c'est le système intégré dans GitHub qui permet d'exécuter des tâches automatiquement.

### Le principe en 3 mots : **Événement → Workflow → Actions**

```
Tu fais un git push
        ↓
GitHub détecte l'événement
        ↓
GitHub lance ton Workflow (fichier .yml)
        ↓
Le Workflow exécute des Jobs
        ↓
Chaque Job exécute des Steps (étapes)
        ↓
✅ Succès ou ❌ Échec
```

### Les concepts clés

| Concept | Explication simple |
|---------|-------------------|
| **Workflow** | Un fichier `.yml` qui décrit tout ce qu'on veut faire |
| **Job** | Un groupe de tâches (ex: "tester le serveur") |
| **Step** | Une action précise dans un job (ex: "installer les dépendances") |
| **Runner** | Un ordinateur virtuel fourni par GitHub qui exécute ton workflow |
| **Trigger** | L'événement qui déclenche le workflow (ex: `push`, `pull_request`) |

---

## 3. Les fichiers importants

Dans ton projet `taskFlow`, les workflows se trouvent ici :

```
taskFlow/
├── .github/
│   └── workflows/          ← 📁 TOUS tes workflows sont ici
│       └── check.yml       ← 📄 Ton fichier de workflow
├── client/                 ← React + Vite + TypeScript
├── server/                 ← Express + TypeScript + MySQL
├── package.json            ← Scripts racine (build, test, check...)
└── biome.json              ← Configuration du linter Biome
```

> **⚠️ Règle importante :** Tous les fichiers de workflow **doivent** être dans `.github/workflows/` et avoir l'extension `.yml` ou `.yaml`.

---

## 4. Ton premier workflow expliqué ligne par ligne

Voici un exemple simple pour comprendre la syntaxe :

```yaml
# Le nom qui apparaît sur GitHub
name: Mon Premier Workflow

# Quand est-ce que ce workflow se déclenche ?
on:
  push:                    # À chaque git push
    branches:
      - main               # Seulement sur la branche main
  pull_request:            # Ou à chaque Pull Request
    branches:
      - main

# Les tâches à exécuter
jobs:

  # Un job appelé "verification"
  verification:
    # Sur quel type de machine virtuelle ?
    runs-on: ubuntu-latest  # Ubuntu (Linux) gratuit sur GitHub

    # Les étapes du job (dans l'ordre)
    steps:
      # Étape 1 : Récupérer le code du dépôt
      - name: Récupérer le code
        uses: actions/checkout@v4     # Action officielle GitHub

      # Étape 2 : Installer Node.js
      - name: Installer Node.js
        uses: actions/setup-node@v4   # Action officielle GitHub
        with:
          node-version: '20'          # La version 20, comme dans ton Dockerfile

      # Étape 3 : Installer les dépendances
      - name: Installer les dépendances
        run: npm install              # Commande shell classique

      # Étape 4 : Vérifier le code
      - name: Vérifier le code
        run: npm run check
```

### Décryptage des mots-clés

| Mot-clé | Rôle |
|---------|------|
| `name:` | Donne un nom lisible (apparaît sur GitHub) |
| `on:` | Définit les événements déclencheurs |
| `jobs:` | Contient tous les jobs |
| `runs-on:` | Choisit le système d'exploitation de la machine virtuelle |
| `steps:` | Liste les étapes dans l'ordre |
| `uses:` | Utilise une action prête à l'emploi (créée par GitHub ou la communauté) |
| `run:` | Exécute une commande shell |
| `with:` | Passe des paramètres à une action |

---

## 5. Créer un workflow pour taskFlow

Ton projet a une structure **monorepo** (client + server dans le même repo). Voici des workflows adaptés.

### 5.1 — Workflow de vérification du code (CI)

Crée le fichier `.github/workflows/check.yml` :

```yaml
name: ✅ Vérification du Code

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:

  # ─────────────────────────────────────────────
  # JOB 1 : Vérifier le linting et les types
  # ─────────────────────────────────────────────
  lint-and-types:
    name: Lint & Types
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Récupérer le code
        uses: actions/checkout@v4

      - name: 🟢 Installer Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'             # Met en cache node_modules pour aller plus vite

      - name: 📦 Installer les dépendances
        run: npm install

      - name: 🔍 Vérifier le formatage (Biome)
        run: npx biome check --error-on-warnings .

      - name: 🔷 Vérifier les types TypeScript (client)
        run: npm run check-types --workspace=client

      - name: 🔷 Vérifier les types TypeScript (server)
        run: npm run check-types --workspace=server

  # ─────────────────────────────────────────────
  # JOB 2 : Lancer les tests
  # ─────────────────────────────────────────────
  tests:
    name: Tests
    runs-on: ubuntu-latest
    # Ce job attend que le job précédent soit OK
    needs: lint-and-types

    steps:
      - name: 📥 Récupérer le code
        uses: actions/checkout@v4

      - name: 🟢 Installer Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 📦 Installer les dépendances
        run: npm install

      - name: 🧪 Lancer les tests (server)
        run: npm run test --workspace=server

  # ─────────────────────────────────────────────
  # JOB 3 : Vérifier que le build fonctionne
  # ─────────────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint-and-types

    steps:
      - name: 📥 Récupérer le code
        uses: actions/checkout@v4

      - name: 🟢 Installer Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 📦 Installer les dépendances
        run: npm install

      - name: 🏗️ Builder le client (React/Vite)
        run: npm run build --workspace=client

      - name: 🏗️ Builder le serveur (TypeScript)
        run: npm run build --workspace=server
```

### 5.2 — Workflow de build Docker (optionnel)

Crée le fichier `.github/workflows/docker.yml` :

```yaml
name: 🐳 Build Docker

on:
  push:
    branches:
      - main     # Seulement sur main, pas à chaque push

jobs:
  docker:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Récupérer le code
        uses: actions/checkout@v4

      - name: 🔑 Se connecter à Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}   # Variable secrète (voir section 6)
          password: ${{ secrets.DOCKERHUB_TOKEN }}      # Variable secrète (voir section 6)

      - name: 🐳 Builder et pousser l'image Docker
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/taskflow:latest
```

---

## 6. Les secrets GitHub — cacher les infos sensibles

**Jamais** de mot de passe ou clé API directement dans un fichier `.yml` ! On utilise les **Secrets GitHub**.

### Comment ajouter un secret ?

1. Va sur ton dépôt GitHub
2. Clique sur **Settings** (⚙️ Paramètres)
3. Dans le menu gauche : **Secrets and variables → Actions**
4. Clique sur **New repository secret**
5. Donne un nom (ex: `DOCKERHUB_USERNAME`) et une valeur
6. Clique **Add secret**

### Utiliser un secret dans un workflow

```yaml
# ❌ JAMAIS faire ça (mot de passe visible dans le code)
password: monMotDePasse123

# ✅ TOUJOURS faire ça (secret caché)
password: ${{ secrets.MON_SECRET }}
#          ^^^^^^^^^^^^^^^^^^^^^^^^^
#          GitHub remplace ça par la vraie valeur
#          mais ne l'affiche jamais dans les logs
```

### Secrets utiles pour taskFlow

| Nom du secret | Contenu |
|--------------|---------|
| `DOCKERHUB_USERNAME` | Ton nom d'utilisateur Docker Hub |
| `DOCKERHUB_TOKEN` | Ton token d'accès Docker Hub |
| `DATABASE_URL` | L'URL de connexion à ta base MySQL |
| `JWT_SECRET` | Ta clé secrète JWT |

---

## 7. Voir les résultats sur GitHub

### Où trouver tes workflows ?

1. Aller sur ton repo GitHub
2. Cliquer sur l'onglet **Actions** en haut

### Comprendre les icônes

| Icône | Signification |
|-------|--------------|
| 🟡 Cercle jaune | Le workflow est en cours d'exécution |
| ✅ Coche verte | Tout s'est bien passé |
| ❌ Croix rouge | Une étape a échoué |
| ⏭️ Cercle gris | Le job a été ignoré |

### En cas d'erreur ❌

1. Clique sur le workflow en rouge
2. Clique sur le job qui a échoué
3. Clique sur l'étape en rouge
4. Lis les logs — l'erreur est toujours expliquée

---

## 8. Erreurs fréquentes et solutions

### ❌ "Error: No such file or directory"
```
Error: ENOENT: no such file or directory, open 'package.json'
```
**Cause :** Tu as oublié l'étape `actions/checkout@v4`
**Solution :** Ajoute cette étape **en premier** dans ton job :
```yaml
- name: Récupérer le code
  uses: actions/checkout@v4
```

---

### ❌ "npm: command not found"
**Cause :** Node.js n'est pas installé sur le runner
**Solution :** Ajoute cette étape avant `npm install` :
```yaml
- name: Installer Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
```

---

### ❌ Le workflow ne se déclenche pas
**Cause :** Ta branche ne correspond pas à celle définie dans `on.push.branches`
**Solution :** Vérifie le nom de ta branche ou change la config :
```yaml
on:
  push:
    branches:
      - main
      - develop
      - '**'    # ← Déclenche sur TOUTES les branches
```

---

### ❌ "Permission denied" sur Docker Hub
**Cause :** Les secrets `DOCKERHUB_USERNAME` ou `DOCKERHUB_TOKEN` sont mal configurés
**Solution :** Vérifie dans **Settings → Secrets** que les noms correspondent exactement à ceux utilisés dans le `.yml`

---

### ❌ Les tests échouent à cause de la base de données
**Cause :** Le job `tests` essaie de se connecter à MySQL mais il n'y en a pas sur le runner
**Solution :** Lance un service MySQL dans le workflow :
```yaml
jobs:
  tests:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: taskflow_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
```

---

## 9. Récapitulatif visuel

```
┌─────────────────────────────────────────────────────────────────┐
│                     TON CYCLE CI/CD                             │
│                                                                 │
│  Tu codes sur ta branche                                        │
│           │                                                     │
│           ▼                                                     │
│  git push / Pull Request                                        │
│           │                                                     │
│           ▼                                                     │
│  ┌────────────────────┐                                         │
│  │   GitHub Actions   │  ← Déclenché automatiquement            │
│  └────────────────────┘                                         │
│           │                                                     │
│    ┌──────┴──────┐                                              │
│    │             │                                              │
│    ▼             ▼                                              │
│ ✅ Lint       🧪 Tests                                           │
│ ✅ Types      ✅ Build                                           │
│    │             │                                              │
│    └──────┬──────┘                                              │
│           │                                                     │
│    ┌──────▼──────┐                                              │
│    │  Tout vert ? │                                             │
│    └──────┬──────┘                                              │
│           │                                                     │
│     ✅ OUI │              ❌ NON                                 │
│           │                │                                    │
│           ▼                ▼                                    │
│    Merge autorisé    Notification d'erreur                      │
│    (ou déploiement)  → Tu corriges le bug                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Pour démarrer maintenant

Suis ces 3 étapes dans l'ordre :

**Étape 1** — Crée le fichier de workflow :
```bash
mkdir -p .github/workflows
touch .github/workflows/check.yml
```

**Étape 2** — Copie le contenu du [Workflow de vérification](#51--workflow-de-vérification-du-code-ci) dans ce fichier

**Étape 3** — Pousse sur GitHub :
```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow"
git push
```

Puis va sur l'onglet **Actions** de ton repo GitHub pour voir la magie opérer ! ✨

---

## 📚 Ressources utiles

- [Documentation officielle GitHub Actions (FR)](https://docs.github.com/fr/actions)
- [Catalogue des actions disponibles](https://github.com/marketplace?type=actions)
- [Syntaxe complète des workflows](https://docs.github.com/fr/actions/writing-workflows/workflow-syntax-for-github-actions)

---

*Ce guide est basé sur le projet **taskFlow** — monorepo Node.js avec client React/Vite/TypeScript et serveur Express/TypeScript/MySQL.*
