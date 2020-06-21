# Dashcon

A different way to handle NodeJS arguments

Dashcon converts dash option arguments (`-` & `--`) to a usable JavaScript object. Zero configuration required. Arguments containing an `=` are seperated into key/value pairs using this: `--[key]=[val]` or this: `-[key]=[val]` format.

For example, the arguments `--user=John --email=john@email.com` would result in a JavaScript object containing the following:

```js
{
    user: 'John',
    email: 'john@email.com'
}
```

Alternatively, **if the option does not contain an `=`**, the argument passed after the option is set to the option's value.

For example, the arguments `--user John --email john@email.com` would result in a JavaScript object containing the following:

```js
{
    user: 'John',
    email: 'john@email.com'
}
```

If multiple arguments are passed between options, the key of the prior option will be set to an array of the arguments between itself and the next option.

For example, the arguments `--fields firstName lastName email --id abc123` would result in a JavaScript object containing the following:

```js
{
    fields: ['firstName', 'lastName', 'email'],
    id: 'abc123'
}
```

If no arguments exist between two options, the resulting option's value will default to `true`.

For example, the options `--isAdmin --id abc123` would result in a JavaScript object containing the following:

```js
{
    isAdmin: true,
    id: 'abc123'
}
```

#### Camel Case Conversion

Dashcon will also convert all dash seperated option keys to camelCase, although this can be overrode in the additional options parameter.

For example, the arguments `--app-name "Hello World"` would result in a JavaScript object containing the following:

```js
{
    appName: 'Hello World',
}
```

##### Usage

Dashcon returns a function that when called will parse the `process.argv` options and return a JavaScript object containing the options and their values

##### Example

###### JavaScript

```js
const args = require("dashcon")(); // <-- Immediately invoked

switch (args.operation.toLowerCase()) {
  case "add":
    console.log(`${args.x} + ${args.y} = ${parseInt(args.x) + parseInt(args.y)}`);
    break;
  case "subtract":
    console.log(`${args.x} - ${args.y} = ${parseInt(args.x) - parseInt(args.y)}`);
    break;
  case "multiply":
    console.log(`${args.x} * ${args.y} = ${parseInt(args.x) * parseInt(args.y)}`);
    break;
  case "divide":
    console.log(`${args.x} / ${args.y} = ${parseInt(args.x) / parseInt(args.y)}`);
    break;
  default:
    console.error('Bad operation. Please use "add", "subtract", "multiply", or "divide"');
}
```

###### CLI

_Note: The `-` and `--` option prefixes can be used interchangibly without changing the result._

```
node example.js -x=6 -y=10 --operation=add
6 + 10 = 16
```

##### Example 2

###### JavaScript

```js
const args = require("dashcon")(); // <-- Immediately invoked

console.log(`Hi ${args.firstName} ${args.lastName}!`);
```

###### CLI

_Note: Spaces can be used in lieu of `=`. All kebab-case options are converted to their camelCase equivalent (first-name becomes firstName)_

```
node example.js --first-name Justin --last-name Kunz
Hi Justin Kunz!
```

### Multi Argument Options & Flags

When multiple arguments are present after a `-` or `--` option, the value for that option will be an array of the arguments.

Alternatively, if no arguments are present after a `-` or `--` option, the value for that option will be set to `true`.

#### Example

###### JavaScript

```js
const args = require("dashcon")(); // <-- Immediately invoked

// Print args
console.log("args", args);

const users = [
  {
    id: "abc123",
    firstName: "John",
    lastName: "Smith",
    city: "Denver",
    state: "CO",
    email: "john.smith@example.com",
    isAdmin: false,
  },
  {
    id: "def456",
    firstName: "Jane",
    lastName: "Doe",
    city: "Colorado Springs",
    state: "CO",
    email: "Jane.doe@example.com",
    isAdmin: true,
  },
  {
    id: "hij789",
    firstName: "Joe",
    lastName: "Frank",
    city: "Denver",
    state: "CO",
    email: "joe.frank@example.com",
    isAdmin: true,
  },
];

// Set userbase to search to include all users if includeAdmins flag provided
const userbase = args.includeAdmins ? users : users.filter((user) => !user.isAdmin);

// Get user object based off "id" option supplied by user
const searchedUser = userbase.find((user) => user.id === args.id);

// Print out the values of the user that were passed in as options
// If only one argument is provided, result will come back as a string
// So it must be converted to an array before iterating
for (queryKey of Array.isArray(args.query) ? args.query : [args.query]) {
  console.log(`${queryKey} is ${searchedUser[queryKey]}`);
}
```

###### CLI

```
node example.js --query city state email --id def456 --includeAdmins
args {
  query: [ 'city', 'state', 'email' ],
  id: 'def456',
  includeAdmins: true
}
city is Colorado Springs
state is CO
email is Jane.doe@example.com
```

### Additional Options

Optionally, an options argument can be passed to Dashcon. The available options include

- enforceCamelCase - _Boolean_, **defaults to true**, Determines whether Dashcon converts khabab-case options to camalCase
- argv - _Array_, **defaults to process.argv.slice(2)**, Array of options and values to convert to args object

##### enforceCamelCase Example

```js
const args = require("dashcon")({ enforceCamelCase: false });

// Assuming file is called with
// node file.js --app-name "Hello World"
console.log(args.appName); // Expected: undefined
console.log(args["app-name"]); // Expected: "Hello World"
```

##### customArgv Example

Optionally, you can pass a custom array to Dashcon to be used in place of the `process.argv` arguments.

```js
const dashcon = require("dashcon");
const args = dashcon({ argv: ["--name", "Justin", "-x", "4"] });

console.log(args.name); // Expected: Justin
```
