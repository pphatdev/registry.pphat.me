# @pphatdev/registry

![@pphatdev/registry cover image](./public/cover.png)

[![Build & Test](https://github.com/pphatdev/icons/actions/workflows/ci.yml/badge.svg)](https://github.com/pphatdev/icons/actions/workflows/ci.yml)

Enterprise component and vector icon registry CLI for company frontend projects. 

This repository powers the frontend showcase and documentation site for the `@pphatdev/registry` CLI tool. It is built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Icon Studio**: Interactive SVG customizer, live preview, and search platform.
- 📦 **Component Blocks**: Extensive UI block components tailored for enterprise applications.
- ⚡ **CLI Tooling**: Add components and icons dynamically directly from your terminal.
- 🔍 **SEO Optimized**: Fully SSR & SSG capable with comprehensive OpenGraph and Sitemap configurations.

## Getting Started

### Local Development

1. Install dependencies using **pnpm**:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using the CLI

To use the registry in your own Next.js or Nuxt projects, install the CLI:

```bash
# Install globally
npm install -g @pphatdev/registry

# Initialize your project
pphat init

# Add an icon
pphat add f
```

## Contributing

Pushing or opening a Pull Request to the `main` branch will automatically trigger the CI workflow to lint and build the application.
