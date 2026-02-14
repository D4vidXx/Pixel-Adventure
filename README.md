
  # Main Menu Screen

  This is a code bundle for Main Menu Screen. The original project is available at https://www.figma.com/design/MjCIDzQFHJdXdFpnugeu3C/Main-Menu-Screen.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

    ## Deploying to Cloudflare Pages

    1. Push this project to a GitHub repository.
    2. In Cloudflare Dashboard, go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
    3. Select your repository and branch (`main`).
    4. Use these build settings:
      - **Build command:** `npm run build`
      - **Build output directory:** `dist`
    5. Click **Deploy**.

    ### Optional: Node version fix

    If Cloudflare build fails due to Node version, set this environment variable in your Pages project settings and redeploy:

    - `NODE_VERSION=20`
  