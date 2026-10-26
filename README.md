
# Trench Predictions

A responsive football predictions dashboard built with Next.js and TypeScript.

## Features

- Football fixture dashboard
- Search by team or competition
- 1X2 match outcome probabilities
- Over 2.5 goals probabilities
- Both Teams To Score (BTTS)
- Combined market probabilities
- Mobile-friendly layout
- Basic admin API access check
- Progressive Web App manifest

## Requirements

- Node.js 20 or later
- npm
- A GitHub account
- A football-data.org API token for supported live fixtures

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment variables

Create a file named `.env.local` in the project root.

Add:

```env
FOOTBALL_DATA_TOKEN=your_football_data_token
ADMIN_SECRET=your_long_random_secret
```

Never commit `.env.local` or share real secrets publicly.

Without FOOTBALL_DATA_TOKEN, the app uses fictional demo fixtures.

## Prediction model limitations

The current prediction engine uses generic expected-goal assumptions.

It does not yet incorporate team-specific form, injuries, lineups, historical results, or bookmaker odds. Its percentages are illustrative estimates, not guaranteed outcomes.

## Deployment

The project can be deployed to a compatible Next.js hosting service such as Vercel.

Configure environment variables in the hosting dashboard before using live fixtures or the admin API check.

## Important

The current admin endpoint only checks a shared secret. It is not a complete user authentication system or a full administration dashboard.

The manifest alone does not provide full offline functionality. A service worker or other offline implementation would be needed.

## License

MIT
