# Uschi Managment CLI
This Code runs the whole show.


# Installation
`npm install`  
`sudo bin/dev webserver` to start the webserver  
`sudo bin/dev spawn` to start the cli  

**For production**
`npm run build`  
`sudo bin/run webserver` to start the webserver  
`sudo bin/run spawn` to start the cli  


***make sure to run the service or cli as root, otherwise the LED-Panel will not work***



# Commands
<!-- commands -->
- [Uschi Managment CLI](#uschi-managment-cli)
- [Installation](#installation)
- [Commands](#commands)
  - [`uschi-cli help [COMMANDS]`](#uschi-cli-help-commands)
  - [`uschi-cli spawn [SERVICE]`](#uschi-cli-spawn-service)
  - [`uschi-cli webserver [SERVICE]`](#uschi-cli-webserver-service)

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

## `uschi-cli spawn [SERVICE]`

Spawns a service

```
USAGE
  $ uschi-cli spawn [SERVICE] [-t hud|screensaver|video|exit]

FLAGS
  -t, --service=<option>  define timezone, default Europe/Berlin
                          <options: hud|screensaver|video|exit>

DESCRIPTION
  Spawns a service

EXAMPLES
  $ uschi spawn hud
```

_See code: [dist/commands/spawn/index.ts](https://github.com/falsanu/uschi/uschi-cli/blob/v0.0.0/dist/commands/spawn/index.ts)_

## `uschi-cli webserver [SERVICE]`

Starts a Webserver to control Uschi

```
USAGE
  $ uschi-cli webserver [SERVICE]

DESCRIPTION
  Starts a Webserver to control Uschi

EXAMPLES
  $ uschi spawn hud
```

_See code: [dist/commands/webserver/index.ts](https://github.com/falsanu/uschi/uschi-cli/blob/v0.0.0/dist/commands/webserver/index.ts)_
<!-- commandsstop -->
