#!/usr/bin/env node

/**
 * Commander for launch and testing requests for joke resource
 *
 * @see README.md for details
 *
 * @packageDocumentation
 */
import chalk = require('chalk')
import commander = require('commander')
import inquirer = require('inquirer')

import joke from './joke'
import test from './test'

commander.version('1.0.0').description('Jokes reader and tester')

commander
    .command('run')
    .option('-n, --num <jokesnum>', 'Number of jokes')
    .option('-d, --delay <delay>', 'Delay between messages (seconds)')
    .option('-a, --asyncawait', 'Promise or AsyncAwait (default: promise)')
    .option('-p, --prompt', 'Prompt for category')
    .description('Run jokes logging')
    .action((options) => {
        if (!options.prompt) {
            joke.RunJokes(
                undefined,
                options.num,
                options.delay,
                options.asyncawait,
            )
        } else {
            const categorys: string[] = [
                'Programming',
                'Miscellaneous',
                'Dark',
                'Pun',
                'Spooky',
                'Christmas',
            ]

            console.log('what kind of jokes do you foresee?')
            console.log('Enter the number and press the enter key')

            for (let i = 1; i <= categorys.length; i++) {
                console.log(`${i  } - ${  categorys[i - 1]}`)
            }

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'category',
                        message: 'Enter number: ',
                    },
                ])
                .then((inputs: { category?: number }) => {
                    let url
                    if (
                        inputs.category &&
                        inputs.category > 0 &&
                        inputs.category <= categorys.length
                    ) {
                        url =
                            `https://v2.jokeapi.dev/joke/${ 
                            categorys[inputs.category - 1]}`
                        console.log(
                            `Ok, you like jokes about  ${ 
                                categorys[inputs.category - 1]}`,
                        )
                    }
                    joke.RunJokes(
                        url,
                        options.num,
                        options.delay,
                        options.asyncawait,
                    )
                })
        }
    })

commander
    .command('test')
    .option('-n, --num <jokesnum>', 'Number of jokes')
    .option('-a, --async', 'Is async test (default: sync')
    .description('Speed test')
    .action((options) => {
        if (options.async) {
            console.log(chalk.blue(`test.test.as${  options.num}`))
            test.test.as(options.num)
        } else {
            test.test.sy(options.num)
        }
    })

commander.command('hi').action(() => {
    inquirer
        .prompt([
            {
                type: 'string',
                name: 'name',
                default: 'Yorick',
                message: 'Who are you? : ',
            },
        ])
        .then((my: { name?: string }): void => {
            console.log(chalk.blue(`Ну привет, ${  my.name}`))
        })
})

commander.parse(process.argv)
