# Noordergloed - Artisanale Kombucha & Workshops

Een moderne e-commerce website voor artisanale kombucha en workshops, gevestigd in Groningen.

## Functies

- **Productcatalogus**: Vlierbloesem en rozen siropen met stockindicatoren
- **Ramen Pre-orders**: Chicken Shoyu Ramen reserveringssysteem
- **Admin Dashboard**: Productbeheer en orderoverzicht
- **Email Notificaties**: Automatische bevestigingen via Mailjet
- **Responsive Design**: Mobile-first ontwerp met dark mode

## Tech Stack

- **Frontend**: React + TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL met Drizzle ORM
- **Email**: Mailjet API
- **State Management**: TanStack Query
- **Routing**: Wouter

## Installatie

```bash
npm install
```

## Environment Variables

Maak een `.env` bestand aan met:

```env
DATABASE_URL=your_postgresql_connection_string
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
```

## Database Setup

```bash
npm run db:push
```

## Development

```bash
npm run dev
```

De applicatie draait op http://localhost:5000

## Production Build

```bash
npm run build
npm start
```

## Admin Toegang

- Username: `admin`
- Password: `PlukPoot2025!Secure#Admin`

## Deployment

Deze applicatie is geoptimaliseerd voor deployment op Render met:
- Automatische builds
- PostgreSQL database integratie
- Environment variables management

## Contact

Voor vragen over de producten: Star Numanstraat, Groningen