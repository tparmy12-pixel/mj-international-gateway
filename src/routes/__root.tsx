import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter,
  HeadContent, Scripts, Link,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center luxury-card p-10">
        <h1 className="text-6xl font-display gold-text">404</h1>
        <p className="mt-4 text-muted-foreground">This destination doesn't exist.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-2.5 rounded-full btn-gold font-semibold">
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center luxury-card p-10">
        <h1 className="text-2xl font-display text-gold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 px-6 py-2.5 rounded-full btn-gold font-semibold">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MJ International Tours — Premium International Travel Services" },
      { name: "description", content: "Trusted international travel agency for Umrah, Haj, Visas, Tours, Hotels & Flights worldwide. Luxury experiences. Apply online today." },
      { property: "og:title", content: "MJ International Tours — Premium International Travel Services" },
      { property: "og:description", content: "Trusted international travel agency for Umrah, Haj, Visas, Tours, Hotels & Flights worldwide. Luxury experiences. Apply online today." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "MJ International Tours — Premium International Travel Services" },
      { name: "twitter:description", content: "Trusted international travel agency for Umrah, Haj, Visas, Tours, Hotels & Flights worldwide. Luxury experiences. Apply online today." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b6c825e2-e3d5-4041-9819-231c4a968587/id-preview-82478dd4--f0aa20fb-b912-46b5-a327-ab7543886684.lovable.app-1778484690652.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b6c825e2-e3d5-4041-9819-231c4a968587/id-preview-82478dd4--f0aa20fb-b912-46b5-a327-ab7543886684.lovable.app-1778484690652.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-center" richColors />
    </QueryClientProvider>
  );
}
