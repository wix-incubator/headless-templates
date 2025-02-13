🚀 Wix AstroWind Template

This project combines the popular AstroWind template with Wix Headless, enabling seamless content management with Wix while delivering a high-performance, modern Astro site.

📖 Table of Contents

Features

Demo

Installation

How It Works

✨ Features

🌟 AstroWind-powered site – A feature-rich, elegant, and highly performant template built with Astro and Tailwind CSS, designed for modern content-driven and optimized performance websites.

📝 Wix CMS & Blog Integration – Manage content dynamically through the Wix CMS and Wix Blog.

💲 Wix Pricing Plans Integration – Display pricing tiers and connect users to the Wix Checkout page.

🔗 Seamless Data Fetching – Uses @wix/astro to integrate and fetch Wix content.

🌍 Live Demo

Check out the Wix AstroWind Demo here:

👉 Live Demo 

⚡ Installation

1️⃣ Create the project

Scaffold a new Wix AstroWind project using the official template:

npm create @wix/edge@latest -- --template https://github.com/wix-incubator/headless-templates/tree/main/astro/astrowind

2️⃣ Pull environment variables

Sync required API keys and settings with Wix:

npx @wix/edge pull-env

This generates a .env.local file with your environment variables.

3️⃣ Start the development server

Run the local development server:

npm run dev

Visit http://localhost:4321/ to view your site. 🎉

4️⃣ Manage content

The site includes sample content to start. Edit or add new content via the Wix Dashboard:

Open the Wix Dashboard → CMS, Blog, or Pricing Plans.

Update or create new entries for blog posts, services, and pricing plans.

Modify titles, content, images, and sections.

Publish or save as a draft.

More details:

Wix CMS Docs

Wix Blog Docs

Wix Pricing Plans Docs

🛠 How It Works

📝 Content Management – Create and manage content dynamically in the Wix CMS Dashboard, including blog posts, services, and pricing plans.

📡 Data Fetching – Uses wixBlogLoader from @wix/astro, an Astro Content Loader, to:

Fetch and format blog posts dynamically to create the blog collection.

Retrieve CMS data from a single collection to render content in the services page.

Fetch pricing plans and display pricing tiers.

All of this is possible thanks to the wix() Astro adapter implemented by the @wix/astro package, allowing seamless data retrieval through the Wix SDK.

⚡ Fast & Optimized – Pages are statically generated for speed while still supporting real-time content updates from Wix.

🚀 Easy Deployment – Deploy to Vercel, Netlify, or GitHub Pages while maintaining dynamic content capabilities from Wix.
