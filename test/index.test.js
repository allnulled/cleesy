const Cleesy = require(__dirname + "/../index.js");
const One = Cleesy.create(__dirname + "/one");
One.help();
console.log();
console.log();
console.log();
One.execute("db create");
One.execute("db create");
One.execute("db update");
One.execute("db create --name x --surname y");