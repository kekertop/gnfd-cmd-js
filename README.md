# Greenfield CLI

## Installation
```shell
npm install -g @kekertop/greenfield-js-cmd
```

## Setting up a config
Run this command to begin configuration
```shell
gnfd-cmd config configure
```
After, your dynamic config will be saved into config.json file

## Get commands' list
Run this line to get all the available commands
```shell
gnfd-cmd --help
```

## Get commands' inside of a module
For example, getting commands available for manipulation with buckets look like this:
```shell
gnfd-cmd bucket
```

## Further usage
For example, getting a buckets' list of a user would look like this:
```shell
gnfd-cmd bucket list
```




