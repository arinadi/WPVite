import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// ThemeProvider will be handled inside the Theme App or not needed if we just pass props
// import { ThemeProvider } from '@/themes/default';
import type { RouteType } from './router';

// Verified tsconfig includes api now. the theme
// In a real WP world, we query DB based on route, get data, then pass to theme.

export async function renderPage(
  url: string,
  type: RouteType,
  data: any,
  siteOptions: any
) {
  // 1. Load Theme Component (Static import for now, dynamic later if needed)
  const ThemeApp = (await import('@/themes/default/App')).default;

  // 2. Render to string
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <ThemeApp type={type} data={data} siteOptions={siteOptions} />
    </StaticRouter>
  );

  // 3. Get Head tags
  const helmet = Helmet.renderStatic();

  // 4. Construct full HTML
  return `
    <!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        <link rel="stylesheet" href="/assets/style.css"> <!-- We need to handle CSS -->
        <script src="https://cdn.tailwindcss.com"></script> <!-- Quick hack for theme styling if we don't build separate CSS -->
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="root">${appHtml}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify({ type, data, siteOptions })};
        </script>
      </body>
    </html>
  `;
}
