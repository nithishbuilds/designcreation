// Vercel serverless function: keeps the OpenAI key secret on the server.
// Set OPENAI_API_KEY (required) and SITE_PASSWORD (optional) in Vercel → Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENAI_API_KEY is not set in Vercel Environment Variables.' });

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { prompt, model = 'gpt-image-1', size = '1024x1024', quality = 'high', password = '' } = body;

  const sitePw = process.env.SITE_PASSWORD;
  if (sitePw && password !== sitePw) return res.status(401).json({ error: 'Wrong site password.' });
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Please enter a description.' });

  const allowed = {
    'gpt-image-1': { sizes: ['1024x1024', '1536x1024', '1024x1536'], qualities: ['high', 'medium', 'low'] },
    'dall-e-3': { sizes: ['1024x1024', '1792x1024', '1024x1792'], qualities: ['hd', 'standard'] }
  };
  const cfg = allowed[model];
  if (!cfg || !cfg.sizes.includes(size) || !cfg.qualities.includes(quality)) {
    return res.status(400).json({ error: 'Invalid model, size or quality.' });
  }

  const payload = { model, prompt: prompt.slice(0, 4000), size, quality, n: 1 };
  if (model === 'gpt-image-1') {
    // JPEG keeps the response under Vercel's 4.5 MB limit
    payload.output_format = 'jpeg';
    payload.output_compression = 95;
  }

  try {
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) {
      let msg = data?.error?.message || `OpenAI error ${r.status}`;
      if (/verif/i.test(msg)) msg += ' — verify your OpenAI organization, or use dall-e-3 meanwhile.';
      return res.status(r.status).json({ error: msg });
    }
    const item = data.data?.[0] || {};
    const image = item.b64_json
      ? `data:image/${model === 'gpt-image-1' ? 'jpeg' : 'png'};base64,${item.b64_json}`
      : item.url;
    if (!image) return res.status(502).json({ error: 'No image returned.' });
    return res.status(200).json({ image });
  } catch (e) {
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
}
