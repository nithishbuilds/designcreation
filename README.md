# Pentacle AI Image Studio (Vercel)

A simple website for creating high-quality ("ultra") images with the OpenAI Images API. It is hosted on Vercel.

Your OpenAI key is **never** in the web page. It is stored in Vercel settings and used only by the server function, so visitors can't see or steal it.

## Project files

```
pentacle-image-studio/
├── index.html        ← the website (home page)
├── api/
│   └── generate.js   ← server function that talks to OpenAI using your secret key
├── vercel.json       ← Vercel settings (60-second time limit for image generation)
├── package.json
└── README.md
```

## Deploy to Vercel (no coding needed)

1. Unzip `pentacle-image-studio.zip`.
2. Go to **vercel.com** and sign in. GitHub sign-in is easiest.
3. Put the folder online using **one** of these options:
   - **GitHub (recommended):** Create a new GitHub repository and upload all the files, including the `api` folder. In Vercel, click **Add New → Project → Import** and choose that repository.
   - **Vercel CLI:** Run `npm i -g vercel`, then `vercel` inside the folder.
4. Before deploying, or afterwards under **Project → Settings → Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `OPENAI_API_KEY` | your OpenAI key (`sk-proj-...`) |
   | `SITE_PASSWORD` | any password you choose (optional, but recommended) |

5. Click **Deploy**. If you added or changed variables after deploying, go to **Deployments → ⋯ → Redeploy**.
6. Open your site, for example `https://pentacle-image-studio.vercel.app`.

> ⚠️ Use a **new** OpenAI key. The old one was shared in a chat, so delete it at platform.openai.com → API keys.

## How to use the site

1. Enter the **site password** if you set one. The browser remembers it.
2. Type what you want in **Describe the image**.
3. Choose **Model**, **Size**, **Quality** (**Ultra / High** gives the best images) and **Number of images**.
4. Click **Generate image** and wait 30–60 seconds.
5. Click **Download** under each image.

## Tips for better images

- Describe the subject, style, lighting, background and colours.
- Add words like *ultra detailed, photorealistic, studio lighting, product photography*.
- For print designs (DTF, UV print, bottles), add *flat design, plain background, high contrast*.

## Common errors

| Message | Fix |
|---------|-----|
| *OPENAI_API_KEY is not set* | Add the variable in Vercel settings, then redeploy. |
| *Wrong site password* | Type the password set in `SITE_PASSWORD`. |
| *verify your OpenAI organization* | Verify at platform.openai.com → Settings → Organization, or use **dall-e-3** until then. |
| *Incorrect API key* / 401 | Replace `OPENAI_API_KEY` with a valid key, then redeploy. |
| *insufficient_quota* | Add credit at platform.openai.com → Billing. |
| *took too long* / 504 | Try **Medium** quality or a smaller size. The Vercel free plan allows up to 60 seconds. |
| *content policy* | Change the wording of your description. |

## Notes

- Every image is charged to your OpenAI account. Set `SITE_PASSWORD` so strangers can't use your credits.
- gpt-image-1 images are returned as high-quality JPEG (95%) to stay within Vercel's response size limit.
- To change the key, update `OPENAI_API_KEY` in Vercel, then redeploy. You don't need to edit any code.
