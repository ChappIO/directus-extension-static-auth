import { defineHook } from '@directus/extensions-sdk';
import type {Command} from "commander";
import type {ItemsService} from "@directus/api/services/items";
import type {User} from "@directus/types"

export default defineHook(({ init }, { services, getSchema}) => {

	init('cli.before', ({program}) => {
		const authCmd = (program as Command)
			.command("static-auth")
			.summary("manage static token accounts");

		authCmd.command('create')
			.argument('<token>', 'the token to use')
			.description('Create a static token, the --name option is used as the key for the token. This means that if you change the name, a new token will be created.')
			.option('--name', 'the unique name and key used for user account that manages the token', 'Static Token')
			.option('--not-admin', 'use this flag to prevent this user from becoming an admin user, this allows you to manually manage roles and permissions')
			.action(async (token: string, options: {name: string}) => {
				const users = new services.ItemsService({
					schema: await getSchema(),
				}) as ItemsService<User>;

				console.log({token, options});

				// let user = users.upsertOne({
				// 	first_name: options.name,
				// 	last_name: 'Static Authentication',
				// 	description: 'This user account',
				// 	token,
				// });
			});

		authCmd.command('delete')
			.option('--name', 'the unique name and key used for user account that manages the token', 'Static Token')
			.action(async (options : {name: string}) => {

			});
	});

});
