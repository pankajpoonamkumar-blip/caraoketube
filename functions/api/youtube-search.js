// Cloudflare Pages Function: GET /api/youtube-search?q=...
// Official YouTube Data API. Add YOUTUBE_API_KEY as a secret in Cloudflare Pages settings.
export async function onRequestGet({ request, env, waitUntil }) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim().slice(0, 100);
  const json = (b, s = 200, h = {}) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json', ...h } });
  if (!q) return json({ results: [] });
  if (!env.YOUTUBE_API_KEY) return json({ error: 'not configured', results: [] }, 500);

  const cache = caches.default, key = new Request(url.origin + '/api/youtube-search?q=' + encodeURIComponent(q.toLowerCase()));
  const hit = await cache.match(key);
  if (hit) return hit;

  const query = /karaoke/i.test(q) ? q : q + ' karaoke';
  const s = await fetch('https://www.googleapis.com/youtube/v3/search?' + new URLSearchParams({
    part: 'snippet', type: 'video', maxResults: '12', videoEmbeddable: 'true', safeSearch: 'moderate', q: query, key: env.YOUTUBE_API_KEY }));
  if (!s.ok) return json({ error: 'upstream', results: [] }, 502);
  const items = (await s.json()).items || [];
  const dur = {};
  if (items.length) {
    const v = await fetch('https://www.googleapis.com/youtube/v3/videos?' + new URLSearchParams({
      part: 'contentDetails', id: items.map(i => i.id.videoId).join(','), key: env.YOUTUBE_API_KEY }));
    if (v.ok) for (const x of (await v.json()).items || []) {
      const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(x.contentDetails.duration) || [];
      const h = +m[1] || 0, mi = +m[2] || 0, sec = String(+m[3] || 0).padStart(2, '0');
      dur[x.id] = h ? `${h}:${String(mi).padStart(2, '0')}:${sec}` : `${mi}:${sec}`;
    }
  }
  const results = items.map(i => ({ id: i.id.videoId, title: i.snippet.title, channel: i.snippet.channelTitle,
    duration: dur[i.id.videoId] || '', thumbnail: i.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${i.id.videoId}/hqdefault.jpg` }));
  const res = json({ results }, 200, { 'Cache-Control': 'public, max-age=86400' });
  waitUntil(cache.put(key, res.clone()));
  return res;
}
