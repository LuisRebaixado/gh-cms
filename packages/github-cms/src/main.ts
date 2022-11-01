import { Octokit } from "octokit";

export const getOctokit = (token: string) => {
  return new Octokit({ auth: token });
};
export const getLatestCommit = async (octokit: Octokit, owner: string, repo: string) => {
  const commits = await octokit.rest.repos.listCommits({
    owner,
    repo
  });
  return commits.data[0];
};
interface File {
  path: string;
  mode: "100644" | "100755" | "040000" | "160000" | "120000";
  type: "commit" | "tree" | "blob";
  sha?: string | null;
  content: string;
}
export const commitFiles = async (parameters: {
  octokit: Octokit;
  owner: string;
  repo: string;
  branch: string;
  message: string;
  files: File[];
  authorName: string;
  authorEmail: string;
}) => {
  const latestCommit = await getLatestCommit(parameters.octokit, parameters.owner, parameters.repo);
  const currentTree = await parameters.octokit.rest.git.createTree({
    owner: parameters.owner,
    repo: parameters.repo,
    tree: parameters.files,
    base_tree: latestCommit.sha
  });
  const currentCommit = await parameters.octokit.rest.git.createCommit({
    owner: parameters.owner,
    repo: parameters.repo,
    message: parameters.message,
    tree: currentTree.data.sha,
    parents: [latestCommit.sha],
    author: {
      name: parameters.authorName,
      email: parameters.authorEmail,
      date: new Date().toISOString()
    }
  });
  await parameters.octokit.rest.git.updateRef({
    owner: parameters.owner,
    repo: parameters.repo,
    ref: `heads/${parameters.branch}`,
    sha: currentCommit.data.sha
  });
};

export const getLatestFile = async (octokit: Octokit, owner: string, repo: string, branch: string, path: string) => {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref: `heads/${branch}`,
    mediaType: {
      format: "raw"
    }
  });
  if (typeof data !== "string") throw new Error("Path informed isn't a file");
  return JSON.parse(data);
};
