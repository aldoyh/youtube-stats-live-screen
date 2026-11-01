# Radio Bahrain Channel Stats

This repository includes a live YouTube stats panel and an automated README updater. The stats table below is refreshed daily at 11:00 UTC by GitHub Actions.

## Channel Snapshot

<!-- YOUTUBE_STATS_START -->
## YouTube Channel Stats

| Metric | Value |
| --- | ---: |
| Total Views | `0` |
| Subscribers | `0` |
| Videos | `0` |
| Programs | `0` |
<!-- YOUTUBE_STATS_END -->

You can refresh the block locally at any time with:

```bash
npm run update:readme -- --dry-run
```

To enable the automated update, add these repository secrets/variables:

- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`
- `YOUTUBE_PROGRAMS_COUNT` (optional; defaults to `28`)
