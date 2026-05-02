import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Подбор вакансий по России и СНГ — чат с менеджером" },
      { name: "description", content: "Персональные подборки проверенных вакансий. Менеджер на связи прямо в чате — расскажите, какую работу вы ищете." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Подбор вакансий по России и СНГ — чат с менеджером" },
      { property: "og:description", content: "Персональные подборки проверенных вакансий. Менеджер на связи прямо в чате — расскажите, какую работу вы ищете." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Подбор вакансий по России и СНГ — чат с менеджером" },
      { name: "twitter:description", content: "Персональные подборки проверенных вакансий. Менеджер на связи прямо в чате — расскажите, какую работу вы ищете." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8bd30225-f1af-4900-bcf7-32fa3def7a07/id-preview-3cbf5827--563d4818-8bf2-43e8-9794-75089bf94cfb.lovable.app-1777701140666.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8bd30225-f1af-4900-bcf7-32fa3def7a07/id-preview-3cbf5827--563d4818-8bf2-43e8-9794-75089bf94cfb.lovable.app-1777701140666.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
