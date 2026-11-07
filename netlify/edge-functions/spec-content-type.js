// The specs are proxied from GitHub (see static/_redirects), which serves them as text/plain.
// Netlify ignores Content-Type overrides in _headers for proxied responses, so set it here.
export default async function specContentType(request, context) {
  const response = await context.next();
  if (!response.ok) return response;

  const headers = new Headers(response.headers);
  headers.set('content-type', 'application/yaml; charset=utf-8');
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export const config = {
  path: ['/openapi.yaml', '/asyncapi.yaml'],
  onError: 'bypass',
};
