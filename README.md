This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

```bash
/soulTalk
│── /pages
│   ├── /api
│   │   ├── auth
│   │   │   ├── register.js
│   │   │   ├── login.js
│   │   ├── threads
│   │   │   ├── index.js   (Get All Threads, Create Thread)
│   │   │   ├── [id].js    (Get, Update, Delete Thread)
│   │   ├── users
│   │   │   ├── profile.js (Get, Update Profile)
│   │   │   ├── follow.js  (Follow & Unfollow)
│   │   ├── tags
│   │   │   ├── index.js   (Get Tags)
│   │   │   ├── [tag].js   (Get Threads by Tag)
│   │   ├── likes
│   │   │   ├── [threadId].js (Like & Unlike)
│   │   ├── comments
│   │   │   ├── [threadId].js (Add & Get Comments)
│── /lib
│   ├── db.js         (MongoDB Connection)
│   ├── models
│   │   ├── User.js
│   │   ├── Thread.js
│   │   ├── Comment.js
│   │   ├── Like.js
│   │   ├── Follow.js
│── /utils
│   ├── authMiddleware.js (Middleware Authentication)
│   ├── bcrypt.js         (Password Hashing)
│   ├── jwt.js            (JWT Token Utilities)
│── .env.local
│── next.config.js
│── package.json
```