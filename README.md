# Mini Food Ordering Frontend

Frontend for the Mini Food Ordering System.

Built with:

- Next.js
- React
- TypeScript
- Tailwind CSS

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Make sure the backend is running on:

```txt
http://localhost:3001
```

## Run locally

```bash
npm run dev
```

Frontend URL:

```txt
http://localhost:3000
```

The home page redirects to:

```txt
/restaurants
```

## Build

```bash
npm run build
```

Start production build:

```bash
npm run start
```

## Pages

| Route               | Description                       |
| ------------------- | --------------------------------- |
| `/login`            | Login page                        |
| `/register`         | Registration page                 |
| `/restaurants`      | Restaurant list                   |
| `/restaurants/[id]` | Restaurant details, menu and cart |
| `/orders/[id]`      | Order details                     |

## Features

- Register customer
- Login customer
- Store JWT token in localStorage
- List restaurants
- Show restaurant menu
- Add menu items to local cart
- Place order
- Show order details

## API

The frontend calls the backend API using:

```txt
NEXT_PUBLIC_API_BASE_URL
```

Example:

```txt
http://localhost:3001
```

Protected order requests use the JWT token:

```txt
Authorization: Bearer <token>
```

## Notes

- Cart state is stored locally in React state.
- JWT token is stored in localStorage.
- No payment integration.
- No restaurant admin panel.
