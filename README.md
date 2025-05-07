# SHWRK.com

The main landing page for the shwrk.com domain, designed to showcase and link to various subprojects.

## Features

- Modern, responsive design using Tailwind CSS
- Mobile-friendly navigation
- Project showcase section
- About and contact sections
- Easy to update for new projects

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the CSS:
   ```
   npm run build:css
   ```
4. For development with live CSS updates:
   ```
   npm run watch:css
   ```

## Development

To add a new project:

1. Open `index.html`
2. Duplicate a project card in the projects section
3. Update the title, description, and link
4. Add a project image in the assets directory (recommended)
5. Update the image reference in the project card

## Deployment to GitHub Pages

1. Make sure your repository is set up for GitHub Pages
2. Go to your GitHub repository settings
3. Under "GitHub Pages", set the source branch (usually `main` or `master`)
4. The site will be published to `https://yourusername.github.io/repository-name/`

To use with a custom domain (shwrk.com):

1. In your repository settings, under "GitHub Pages", enter your custom domain
2. Create a CNAME file in the root of your repository with the domain name:
   ```
   shwrk.com
   ```
3. Set up DNS records for your domain:
   - Type: A, Name: @, Value: 185.199.108.153
   - Type: A, Name: @, Value: 185.199.109.153
   - Type: A, Name: @, Value: 185.199.110.153
   - Type: A, Name: @, Value: 185.199.111.153
   - Type: CNAME, Name: www, Value: yourusername.github.io

## License

ISC 