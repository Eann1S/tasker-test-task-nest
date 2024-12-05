/* eslint-disable */
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { spawn } from 'child_process';

var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  const dbContainerStartup = async () => {
    console.log('\nStarting database container...\n');

    const dbContainer = await new PostgreSqlContainer().start();
    process.env.DB_HOST = dbContainer.getHost();
    process.env.DB_PORT = dbContainer.getFirstMappedPort().toString();
    process.env.POSTGRES_USER = dbContainer.getUsername();
    process.env.POSTGRES_PASSWORD = dbContainer.getPassword();
    process.env.POSTGRES_DB = dbContainer.getDatabase();

    console.log('\nDatabase container started\n');
    return dbContainer;
  };

  const serverStartup = () => {
    console.log('\nStarting server...\n');

    const server = spawn('nx', ['serve', 'tasker-test-task-nest'], {
      shell: true,
      stdio: 'pipe',
    });
    console.log('\nServer started\n');

    server.stdout.on('data', (data) => {
      console.log(`Server Output: ${data}`);
    });

    server.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    return server;
  };

  const db = await dbContainerStartup();
  const server = serverStartup();

  globalThis.__SERVER_PROCESS__ = server;
  globalThis.__DB_CONTAINER__ = db;
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';

  await new Promise((resolve) => setTimeout(resolve, 5000));
};
