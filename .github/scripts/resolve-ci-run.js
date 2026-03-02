/**
 * Resolves the successful CI run ID for the current commit SHA.
 * This script finds the 'CI - run tests' workflow run that completed successfully
 * for the current commit, so artifacts can be downloaded from that run.
 */
module.exports = async ({github, context, core}) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const sha = context.sha;

  console.log(`Searching for successful CI run for commit: ${sha}`);

  const runs = await github.paginate(github.rest.actions.listWorkflowRunsForRepo, {
    owner,
    repo,
    head_sha: sha,
    status: 'completed',
    per_page: 100
  });

  console.log(`Found ${runs.length} completed workflow runs for this commit`);

  const ciRun = runs.find((run) => run.name === 'CI - run tests' && run.conclusion === 'success');

  if (!ciRun) {
    core.setFailed(`No successful CI - run tests workflow found for commit ${sha}`);
    return;
  }

  console.log(`Found successful CI run: ${ciRun.id} (${ciRun.html_url})`);
  core.setOutput('run_id', String(ciRun.id));
};
