# Directus extension: Manage Static Tokens on CLI
[![directus-extension-static-auth](https://npmbadge.com/npm/directus-extension-static-auth?mode=yarn)](https://www.npmjs.com/package/directus-extension-static-auth)

This simple extension lets you create users and roles with static access tokens from the command line. Very useful to provision your directus deployments and other backend when you're using CI/CD.

## Usage

To install the extension, simply install the package into your project:

```bash
npm install directus-extension-static-auth
```

or

```bash
yarn add directus-extension-static-auth
```

Then, run the `static-auth create` command to create a new user and role with a static access token: `directus static-auth token create my-super-secret-token`.

```bash
directus static-auth --help

Usage: directus static-auth create [options] <token>

Create a static token, the name option is used as the key for the token. This means that if you change the name, a new token will be created.

Arguments:
  token              the token to use

Options:
  --name <userName>  the unique name and key used for user account that manages the token (default: "Token")
  --role <roleName>  the name of the role used to manage this authentication. If this option is not provided, the name defaults to the --name option
  --not-admin        use this flag to prevent this role from becoming an administrator, this allows you to manually manage roles and permissions (default: false)
  -h, --help         display help for command
```
