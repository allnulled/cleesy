const fs = require("fs");
const path = require("path");

class Cleesy {

	static create(...args) {
		return new this(...args);
	}

	constructor(directory) {
		this.directory = path.resolve(directory)
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
			const helpFile = path.resolve(this.directory, "help.txt");
			if(fs.existsSync(helpFile)) {
				console.log("\n[General help]");
				console.log(fs.readFileSync(helpFile).toString());
			}
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

	getFolderFromCommand(command) {
		return command.replace(/ --.*/g, "").join("/");
	}

	execute(command = process.argv.splice(1).join(" ")) {
		const commandPath = this.getFolderFromCommand(command) + "/index.js";
		if (!fs.existsSync(command)) {
			this.help();
			return console.log("[ERROR] Command <" + command + "> not found.");
		}
		try {
			return require(commandPath);
		} catch (error) {
			return console.log("[ERROR]", error);
		}
	}

}

module.exports = Cleesy;