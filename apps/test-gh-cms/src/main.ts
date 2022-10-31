import { getOctokit, commitFiles } from "github-cms";

const client = getOctokit(process.env["GH_TOKEN"]!);
const jsonContent = JSON.stringify({
  test: 123,
  abc: 123,
  one: "two,three",
  k: [1, 2, 3],
  e: false
});
commitFiles({
  octokit: client,
  authorEmail: "lrebaixado@izishop.com",
  authorName: "lrebaixado",
  branch: "main",
  message: "add blabla2",
  owner: "LuisRebaixado",
  repo: "sturdy-invention",
  files: [
    {
      path: "test.json",
      content: jsonContent,
      mode: "100644",
      type: "commit"
    }
  ]
})
  .then(() => console.log("sucess"))
  .catch(console.log);
