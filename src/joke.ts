import { Logger } from '@nestjs/common'
import axios from 'axios'
import chalk = require('chalk')

/**
 * Content of a joke
 */
type Joke = {
    type: string
    setup: string
    delivery: string
    joke: string
}

let jokesCounter = 1

let jokesUrl = 'https://v2.jokeapi.dev/joke/Any'
let jokesNumber = 3
let jokesDelay = 2

/**
 * Displaying a joke on the screen.
 *
 * @remarks
 * This method is used in a lot of functions
 *
 * @param joke - Joke
 * @param counter - Serial number of this joke
 */
function ShowJoke(joke: Joke, counter: number = jokesCounter): void {
    let _logger = new Logger()

    if (counter) {
        _logger.verbose(chalk.blue(counter))
    }

    if (joke.type === 'twopart') {
        console.log(chalk.red(joke.setup))
        console.log(chalk.blue(joke.delivery))
    } else {
        console.log(chalk.green(joke.joke))
    }
    console.log('--------------  ахахахаха ---------------')
}

/**
 * Request for a joke using Promise
 *
 * @remarks
 * Use function {@link ShowJoke} to show joke
 */
function getJokePromise(): void {
    axios
        .get(jokesUrl)
        .then((response) => {
            ShowJoke(response.data)

            if (jokesCounter++ < jokesNumber) {
                setTimeout(getJokePromise, jokesDelay * 1000)
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

/**
 * Request for a joke using Async - await
 *
 * @remarks
 * Use function {@link ShowJoke} to show joke
 */
async function getJokeAsync() {
    try {
        const response = await axios.get(jokesUrl)

        ShowJoke(response.data)

        if (jokesCounter++ < jokesNumber) {
            setTimeout(getJokeAsync, jokesDelay * 1000)
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * Tunes and runs functions for requests for a jokes
 *
 * @remarks
 * Use function {@link getJokeAsync} or {@link getJokePromise} for requests
 *
 * @param url - Object
 * @param j_num - Number of jokes
 * @param delay - Delay between jokes (seconds)
 * @param isAsyncAwait - What function use for requests
 */
function RunJokes(
    url: string | undefined = jokesUrl,
    j_num: number = jokesNumber,
    delay: number = jokesDelay,
    isAsyncAwait = false,
) {
    if (url) {
        jokesUrl = url
    }
    if (j_num) {
        jokesNumber = j_num
    }
    if (delay !== null) {
        jokesDelay = delay
    }

    if (isAsyncAwait) {
        getJokeAsync()
    } else {
        getJokePromise()
    }
}

export default { ShowJoke, RunJokes }
