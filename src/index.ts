import { defineHook } from '@directus/extensions-sdk';
import type {Command} from "commander";
import type {ItemsService} from "@directus/api/dist/services/items";
import type {User, Role} from "@directus/types"

export default defineHook(({ init }, { services, getSchema, logger}) => {

	init('cli.before', ({program}) => {
		const authCmd = (program as Command)
			.command("static-auth")
			.summary("manage static token accounts");

		authCmd.command('create')
			.argument('<token>', 'the token to use')
			.description('Create a static token, the name option is used as the key for the token. This means that if you change the name, a new token will be created.')
			.option('--name <userName>', 'the unique name and key used for user account that manages the token', 'Token')
			.option('--role <roleName>', 'the name of the role used to manage this authentication. If this option is not provided, the name defaults to the --name option')
			.option('--not-admin', 'use this flag to prevent this role from becoming an administrator, this allows you to manually manage roles and permissions', false)
			.action(async (token: string, options: {name: string, role?: string, notAdmin: boolean}) => {
				const users = new services.ItemsService('directus_users', {
					schema: await getSchema(),
				}) as ItemsService<User>;
				const roles = new services.ItemsService('directus_roles', {
					schema: await getSchema(),
				}) as ItemsService<Role>;


				const firstName = options.name;
				const lastName = 'Static Authentication';
				const roleName = options.role || options.name;

				const matchingUsers = await users.readByQuery({
					filter: {
						first_name: {
							_eq: firstName
						},
						last_name: {
							_eq: lastName
						}
					}
				});

				if(matchingUsers.length === 0) {
					logger.info(`No user was found with first name [${firstName}] and last name [${lastName}]... creating...`);
					const newUser = await users.createOne({
						first_name: firstName,
						last_name: lastName,
						description: 'This user is managed by directus-extension-static-auth'
					})
					matchingUsers.push(await users.readOne(newUser));
				} else {
					logger.info('Found user... updating...');
				}

				logger.debug(`Static Auth User: `, matchingUsers[0]);

				const matchingRoles = await roles.readByQuery({
					filter: {
						name: {
							_eq: roleName
						}
					}
				});

				if(matchingRoles.length === 0) {
					logger.info(`No role was found with name [${roleName}] creating...`);
					const newRole = await roles.createOne({
						name: roleName,
					})
					matchingRoles.push(await roles.readOne(newRole));
				} else {
					logger.info('Found role... updating...');
				}

				await roles.updateOne(matchingRoles[0]!.id, {
					admin_access: !options.notAdmin
				});

				await users.updateOne(matchingUsers[0]!.id, {
					token,
					role: matchingRoles[0]!.id as any
				});

				process.exit(0);
			});
	});

});
