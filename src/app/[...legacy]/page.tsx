import type { Metadata } from "next";
import {
  getLegacyFilePaths,
  LegacyDocument,
  legacyPathFromSegments,
} from "@/lib/legacy-site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const files = await getLegacyFilePaths();

  return files
    .filter((filePath) => filePath !== "index.html")
    .map((filePath) => ({
      legacy: filePath.replace(/\.html$/, "").split("/"),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legacy: string[] }>;
}): Promise<Metadata> {
  const { legacy } = await params;
  const filePath = legacyPathFromSegments(legacy);

  return {
    title: `SMK Telkom Malang | ${filePath.replace(/\.html$/, "")}`,
  };
}

export default async function LegacyRoute({
  params,
}: {
  params: Promise<{ legacy: string[] }>;
}) {
  const { legacy } = await params;
  return <LegacyDocument filePath={legacyPathFromSegments(legacy)} />;
}
