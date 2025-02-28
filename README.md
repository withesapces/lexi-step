This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TODO 


- Le streak ne doit pas être pris en compte si l'utilisateur n'a pas atteint son quota journalier (au moment de l'enregistrement d'un writing) 👌
  a. Si un utilisateur modifie son objectif quotidien, ça doit mettre à jour le streak. 👌
  b. Si un utilisateur ne se connecte pas et perds sa streak, il ne faut pas attendre qu'il publie une nouvelle entrée pour mettre à jour sa streak
  b. Si un utilisateur perds une streak un jour, il peut la retrouver en regardant une pub. Si c'est 2x d'affiliée, il ne peut pas et c'est perdu. 
- Faire les badges (une fois qu'on a gagné un badge, on ne doit pas pouvoir le perdre) 👌
- Avant le lancement il doit y avoir le mode prompt comme jeu
- Quand on supprime un article, ça ne doit pas supprimer le nombre de mots totaux
- L'utilisateur doit avoir un nom de profil qui doit être unique et pas un nom et prénom 👌
- Trouver ce qui sera payant et non payant

- LEXISTEP
  - lib
    - prisma.ts
  - prisma
    - schema.prisma
    - migrations
  - app
    - api
      - auth
        - login
          - route.ts
        - register
          - route.ts
    - auth
      - [...nextauth]
        - route.ts
      - login
        - page.tsx
      - register
        - page.tsx
    - components
      - Navbar.tsx
    - settings
      - page.tsx
    - account
      - page.tsx
  - middleware.ts
  - globals.css
  - layout.tsx
  - page.tsx (le carnet d'écriture)
  - next-auth.d.ts
  - providers.tsx
  - public
  - node_modules
  - .gitignore
  - favicon.ico
  - next-env.d.ts
  - next.config.ts
  - package-lock.json
  - package.json
  - postcss.config.mjs
  - README.md
  - tailwind.config.ts
  - tsconfig.json
