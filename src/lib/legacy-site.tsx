import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { LegacyInteractions } from "@/components/legacy-interactions";

const legacyRoot = path.join(process.cwd(), "www.smktelkom-mlg.sch.id");

export function legacyPathFromSegments(segments: string[] = []): string {
  if (segments.length === 0) return "index.html";

  const relativePath = segments.join("/");
  return relativePath.endsWith(".html") ? relativePath : `${relativePath}.html`;
}

export async function getLegacyFilePaths(): Promise<string[]> {
  const files: string[] = [];

  async function visit(directory: string) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        files.push(path.relative(legacyRoot, fullPath).replaceAll(path.sep, "/"));
      }
    }
  }

  await visit(legacyRoot);
  return files;
}

function routeFromLegacyPath(filePath: string): string {
  if (filePath === "index.html") return "/";

  return `/${filePath.replace(/\.html$/, "")}`;
}

function rewriteUrl(value: string, currentFile: string): string {
  if (
    value.startsWith("#") ||
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("javascript:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  const assetPath = value.replace(/^(?:\.\.\/)*assets\//, "");
  if (assetPath !== value) return `/legacy/assets/${assetPath}`;

  const base = new URL(`https://legacy.local/${currentFile}`);
  const resolved = new URL(value, base);

  if (resolved.origin !== base.origin) return value;

  const route = routeFromLegacyPath(resolved.pathname.slice(1));
  return `${route}${resolved.search}${resolved.hash}`;
}

function rewriteMarkup(markup: string, currentFile: string): string {
  return markup
    .replace(/\b(src|href|action)=(['"])(.*?)\2/gi, (_match, attribute, quote, value) => {
      return `${attribute}=${quote}${rewriteUrl(value, currentFile)}${quote}`;
    })
    .replace(/\b(srcset)=(['"])(.*?)\2/gi, (_match, attribute, quote, value) => {
      const rewritten = value
        .split(",")
        .map((candidate: string) => {
          const [url, descriptor] = candidate.trim().split(/\s+/, 2);
          const nextUrl = rewriteUrl(url, currentFile);
          return descriptor ? `${nextUrl} ${descriptor}` : nextUrl;
        })
        .join(", ");
      return `${attribute}=${quote}${rewritten}${quote}`;
    });
}

function extractBody(markup: string): string {
  const bodyMatch = markup.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch?.[1] ?? markup;
}

export async function LegacyDocument({ filePath }: { filePath: string }) {
  let markup: string;

  try {
    markup = await fs.readFile(path.join(legacyRoot, filePath), "utf8");
  } catch {
    notFound();
  }

  const content = rewriteMarkup(extractBody(markup!), filePath);

  return (
    <div className="legacy-page">
      <link rel="stylesheet" href="/legacy/assets/frontend/css/style.css" precedence="default" />
      <link rel="stylesheet" href="/legacy/assets/frontend/css/responsive.css" precedence="default" />
      <link rel="stylesheet" href="/legacy/assets/frontend/css/fontawesome.min.css" precedence="default" />
      <link rel="stylesheet" href="/legacy/assets/frontend/css/calendar.css" precedence="default" />
      <link rel="stylesheet" href="/legacy/assets/frontend/css/kc.fab.css" precedence="default" />
      <LegacyInteractions />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
