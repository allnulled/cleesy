const fs = require("fs");
const path = require("path");

class Cleesy {

	static create(...args) {
		return new this(...args);
	}

	static get DEFAULT_OPTIONS() {
		return { cache: false };
	}

	constructor(directory, options = {}) {
		this.directory = path.resolve(directory);
		Object.assign(this, this.constructor.DEFAULT_OPTIONS, options);
	}

	list(directory = this.directory, filelist = []) {
		const rootDir = this.directory
		const files = fs.readdirSync(directory);
		files.forEach((file) => {
			const filepath = directory + "/" + file;
			if (fs.statSync(filepath).isDirectory()) {
				filelist = this.list(filepath, filelist, directory);
			} else if (file === "index.js") {
				const fullPath = directory + "/" + file;
				const relativePath = fullPath
					.replace(rootDir ? rootDir : this.directory, "")
					.replace(/^\//g, "")
					.split(/\//g)
					.map(s => s.replace(/^[0-9]+\./g, ""))
					.join(" ")
					.replace(/index.js$/g, "")
					.trim();
				const indexFile = fs.readFileSync(fullPath).toString();
				const helpFile = fullPath.replace(/index\.js$/g, "") + "/help.txt";
				filelist.push({
					name: relativePath,
					help: fs.existsSync(helpFile) ? fs.readFileSync(helpFile).toString() : false
				});
			}
		});
		return filelist;
	}

	help(command = undefined) {
		if (typeof command === "undefined") {
			console.log("[Commands]");
			const commands = this.list();
			commands.forEach(function(command) {
				console.log("  ~$ " + command.name);
			});
			this.generalHelp();
			commands.forEach(function(command) {
				if(command.help) {
					console.log("\n[Help for: " + command.name + "]");
					console.log(command.help);
				}
			});
		} else {
			const helpFile = this.getFolderFromCommand(command) + "/help.txt";
			if(!fs.existsSync(helpFile)) {
				this.help();
				console.log("No help file found for command <" + command + ">");
			} else {
				console.log("\n[Help for: " + command + "]");
				console.log(fs.readFileSync(helpFile).toString());
			}
		}
	}

	generalHelp(orSomething = false) {
		const helpFile = path.resolve(this.directory, "help.txt");
		if(fs.existsSync(helpFile)) {
			console.log("\n[General help]");
			console.log(fs.readFileSync(helpFile).toString());
		}
	}

	getFolderFromCommand(command) {
		const commandPartsTmp = command.replace(/ *--.*/g, "").split(/ +/g);
		const commandParts = [];
		FindCommand:
		for(let level=0; level < commandPartsTmp.length; level++) {
			const commandPart = commandPartsTmp[level];
			const directory = path.resolve(this.directory, ...commandParts);
			const subdirectories = fs.readdirSync(directory);
			let wasFound = false;
			FindInSubdirectories:
			for(let index=0; index < subdirectories.length; index++) {
				const subdirectory = subdirectories[index];
				if(subdirectory.replace(/^[0-9]+\./g, "") === commandPart) {
					commandParts.push(subdirectory);
					wasFound = true;
					break FindInSubdirectories;
				}
			}
			if(!wasFound) {
				this.generalHelp();
				return console.log("\n[ERROR] Command <" + command + "> was not found.");
			}
		}
		const commandFound = path.resolve(this.directory, commandParts.join("/"));
		return commandFound;
	}

	execute(command = process.argv.splice(1).join(" "), ...args) {
		let commandPath = this.getFolderFromCommand(command);
		if(typeof commandPath === "undefined") {
			return;
		}
		commandPath += "/index.js";
		if (!fs.existsSync(commandPath)) {
			this.help();
			return console.log("[ERROR] Command <" + command + "> not found.");
		}
		try {
			const cache = this.cache || command.match(/ --cleesy-cache ?|( --cleesy-cache)$/g)
			if(!cache) {
				delete require.cache[commandPath];
			}
			const output = require(commandPath);
			if(typeof output === "function") {
				return output(command, ...args);
			}
		} catch (error) {
			return console.log("[ERROR]", error);
		}
	}

}

module.exports = Cleesy;