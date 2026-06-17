import { getRecentUrls } from "@/lib/db/actions";
import { ShortenForm } from "@/components/shorten-form";
import { ExternalLink, Link2 } from "lucide-react";

export default async function Page() {
  const recentUrls = await getRecentUrls();

  function formatDate(date: Date | null) {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function truncate(str: string, max: number) {
    if (str.length <= max) return str;
    return str.slice(0, max) + "…";
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-1">
        <div className="group flex items-center gap-2">
          <Link2 className="size-4 text-primary" />
          <span className="flex items-baseline font-mono text-sm font-semibold tracking-tight select-none">
            <span>encurta</span>
            <span className="inline-block max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-[2ch] group-hover:opacity-100 text-primary"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              &nbsp;a
            </span>
            <span className="text-primary">í</span>
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Paste a long URL. Get a short one.
        </p>
      </header>

      <section aria-label="URL shortener">
        <ShortenForm />
      </section>

      {/* URLs recentes */}
      {recentUrls.length > 0 && (
        <section aria-label="Recent URLs" className="flex flex-col gap-3">
          <h2 className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
            Recent
          </h2>

          <ul className="flex flex-col divide-y divide-border border border-border">
            {recentUrls.map((entry) => (
              <li
                key={entry.id}
                className="group flex flex-col gap-0.5 px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                {/* URL curta */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={entry.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-medium text-primary underline-offset-2 hover:underline"
                  >
                    /{entry.shortcode}
                  </a>
                  <ExternalLink className="size-2.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground/60">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>

                {/* URL longa */}
                <span
                  title={entry.longUrl}
                  className="truncate font-mono text-[11px] text-muted-foreground"
                >
                  {truncate(entry.longUrl, 72)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentUrls.length === 0 && (
        <section>
          <p className="font-mono text-[11px] text-muted-foreground">
            No URLs shortened yet. Paste one above to start.
          </p>
        </section>
      )}
    </main>
  );
}
