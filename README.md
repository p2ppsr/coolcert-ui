# coolcert-ui

Simple UI project for CoolCert, with a React frontend and BSV deployment tooling.

## Project Structure

- `frontend/` — Vite + React app
- `deployment-info.json` — deployment metadata
- `package.json` (root) — Lars/Cars deployment scripts

## Getting Started

From the repository root:

```bash
npm install
npm install --prefix frontend
npm run dev --prefix frontend
```

The frontend will run at `http://localhost:5173` by default.

## Frontend Scripts

```bash
npm run dev --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
npm run lint --prefix frontend
```

## Deployment Scripts

From the repository root:

```bash
npm run lars
npm run cars
npm run lars:config
```

## License

See [LICENSE.txt](./LICENSE.txt).
