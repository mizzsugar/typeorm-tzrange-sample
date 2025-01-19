import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export default new DataSource({
  type: 'postgres',
  host: 'postgres',
  port:  5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  logging: true,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'src', 'migrations', '*.{ts,js}')],
});