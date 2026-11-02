
const MIME_TYPES = {
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  mp4: 'audio/mp4',
  aac: 'audio/aac',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  flac: 'audio/flac',
  aiff: 'audio/aiff',
  aif: 'audio/aiff',
  wma: 'audio/x-ms-wma'
};

export default async (request) => {
  const url = new URL(request.url);
  const fileId = url.pathname.split('/').filter(Boolean).pop();

  if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return new Response('ID file non valido', { status: 400 });
  }

  const name = url.searchParams.get('name') || '';
  const extension = (name.split('.').pop() || '').toLowerCase();
  const mimeType = MIME_TYPES[extension] || 'application/octet-stream';
  const upstreamUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  const headers = new Headers();
  const range = request.headers.get('range');
  if (range) headers.set('Range', range);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method === 'HEAD' ? 'HEAD' : 'GET',
      headers,
      redirect: 'follow'
    });

    const responseHeaders = new Headers();
    for (const header of ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
      const value = upstream.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }
    responseHeaders.set('Content-Type', mimeType);
    responseHeaders.set('Content-Disposition', 'inline');
    responseHeaders.set('Cache-Control', 'public, max-age=300');
    responseHeaders.set('X-Content-Type-Options', 'nosniff');

    const upstreamType = upstream.headers.get('content-type') || '';
    if (upstreamType.includes('text/html')) {
      return new Response(
        'Google Drive ha restituito una pagina HTML invece del file audio. Verificare la condivisione.',
        {
          status: 502,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }
      );
    }

    return new Response(request.method === 'HEAD' ? null : upstream.body, {
      status: upstream.status,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(`Errore durante il recupero da Google Drive: ${error.message}`, {
      status: 502
    });
  }
};
