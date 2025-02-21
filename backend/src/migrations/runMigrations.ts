import knex from './kinexfiles'; // Importando a configuração do knex
import { up } from './create_usuarios_table';
import { up as upEventos } from './create_eventos_tables';
import { up as upCalendario } from './create_calendario_table';

async function runMigrations() {
  try {
    await up(knex); // Executa a migration de usuarios
    await upEventos(knex); // Executa a migration de eventos
    await upCalendario(knex); // Executa a migration de calendario
    console.log('Migrations executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrations:', error);
  } finally {
    knex.destroy(); // Finaliza a conexão
  }
}

runMigrations();
