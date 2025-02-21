import knex, { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.hasTable('calendario').then(exists => {
        if (!exists) {
          return knex.schema.createTable('calendario', table => {
            table.increments('id').primary().unsigned();
            table.integer('usuarios_id').unsigned().notNullable();
            table.date('data_agendamento').notNullable();
            table.time('hora').notNullable();
            table.string('descricao', 255).notNullable();
            table.enu('status', ['PENDING', 'CONFIRMED', 'CANCELED']).defaultTo('PENDING');
            table.foreign('usuarios_id').references('usuarios.id').onDelete('CASCADE');
          });
        }
      });
    }

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('calendario');
}
