const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const server = express();
server.use(express.static(path.resolve(__dirname, './docs/.vuepress/dist')));

server.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './docs/.vuepress/dist/index.html'), 'utf-8');
    res.send(html)
});

server.listen(7777, res => {
    console.log(chalk.yellow('Start Service On 7777'));
});