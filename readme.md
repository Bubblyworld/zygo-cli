# Zygo CLI

A simple wrapper around the [zygo server](https://github.com/Bubblyworld/zygo-server) API.

## Installation
`npm install zygo-cli -g`

## Usage
`zygo-cli [options] zygo.json`

Options can be any of:
- `--serve/-s`  
Spin up a server instance for the given zygo app. To override the port specified in `zygo.json`, use `--port/-p`.

- `--bundle/-b`  
Manually bundle the given zygo app. To override the build directory specified in `zygo.json`, use `--dir/-d`.

- `--setmode/-m`  
Set the application environment. Accepts one of two parameters: `dev[elopment]` or `prod[uction]`.
