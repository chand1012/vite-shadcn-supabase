# React + Vite + shadcn/ui + Supabase + Stripe

This is a fullstack project template that uses React, Vite, shadcn/ui, Supabase, and Stripe. The idea is that we wanted something fast to develop with that could be used to build a SaaS product. We want to use Vercel's v0 to quickly develop components and pages, hence the choice of shadcn/ui. However, we wanted to be able to deploy a super tiny and fast frontend, so we decided on Vite with React Router Dom for the frontend. All backend code will be developed in Deno and hosted on Supabase Functions, as will our database and authentication. We will use Stripe for payments, which will handle all of our billing and subscription management.

## TODO
- [x] Create payment page
- [x] Create user page
- [x] add link to manage subscriptions on stripe on the user page
- [x] database migrations for subscriptions and payments
- [x] Database migrations for user data (name, and other details. Use email as primary key)
- [x] Make payments work via Stripe
- [x] make backend update for subscriptions
- [ ] Add affiliate system
