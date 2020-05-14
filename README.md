# cleesy

Easily extendable command-line-interface composer.

## Installation

`$ npm i -s cleesy`

## Why

This tool will help you:

 - to list all the commands available with no effort at all.
 - to extend easily a command line interface:
    - by creating new folders and files, nothing else.
    - with custom help messages by a `help.txt` file, nothing else.

And it only takes about 100 lines of code and has no dependencies at all.

## Usage

### Run a command

Step by step, this is how you can create your own command line interface tool easily.

#### 1) Create commands tree:

For example:

```
/mycli/help.txt
/mycli/0.command-1/index.js
/mycli/1.command-2/index.js
/mycli/2.command-3/0.subcommand-1/index.js
/mycli/2.command-3/1.subcommand-2/index.js
/mycli/2.command-3/2.subcommand-3/index.js
```

**The `help.txt` is at the root folder.** This help will be shown every time a command is not found or fails.

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

### Use parameters

To use parameters inside your commands, you can:

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