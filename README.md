# Carlos Faustino — Portfolio

Bilingual portfolio built with Astro.

## Local development

```bash
npm install
npm run dev
```

Open the local URL shown by Astro.

## Production build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Create a GitHub repository.
2. Push this project to the repository.
3. In Vercel, choose **Add New → Project**.
4. Import the GitHub repository.
5. Vercel should detect Astro automatically.
6. Deploy.

For this static Astro project no Vercel adapter is required.

## Languages

- `/es/` — Spanish
- `/en/` — English
- `/` — language landing page

## Before publishing

- Add a professional profile photo to `public/profile.webp` and uncomment the image in `Hero.astro` if desired.
- Add your GitHub URL when available.
- Review confidential case studies before publication to ensure they comply with applicable NDAs.
- Add a custom domain in Vercel when ready.

## Docker

### Build

```bash
docker build -t carlos-faustino-portfolio .
```

### Run

```bash
docker run --rm -p 8080:80 --name carlos-faustino-portfolio carlos-faustino-portfolio
```

Open:

```text
http://localhost:8080
```

### Docker Compose

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Stop:

```bash
docker compose down
```

### Architecture

```text
node:22-alpine
      |
      | npm run build
      v
Astro dist/
      |
      v
nginx:1.27-alpine
      |
      v
Port 80
```

The final production image contains only Nginx and the static build output. Node.js and the source build environment remain in the build stage.



## Site structure

The portfolio intentionally uses only two main pages per language:

- `/es/` and `/en/` — professional profile, photo, stack, experience, certification and contact.
- `/es/projects/` and `/en/projects/` — projects and case studies.

The root `/` is only a small language selector.


## Portfolio UX

The Projects page keeps the two-page architecture and adds:

- Project filters by category.
- `Live` and `Confidential` badges.
- Modal case-study details without creating extra routes.
- Public links only for publicly accessible projects.
- Anonymized descriptions for confidential work.
- `CF` favicon and basic Open Graph metadata.

## Latest project additions

- TUNNME — Ruby on Rails / Bootstrap
- Tailwind CSS added to the general frontend technology stack.
