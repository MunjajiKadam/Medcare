import { fileURLToPath } from 'url';

export const proxy = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'Missing url parameter' });

  let target;
  try {
    target = new URL(url);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid url' });
  }

  // Allow only loopback addresses for safety
  const allowedHosts = ['localhost', '127.0.0.1', '::1'];
  if (!allowedHosts.includes(target.hostname)) {
    return res.status(403).json({ message: 'Proxy only allows loopback hosts' });
  }

  try {
    const resp = await fetch(target.toString());
    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await resp.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    // Pass along cache headers
    const cacheControl = resp.headers.get('cache-control');
    if (cacheControl) res.setHeader('Cache-Control', cacheControl);
    res.status(resp.status).send(buffer);
  } catch (err) {
    console.error('Proxy fetch error', err);
    res.status(502).json({ message: 'Failed to fetch target' });
  }
};

export default { proxy };
