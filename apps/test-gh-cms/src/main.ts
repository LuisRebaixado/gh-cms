import { getOctokit, repoTest } from "github-cms";

const client = getOctokit(process.env["GH_TOKEN"]!);

repoTest(client, "vercel", "turbo");
