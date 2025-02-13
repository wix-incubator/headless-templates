# 🚀 Wix Astro Blog Template

This project combines the official [Astro Blog template](https://github.com/withastro/astro/tree/main/examples/blog) with **[Wix Headless](https://dev.wix.com/docs/go-headless)**, enabling seamless content management with Wix while delivering a high-performance static site using Astro.

## 📖 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Installation](#-installation)
- [How It Works](#-how-it-works)

## ✨ Features

- **🚀 Astro-powered blog** – Minimal, performant, and SEO-friendly with built-in optimizations.
- **📝 Wix Blog as a Headless CMS** – Manage blog content directly in the Wix Dashboard without touching code.
- **🔗 Seamless Integration** – Uses [`@wix/astro`](https://www.npmjs.com/package/@wix/astro) to fetch and display Wix Blog content dynamically.

## 🌍 Live Demo

Check out the **Wix Astro Blog Demo** here:

👉 **[Live Demo](https://netlify.blog-demo.wix.dev/)**

## ⚡ Installation

### 1️⃣ Create the project

Scaffold a new Wix Astro Blog project using the official template:

```sh
npm create @wix/edge@latest -- --template https://github.com/wix-incubator/headless-templates/tree/main/astro/blog
```

### 2️⃣ Pull environment variables

Sync required keys and settings with Wix:

```sh
npx @wix/edge pull-env
```

This generates a `.env.local` file with your environment variables.

### 3️⃣ Start the development server

Run the local development server:

```sh
npm run dev
```

Visit **[http://localhost:4321/](http://localhost:4321/)** to view your blog. 🎉

### 4️⃣ Manage content

The blog includes **sample posts** to start. Edit or add new posts via the **Wix Blog Dashboard**:

1. Open the **Wix Dashboard** → **Blog**.
2. Update or create new posts.
3. Modify **titles, content, images, and tags**.
4. Publish or save as a draft.

More details: [Wix Blog Docs](https://support.wix.com/en/wix-blog-1401920).

## 🛠 How It Works

- **📝 Content Management** – Create and manage posts, categories, and tags in the **Wix Blog Dashboard**.
- **📡 Data Fetching** – Uses `wixBlogLoader` from `@wix/astro`, an **Astro Content Loader**, to fetch and format posts into **Astro's official blog schema**. This loader's `load` function retrieves and transforms the data, making it available to create the blog content collection.
- **⚡ Fast & Optimized** – Blog posts are statically generated for speed, but organized and managed by Wix.
- **🚀 Easy Deployment** – Deploy to **Vercel, Netlify, or GitHub Pages** while still allowing real-time content updates.
