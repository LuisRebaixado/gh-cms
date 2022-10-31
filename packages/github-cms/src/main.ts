import { Octokit } from "octokit";

export const getOctokit = (token: string) => {
  return new Octokit({ auth: token });
};
export const repoTest = async (octokit: Octokit, owner: string, repo: string) => {
  const commits = await octokit.rest.repos.listCommits({
    owner,
    repo
  });
  commits.data.forEach((d) => {
    console.log(d.commit.author);
  });
};
