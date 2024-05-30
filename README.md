## Capstone Project (PROJ-309-SDF)

Project name: Connexion Café POS web application

Team members:

- Sheung Man Chan (Simon)
- Suet Ying Kong (Suey)
- Tat Chun Fok (David)

### Introduction

The [Connexion Café](https://connexion.wccac.net/), located at [Westside Calgary Chinese Alliance Church](https://www.wccac.net/), is a non-profit ministry that aims to provide a space for inter-generational and inter-congregational conversations as well as relationship building. The café operates on a simple and traditional business model, where customers choose from a menu of drinks and snacks, and the sales are recorded manually by the staff using pen and paper. This method reflects the café's dedication to a personal approach in serving its community. However, the café recognizes the potential benefits of upgrading its system to enhance efficiency and improve customer service.

### Progress report

**week 1**

- Contacted WCCAC (Westside Calgary Chinese Alliance Church) for discussion of the desired features of POS app
  > - Confirmed using React Next.js to develop a web app
  > - Use Firebase for authentication
  > - Use Firestore for NoSQL database on google cloud
  > - Target Device is Samsung tablet A8

**week 2**

- Initiated the project, committed to Github
- Login Page started
- Connected to Firebase for Authentication – now using Github login for testing – Oauth set in Github
- Used [`Vercel`](https://capstone-connexion-cafe.vercel.app/) for immediate and auto deployment
- Started Home page – split into Components Navigation and Order-page – in progress

**week 3**

- Items list(json) added using LOCAL data for testing
- Items moved to Firestore
- Integrated firestore into orderpage, now we can map all the products in the page
- Order page(item list) – in progress
- Edit page - in progress, so we can easily add products to the database
- Done - Add product functions tested successfully
- Will do -> map all products in edit page and then add a delete button to delete the products +/- modify the products

**week 3**

- Map all products in edit page
- delete button and edit button function
- Solved the bug for auto update of products in edit page
- Started doing the order logic for the main order page
- Will do -> finish all add and deduct function
- Will do -> check out function
---

### Information of Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

#### Getting Started

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

#### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

#### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
