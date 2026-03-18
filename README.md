# ⏱️ Time Price

See what things really cost — in hours of your life, not dollars.

## What it does

Time Price converts any purchase price into working hours based on your income. It helps you make smarter spending decisions by reframing money as time.

**Features:**
- Income input (hourly wage or annual salary)
- Instant time-cost calculation as you type
- Time-saving analysis with payback period
- Verdict system (worth it / borderline / not worth it)
- Quick-fill presets (cleaning, meals, subscriptions, robot vacuum)
- Example cards showing costs at your rate
- Mobile-first, fully responsive

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How calculations work

1. **Hourly rate**: If salary mode, `hourly = annual_salary / (weekly_hours × 52)`
2. **Time cost**: `hours = price / hourly_rate`
3. **Time saving**: Monthly hours saved compared to purchase time cost
4. **Verdict**:
   - ✨ Worth it → monthly saved ≥ time cost
   - 🤔 Borderline → 70%–100% of time cost
   - 💸 Not worth it → below 70%

## Tech stack

- Next.js 16 + TypeScript
- Tailwind CSS v4
- No backend, no database, no auth
- Fully static (can be deployed anywhere)

## Future ideas

- Save preferences to localStorage
- Share results as an image
- Currency/locale support
- More presets & categories
- Dark mode
