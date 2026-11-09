import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.unityweb': 'application/octet-stream',
  '.data': 'application/octet-stream',
  '.txt': 'text/plain; charset=utf-8',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Clean HTML to bypass Linewise, remove framebusters, strip X-Frame-Options, and stub 3kh0 root scripts
function cleanGameHtml(html, gameId) {
  let cleaned = html;

  // 1. Remove X-Frame-Options and restrictive CSP meta tags
  cleaned = cleaned.replace(/<meta[^>]*X-Frame-Options[^>]*>/gi, '');
  cleaned = cleaned.replace(/<meta[^>]*Content-Security-Policy[^>]*>/gi, '');

  // 2. Remove standard framebuster scripts that break iframes
  cleaned = cleaned.replace(/this\.top\.location\s*!==\s*this\.location[^;]*;/gi, '/* framebuster bypassed */');
  cleaned = cleaned.replace(/top\.location\s*!==\s*self\.location[^;]*;/gi, '/* framebuster bypassed */');
  cleaned = cleaned.replace(/window\.top\.location\s*=\s*window\.self\.location[^;]*;/gi, '/* framebuster bypassed */');
  cleaned = cleaned.replace(/if\s*\(\s*top\s*!==\s*self\s*\)\s*top\.location[^}]*}/gi, '/* framebuster bypassed */');
  cleaned = cleaned.replace(/if\s*\(\s*window\.top\s*!==\s*window\.self\s*\)[^}]*}/gi, '/* framebuster bypassed */');

  // 3. Stub 3kh0 main.js tracking and analytics
  cleaned = cleaned.replace(/<script[^>]*src=["']\/js\/main\.js["'][^>]*><\/script>/gi, '');

  // 4. Inject <base> tag and Poki / GameMaker helper mocks so all relative assets resolve to proxy
  const injection = `
    <base href="/games-engine/${gameId}/">
    <script>
      // DILL PICKLE Game Sandbox Shim
      window.PokiSDK = window.PokiSDK || {
        init: function() { return Promise.resolve(true); },
        customEvent: function() {},
        gameplayStart: function() {},
        gameplayStop: function() {},
        commercialBreak: function() { return Promise.resolve(); },
        rewardedBreak: function() { return Promise.resolve(true); },
        displayAd: function() {}
      };
      window.PokiSDK_OK = true;
    </script>
  `;

  if (cleaned.includes('<head>')) {
    cleaned = cleaned.replace('<head>', `<head>${injection}`);
  } else if (cleaned.includes('<head ')) {
    cleaned = cleaned.replace(/<head[^>]*>/, `$&${injection}`);
  } else {
    cleaned = `${injection}${cleaned}`;
  }

  return cleaned;
}

// In-memory cache for game assets to ensure blazingly fast reloads on Chromebooks
const assetCache = new Map();

// Universal Game Engine Proxy Route: Serves clean real games with proper MIME types
app.get('/games-engine/:gameId*', async (req, res) => {
  try {
    const { gameId } = req.params;
    let subpath = req.params[0] || '';

    // Handle root of game: redirect to ensure trailing slash for relative assets
    if (!subpath || subpath === '/') {
      subpath = '/index.html';
    }

    if (subpath.startsWith('/')) {
      subpath = subpath.slice(1);
    }

    const isIndexHtml = subpath === 'index.html' || subpath === '';
    const cacheKey = `${gameId}/${subpath}`;

    if (assetCache.has(cacheKey) && !isIndexHtml) {
      const cached = assetCache.get(cacheKey);
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(cached.buffer);
    }

    // Upstream CDN mirrors in order of speed and stability
    const upstreamUrls = [
      `https://cdn.jsdelivr.net/gh/3kh0/3kh0-lite@main/projects/${gameId}/${subpath}`,
      `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${gameId}/${subpath}`
    ];

    let response = null;
    for (const url of upstreamUrls) {
      try {
        const r = await fetch(url);
        if (r.ok) {
          response = r;
          break;
        }
      } catch {
        // Try next mirror
      }
    }

    if (!response || !response.ok) {
      // Check if there is a local file in /public/games
      const localFallback = path.join(__dirname, 'public', 'games', `${gameId}.html`);
      if (isIndexHtml && fs.existsSync(localFallback)) {
        const localContent = fs.readFileSync(localFallback, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(localContent);
      }

      return res.status(404).send(`Game asset not found: ${gameId}/${subpath}`);
    }

    const ext = path.extname(subpath).toLowerCase();
    const contentType = MIME_TYPES[ext] || response.headers.get('content-type') || 'application/octet-stream';

    if (isIndexHtml || ext === '.html' || ext === '.htm') {
      const rawHtml = await response.text();
      const cleaned = cleanGameHtml(rawHtml, gameId);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.removeHeader('X-Frame-Options');
      return res.send(cleaned);
    }

    // For binary or other assets (js, wasm, png, ogg, etc.)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cache smaller assets (< 15MB)
    if (buffer.length < 15 * 1024 * 1024) {
      assetCache.set(cacheKey, { buffer, contentType });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buffer);
  } catch (err) {
    console.error('Proxy Error:', err);
    res.status(500).send('Failed to proxy game asset');
  }
});

// Web Browser Unblock Proxy: Strips X-Frame-Options and rewrites links
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).send('Missing url query parameter');
  }

  try {
    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    } catch {
      return res.status(400).send('Invalid URL format');
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    if (contentType.includes('text/html')) {
      let html = await response.text();
      html = html.replace(/<meta[^>]*X-Frame-Options[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*Content-Security-Policy[^>]*>/gi, '');

      const origin = parsedUrl.origin;
      const baseTag = `<base href="${origin}/">
      <script>
        // Intercept link clicks to keep navigation inside DILL PICKLE proxy
        document.addEventListener('click', function(e) {
          var a = e.target.closest('a');
          if (a && a.href && !a.href.startsWith('javascript:')) {
            e.preventDefault();
            window.location.href = '/api/proxy?url=' + encodeURIComponent(a.href);
          }
        }, true);
      </script>`;

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}`);
      } else if (html.includes('<head ')) {
        html = html.replace(/<head[^>]*>/, `$&${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    } else {
      res.setHeader('Content-Type', contentType);
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }
  } catch (err) {
    console.error('Web Proxy error:', err);
    res.status(502).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DILL PICKLE Proxy Notice</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #07130b; color: #e2e8f0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .box { max-width: 480px; padding: 32px; background: #0c2014; border: 1px solid #1b4428; border-radius: 16px; }
            h2 { color: #34d399; margin-top: 0; }
            p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
            a { display: inline-block; margin-top: 16px; padding: 10px 20px; background: #10b981; color: #000; font-weight: bold; border-radius: 8px; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>🥒 Web Unblock Notice</h2>
            <p>Could not load through proxy. You can launch this URL in a stealth popout tab.</p>
            <a href="${targetUrl}" target="_blank" rel="noopener noreferrer">Open Direct Window</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Configure Vite integration
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: Number(PORT),
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🥒 DILL PICKLE Game Server running on http://localhost:${PORT}`);
  });
}

startServer();
