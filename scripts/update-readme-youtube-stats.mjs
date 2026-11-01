#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const START_MARKER = "<!-- YOUTUBE_STATS_START -->";
const END_MARKER = "<!-- YOUTUBE_STATS_END -->";
const README_PATH = path.resolve(process.cwd(), process.env.README_PATH ?? "README.md");
const DRY_RUN = process.argv.includes("--dry-run") || process.argv.includes("--preview");

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function formatCompactNumber(value) {
  const amount = Number(value) || 0;

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}M`;
  }

  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}K`;
  }

  return formatNumber(amount);
}

function buildReadmeBlock(stats) {
  const rows = [
    ["Total Views", formatNumber(stats.views)],
    ["Subscribers", formatCompactNumber(stats.subscribers)],
    ["Videos", formatNumber(stats.videos)],
    ["Programs", formatNumber(stats.programs ?? 0)],
  ];

  return [
    START_MARKER,
    "## YouTube Channel Stats",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    ...rows.map(([label, value]) => `| ${label} | \`${value}\` |`),
    END_MARKER,
  ].join("\n");
}

async function fetchStats() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || "";
  const apiKey = process.env.YOUTUBE_API_KEY || "";

  if (!channelId || !apiKey) {
    if (DRY_RUN) {
      return { views: 324941, subscribers: 3510, videos: 629, programs: Number(process.env.YOUTUBE_PROGRAMS_COUNT || 28) };
    }

    throw new Error("Missing required environment variables: YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "statistics");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YouTube API request failed (${response.status}): ${text}`);
  }

  const payload = await response.json();
  const item = payload.items?.[0];

  if (!item || !item.statistics) {
    throw new Error("No YouTube channel statistics were returned for the configured channel ID.");
  }

  return {
    views: Number(item.statistics.viewCount || 0),
    subscribers: Number(item.statistics.subscriberCount || 0),
    videos: Number(item.statistics.videoCount || 0),
    programs: Number(process.env.YOUTUBE_PROGRAMS_COUNT || 0),
  };
}

function updateReadme(readmeContent, replacement) {
  const startIndex = readmeContent.indexOf(START_MARKER);
  const endIndex = readmeContent.indexOf(END_MARKER);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`README is missing the YouTube stats markers (${START_MARKER} / ${END_MARKER}).`);
  }

  const before = readmeContent.slice(0, startIndex);
  const after = readmeContent.slice(endIndex + END_MARKER.length);
  return `${before}${replacement}${after}`.trimEnd() + "\n";
}

async function main() {
  const stats = await fetchStats();
  const replacement = buildReadmeBlock(stats);

  if (!fs.existsSync(README_PATH)) {
    throw new Error(`README.md was not found at ${README_PATH}`);
  }

  const readmeContent = fs.readFileSync(README_PATH, "utf8");
  const updatedReadme = updateReadme(readmeContent, `${replacement}\n\n`);

  if (DRY_RUN) {
    console.log(updatedReadme);
    return;
  }

  fs.writeFileSync(README_PATH, updatedReadme, "utf8");
  console.log(`Updated ${path.relative(process.cwd(), README_PATH)} with YouTube stats.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
