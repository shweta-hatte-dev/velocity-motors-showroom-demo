# Velocity Motors: Showroom Demo Website

A premium motorcycle and scooter showroom website (React, Vite, TypeScript, Tailwind, Framer Motion). No backend and no paid APIs. Built as a sales demo for showroom owners.

## Run locally
1. Install Node.js 18 or newer from nodejs.org.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open the address shown (usually http://localhost:5173).

Run `npm run build` to check for errors before deploying.

## Customise for a real showroom
- **`src/config/showroom.ts`**: name, logo text, phone, WhatsApp number (digits only with country code, e.g. 919812345678), address, map links, social links, opening hours, hero text, offers.
- **`src/data/bikes.ts`**: the bike inventory. Prices and specs are indicative sample values, so verify and edit them.
- **`src/data/accessories.ts`**: accessories and indicative prices.
- **Real photos**: put images in `public/bikes/` and set `image: "/bikes/my-bike.jpg"` on a bike (or `image` on a colour). Without a photo, or if a photo fails to load, a generated bike illustration is shown, so there are never broken images.
- **Logo**: replace the text logo in `src/components/Layout.tsx` with an `<img>`.
- Remove the small "Demo experience" label by setting `showDemoBadge: false`.

## Publish with GitHub and Vercel
1. Extract the ZIP. Create a free account at github.com and click **New repository**.
2. Upload the extracted files to the repository (**uploading files** works; do not upload `node_modules`).
3. Create a free account at vercel.com, click **Add New, Project**, and import your GitHub repository.
4. Vercel detects Vite automatically. Click **Deploy**. `vercel.json` already handles page routing.
5. Share the link, or turn it into a QR code for the showroom.

## Notes
- Favourites, comparison, recently viewed and saved colours use your browser's localStorage.
- Test ride, exchange, EMI and service enquiries open WhatsApp with the details filled in. Nothing is confirmed automatically.
- The sample testimonials are labelled as demo content; replace them with real reviews.
