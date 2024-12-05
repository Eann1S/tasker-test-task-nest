/* eslint-disable */

import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { ChildProcessWithoutNullStreams } from 'child_process';
import kill from 'tree-kill';

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  const server = globalThis.__SERVER_PROCESS__;
  if (server) {
    if (server.pid) {
      kill(server.pid);
      console.log('\nServer process group killed\n');
    }
  }

  const db: StartedPostgreSqlContainer = globalThis.__DB_CONTAINER__;
  await db.stop();

  console.log('\nCleaned up\n');
};
