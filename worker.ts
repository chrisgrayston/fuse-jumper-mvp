interface ScoreEntry {
  initials: string;
  score: number;
}

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/scores') {
      const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

      if (request.method === 'GET') {
        const raw = await env.SCORES.get('leaderboard');
        const scores: ScoreEntry[] = raw ? JSON.parse(raw) : [];
        return new Response(JSON.stringify(scores), { headers: cors });
      }

      if (request.method === 'POST') {
        const body = await request.json() as { initials?: unknown; score?: unknown };
        const initials = typeof body.initials === 'string'
          ? body.initials.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3).padEnd(3, 'A')
          : null;
        const score = typeof body.score === 'number' && Number.isFinite(body.score) && body.score >= 0
          ? Math.floor(body.score)
          : null;

        if (!initials || score === null) {
          return new Response('Bad Request', { status: 400 });
        }

        const raw = await env.SCORES.get('leaderboard');
        const scores: ScoreEntry[] = raw ? JSON.parse(raw) : [];
        scores.push({ initials, score });
        scores.sort((a, b) => b.score - a.score);
        scores.splice(10);
        await env.SCORES.put('leaderboard', JSON.stringify(scores));
        return new Response(JSON.stringify(scores), { headers: cors });
      }

      return new Response('Method Not Allowed', { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};
