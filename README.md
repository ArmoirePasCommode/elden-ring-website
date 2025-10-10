# Elden Ring Website

Ce projet est un site web dédié à l'univers d'Elden Ring, développé avec React, Vite, TypeScript et Tailwind CSS.

## Fonctionnalités
- Présentation des demi-dieux
- Page d'accueil immersive
- Design responsive
- Pages d'erreur personnalisées

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Backend API (Express + Firestore + Cloud Storage)

- Démarrer le serveur localement (nécessite des identifiants Google ADC) :

```bash
npm run dev:server
```

- Builder le serveur:

```bash
npm run build:server
```

Variables d'environnement:

- `GCS_BUCKET` – nom de votre bucket GCS pour les images

Endpoints API:

- `GET /api/demigods` – lister les demi-dieux
- `GET /api/demigods/:id` – récupérer un demi-dieu
- `POST /api/demigods` – créer un demi-dieu `{ name, title?, description?, mainImageUrl? }`
- `PUT /api/demigods/:id` – modifier un demi-dieu
- `DELETE /api/demigods/:id` – supprimer un demi-dieu
- `POST /api/media/main-picture` – téléverser une image base64 `{ base64, filename?, contentType?, demigodId? }`

### Authentification Admin

- Identifiants par défaut: `guest` / `guest`
- Endpoint de connexion: `POST /api/auth/login` avec `{ "username": "guest", "password": "guest" }`
- La réponse contient `{ token }`. Le frontend le stocke dans localStorage et l’envoie dans l’en-tête `Authorization: Bearer <token>` pour les routes protégées.
- Routes protégées:
  - `POST /api/demigods`
  - `PUT /api/demigods/:id`
  - `DELETE /api/demigods/:id`
  - `POST /api/media/main-picture`

Variables d’environnement optionnelles:

- `ADMIN_USERNAME` (défaut: `guest`)
- `ADMIN_PASSWORD` (défaut: `guest`)
- `TOKEN_SECRET` (défaut: `dev-secret-change-me`)

### Téléversement d’images via AWS S3

Les images sont désormais envoyées vers AWS S3 (seulement pour les images). Configurez les variables suivantes :

- `S3_BUCKET`: Nom du bucket S3
- `S3_REGION`: Région du bucket (ex: `eu-west-3`)
- `AWS_ACCESS_KEY_ID`: Clé d’accès IAM avec permissions `s3:PutObject` et `s3:PutObjectAcl`
- `AWS_SECRET_ACCESS_KEY`: Secret associé

Le routeur `POST /api/media/main-picture` charge l’image dans `s3://${S3_BUCKET}/main/<fichier>` avec ACL `public-read` et renvoie une URL publique de type `https://<bucket>.s3.<region>.amazonaws.com/main/<fichier>` (ou `s3.amazonaws.com` pour `us-east-1`). Si `demigodId` est fourni, la propriété `mainImageUrl` de l’élément est mise à jour.

## Déploiement

Déployer sur Google App Engine :
1. Construisez le frontend et le serveur :
   ```bash
   npm run build && npm run build:server
   ```
2. Déployez :
   ```bash
   gcloud app deploy
   ```

## Structure du projet
- `src/` : Code source principal
- `public/` : Fichiers statiques
- `dist/` : Fichiers générés après build

## Auteur
- Inspiré par l'univers d'Elden Ring
