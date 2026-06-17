"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { shortenUrlAction, type ShortenResult } from "../actions/urls";
import { Copy, Check, Loader, ArrowRight } from "lucide-react";
import { useState } from "react";

export function ShortenForm() {
  const [state, action, pending] = useActionState<ShortenResult | null, FormData>(
    shortenUrlAction,
    null
  );
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ao entrar, foca no input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ao encurtar, seleciona o input para que o usuário
  // possa encurtar outra url, caso necessário
  useEffect(() => {
    if (state?.ok) {
      inputRef.current?.select();
    }
  }, [state]);

  async function handleCopy() {
    if (state?.ok) {
      await navigator.clipboard.writeText(state.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* formulário */}
      <form action={action} className="flex flex-col gap-2">
        <label
          htmlFor="url-input"
          className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase"
        >
          Long URL
        </label>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="url-input"
            name="url"
            type="url"
            placeholder="https://example.com/very/long/path"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={state?.ok === false}
            aria-describedby={state?.ok === false ? "url-error" : undefined}
            className="
              h-8 min-w-0 flex-1 border border-border bg-background px-2.5
              font-mono text-xs text-foreground placeholder:text-muted-foreground/50
              outline-none
              focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50
              aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-1
              aria-[invalid=true]:ring-destructive/20
              transition-all
            "
          />
          <Button type="submit" disabled={pending} size="default">
            {pending ? (
              <Loader className="size-3.5 animate-spin" />
            ) : (
              <ArrowRight className="size-3.5" />
            )}
            <span>{pending ? "Shortening…" : "Shorten"}</span>
          </Button>
        </div>

        {state?.ok === false && (
          <p id="url-error" className="text-[11px] text-destructive">
            {state.error}
          </p>
        )}
      </form>

      {/* resultado */}
      {state?.ok && (
        <div className="flex flex-col gap-1.5 border border-border bg-muted/40 px-3 py-2.5">
          <span className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
            Short URL
          </span>
          <div className="flex items-center gap-2">
            <a
              href={state.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1 truncate font-mono text-xs text-primary underline-offset-2 hover:underline"
            >
              {state.shortUrl}
            </a>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy short URL"}
            >
              {copied ? (
                <Check className="size-3.5 text-primary" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
