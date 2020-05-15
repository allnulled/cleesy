# cleesy

Easily extendable command-line-interface composer.

## Installation

`$ npm i -D cleesy`

## Why?

This tool will help you:

 - to list all the commands available with no effort at all.
 - to extend easily a command line interface:
    - by creating new folders and files, nothing else.
    - with custom help messages by a `help.txt` file, nothing else.

And it only takes around 130 lines of code and has no dependencies at all.

## Usage

### Run a command

Step by step, this is how you can create your own command line interface tool easily.

#### 1) Create commands tree:

For example:

```
/mycli/help.txt
/mycli/0.command-1/index.js
/mycli/0.command-1/help.txt
/mycli/1.command-2/index.js
/mycli/1.command-2/help.txt
/mycli/2.command-3/0.subcommand-1/index.js
/mycli/2.command-3/0.subcommand-1/help.txt
/mycli/2.command-3/1.subcommand-2/index.js
/mycli/2.command-3/1.subcommand-2/help.txt
/mycli/2.command-3/2.subcommand-3/index.js
/mycli/2.command-3/2.subcommand-3/help.txt
```

**The `help.txt` is at the root folder.** This help will be shown every time a command is not found or fails.

**The other `help.txt` files are the specific help of each command.** This help will be shown every time a command is not found or fails.

All the `help.txt` files are optional. Except the general help, the others must have an `index.js` file beside.

**The `index.js` files indicate a command.** The parent folders, until the root folder, indicate the combination of names that the command requires to be executed.

The numbers in the begining of every folder are only to indicate the order of the commands shown by the help of the tool.

You can nest command folders as much as you want.

#### 2) Run cleesy:

For example:

```js
const mycli = require("cleesy").create("./mycli");
mycli.execute("command-1");
mycli.execute("command-2");
mycli.execute("command-3 subcommand-1");
mycli.execute("command-3 subcommand-2");
mycli.execute("command-3 subcommand-3");
```

Each of these `execute` lines will run (`require`) a different command of the tree. So, done.

Alternatively, call `execute` without arguments to pick them from `process.argv` directly, like so:

```js
mycli.execute();
```

The `execute` method will ignore all the string that is after a `--`. This allows you to pass parameters from the same command execution.

### Use parameters

To use parameters inside your commands, you can:

  - export a sync or async function which:
    - will receive the arguments passed to `execute` method
  - pick them directly from `process.argv`, to fully customize how your tool handles parameters.
  - use other tools, like:
    - [`yargs`](https://github.com/yargs/yargs) to parse standard parameters.
    - [`clitoris`](https://github.com/allnulled/clitoris) to parse complex parameters.

To use [`clitoris`](https://github.com/allnulled/clitoris) in combination, you can, inside of your specific command:

```js
const commandDeepness = 1; // number of nested commands from the root folder, by default 0
const data = require("clitoris").Clitoris.parse(process.argv.slice(1 + commandDeepness).join(" "));
```

Got it! Complex, nested parametrization (nested arrays, objects, etc.) in any of your commands, with 1 line.

## Advanced options

To repeat commands in the same execution, `cleesy` deletes the cache of `require` by default.

This behaviour can be altered from the `cleesy` instantiation as follows:

```js
const mycli = require("cleesy").create("./mycli", { cache: true });
```

Or overriden by a specific command, so:

```js
mycli.execute("mycommand --cleesy-cache");
```

This can be useful when you export objects by your command line interface, and you want to keep the same reference along a wider execution.

## Functional commands

When a command exports a function, that function is called with the command provided, as a pure string, for you to handle it at your own convenience.

## License

This project is licensed under [WTFPL or What The Fuck Public License](https://es.wikipedia.org/wiki/WTFPL), which means, simply: **do what you want with it**.

## Issues

Address your issues [here](https://github.com/allnulled/cleesy/issues).
