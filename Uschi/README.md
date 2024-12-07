oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g uschi-cli
$ uschi-cli COMMAND
running command...
$ uschi-cli (--version)
uschi-cli/0.0.0 darwin-x64 node-v18.14.0
$ uschi-cli --help [COMMAND]
USAGE
  $ uschi-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`uschi-cli hello PERSON`](#uschi-cli-hello-person)
* [`uschi-cli hello world`](#uschi-cli-hello-world)
* [`uschi-cli help [COMMANDS]`](#uschi-cli-help-commands)
* [`uschi-cli plugins`](#uschi-cli-plugins)
* [`uschi-cli plugins:install PLUGIN...`](#uschi-cli-pluginsinstall-plugin)
* [`uschi-cli plugins:inspect PLUGIN...`](#uschi-cli-pluginsinspect-plugin)
* [`uschi-cli plugins:install PLUGIN...`](#uschi-cli-pluginsinstall-plugin-1)
* [`uschi-cli plugins:link PLUGIN`](#uschi-cli-pluginslink-plugin)
* [`uschi-cli plugins:uninstall PLUGIN...`](#uschi-cli-pluginsuninstall-plugin)
* [`uschi-cli plugins:uninstall PLUGIN...`](#uschi-cli-pluginsuninstall-plugin-1)
* [`uschi-cli plugins:uninstall PLUGIN...`](#uschi-cli-pluginsuninstall-plugin-2)
* [`uschi-cli plugins update`](#uschi-cli-plugins-update)

## `uschi-cli hello PERSON`

Say hello

```
USAGE
  $ uschi-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/falsanu/uschi/uschi-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `uschi-cli hello world`

Say hello world

```
USAGE
  $ uschi-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ uschi-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `uschi-cli help [COMMANDS]`

Display help for uschi-cli.

```
USAGE
  $ uschi-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for uschi-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `uschi-cli plugins`

List installed plugins.

```
USAGE
  $ uschi-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ uschi-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `uschi-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ uschi-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ uschi-cli plugins add

EXAMPLES
  $ uschi-cli plugins:install myplugin 

  $ uschi-cli plugins:install https://github.com/someuser/someplugin

  $ uschi-cli plugins:install someuser/someplugin
```

## `uschi-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ uschi-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ uschi-cli plugins:inspect myplugin
```

## `uschi-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ uschi-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ uschi-cli plugins add

EXAMPLES
  $ uschi-cli plugins:install myplugin 

  $ uschi-cli plugins:install https://github.com/someuser/someplugin

  $ uschi-cli plugins:install someuser/someplugin
```

## `uschi-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ uschi-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ uschi-cli plugins:link myplugin
```

## `uschi-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ uschi-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ uschi-cli plugins unlink
  $ uschi-cli plugins remove
```

## `uschi-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ uschi-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ uschi-cli plugins unlink
  $ uschi-cli plugins remove
```

## `uschi-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ uschi-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ uschi-cli plugins unlink
  $ uschi-cli plugins remove
```

## `uschi-cli plugins update`

Update installed plugins.

```
USAGE
  $ uschi-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
