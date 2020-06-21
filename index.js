module.exports = (options = {}) => {
  const defaultOptions = { argv: process.argv.slice(2), enforceCamelCase: true };
  const { argv, enforceCamelCase } = Object.assign(defaultOptions, options);

  const firstFlag = argv.findIndex((arg) => arg.startsWith("-"));
  const args = firstFlag >= 0 ? argv.slice(firstFlag) : [];
  const opts = {};

  let i = 0;
  while (i < args.length) {
    // Initialize keyname as whatever is to the
    // right of "-" or "--"
    // >> --app-name > "app-name"
    let key = args[i].slice(args[i].startsWith("--") ? 2 : 1, args[i].length);

    // Determine location of next flag
    const remainingArgs = args.slice(i + 1);
    const nextFlagIndex = remainingArgs.findIndex((a) => a.startsWith("-"));

    let val;

    // If keyname contains =, set k/v pair to left and right vals
    // >> --app-name=example-app > key: app-name, val: example-app
    if (key.includes("=")) {
      [key, val] = key.split("=");
    } else {
      // Args Between current and next flag
      const argsVals = nextFlagIndex >= 0 ? remainingArgs.slice(0, nextFlagIndex) : remainingArgs;

      switch (argsVals.length) {
        // If no flags between, set flag val to true
        // >> --run-as-admin >> key: run-as-admin, val: true
        case 0:
          val = true;
          break;
        // If only one item between, set flag val to string val
        // >> --app-name example-app > key: app-name, val: example-app
        case 1:
          val = argsVals[0];
          break;
        // If multiple flags between, set flag val to array of items
        // >> --fields firstName lastName > key: fields val: ["firstName", "lastName"]
        default:
          val = argsVals;
      }
    }

    // In options obj, replace dashes w/ camel case equivalent
    // >> --app-name example-app > key: appName, val: "example-app"
    opts[enforceCamelCase ? key.replace(/-([a-z])/g, (x) => x[1].toUpperCase()) : key] = val;
    if (nextFlagIndex === -1) break;
    i = i + 1 + nextFlagIndex;
  }

  return opts;
};
