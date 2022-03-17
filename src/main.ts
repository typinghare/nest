import { createTypeOrmConnections } from './database';
import { supervisorBootstrap } from './supervisor/boostrap';

async function bootstrap() {
  // TypeORM connections
  await createTypeOrmConnections();

  // Supervisor
  await supervisorBootstrap();
}

bootstrap().then();
