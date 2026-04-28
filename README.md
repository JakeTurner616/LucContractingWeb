## Project Overview

This repo contains a custom-built static site powered by Astro and the Decap content management system.

---

## Update & Deployment Workflow

Content updates are handled through the Decap CMS interface at /admin, and use github oauth for admin authentication

Publishing content follows a fully automated pipeline:

1. Changes are made and published through the CMS
2. The CMS commits those changes to the GitHub repository
3. GitHub Actions (or equivalent) triggers a build
4. Astro compiles the site into static files
5. The site is deployed automatically
6. Changes appear live once the deployment completes

---

## Stack

- **Web Framework:** Astro
- **CMS:** Decap CMS (Git-based)
- **Deployment:** Automated CI/CD workflow

---

## Assets & Media

- Images uploaded via the CMS are stored within the repository
- Assets are optimized during the build process
- The site is generated as static files for maximum performance and serving on CDN at scale

---

## Access & Usage Notes

- This repository contains commissioned, proprietary code
- Access is provided strictly for maintaining and updating this specific website
- Content (text, images, branding) belongs to the client
- Code, structure, and deployment systems remain the property of the developer

For licensing details, refer to the `LICENSE.md` file.

---

## Support

For technical support, questions, or modification requests, please contact:

**Jakob Turner**  
jake@serverboi.org