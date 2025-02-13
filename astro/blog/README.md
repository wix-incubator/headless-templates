# 🚀 Wix Astro Blog Template

This project combines the official [Astro Blog template](https://github.com/withastro/astro/tree/main/examples/blog) with [**Wix Headless**](https://dev.wix.com/docs/go-headless), enabling seamless content management with Wix while delivering a high-performance static site using Astro.

## ✨ Features

- **Astro-powered blog** – A minimal, performant, and SEO-friendly blog template with built-in support for sitemap and RSS.
- **Wix Blog as a Headless CMS** – Manage blog posts, drafts, categories, and tags directly in the Wix Dashboard.
- **Seamless Integration** – Uses [`@wix/astro`](https://www.npmjs.com/package/@wix/astro) to fetch and display Wix Blog content.

## ⚡ Installation

Follow these steps to set up your Wix Astro Blog:

### 1️⃣ Create the project

Run the following command to set up the template:

```sh
npm create @wix/edge@latest -- --template https://github.com/wix-incubator/headless-templates/tree/main/astro/blog
```

### 2️⃣ Pull environment variables

After setting up the project, run:

```sh
npx @wix/edge pull-env
```

This will generate the `.env.local` file with the required environment variables.

### 3️⃣ Start the development server

Once everything is set up, start the local server:

```sh
npm run dev
```

Your blog will be available at **[http://localhost:4321/](http://localhost:4321/)** 🎉.
