# React + Vite + shadcn/ui + Supabase + Stripe

This is a fullstack project template that uses React, Vite, shadcn/ui, Supabase, and Stripe. The idea is that we wanted something fast to develop with that could be used to build a SaaS product. We want to use Vercel's v0 to quickly develop components and pages, hence the choice of shadcn/ui. However, we wanted to be able to deploy a super tiny and fast frontend, so we decided on Vite with React Router Dom for the frontend. All backend code will be developed in Deno and hosted on Supabase Functions, as will our database and authentication. We will use Stripe for payments, which will handle all of our billing and subscription management.

## TODO
- [ ] Create payment page
- [ ] Create subscription page
- [ ] Create user page
- [ ] database migrations for subscriptions and payments
- [ ] Database migrations for user data (name, and other details. Use email as primary key)
- [ ] Make payments work via Stripe
