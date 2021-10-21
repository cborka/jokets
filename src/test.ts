import axios from 'axios'
import now = require('performance-now')
import request from 'sync-request'

import joke from './joke'

let endTime = 0
let beginTime = 0
const jokesUrl = 'https://v2.jokeapi.dev/joke/Any'

/**
 * Returns an array of requests to the joke site.
 *
 * @remarks
 * This method is called from within a function {@link RunAsyncTest | Parsing test}.
 *
 * @param num - Array size
 * @returns The array of promises
 *
 */
function getPromiseArray(num = 5): any[] {
    const promiseArray = []

    for (let i = 0; i < num; i++) {
        promiseArray.push(axios.get(jokesUrl))
    }

    return promiseArray
}

/**
 * Parsing N number of jokes asynchronously (using Promise.all ()).
 *
 * @remarks
 * This method use a function {@link getPromiseArray | Forming an array of requests}.
 *
 * @param num - Number of requests
 */
function RunAsyncTest(num = 3): void {
    beginTime = now()

    Promise.all(getPromiseArray(num))
        .then((responses) =>
            responses.forEach((response) => joke.ShowJoke(response.data, 0)),
        )
        .then(() => {
            endTime = now()
            console.log(
                `Call to AsyncTest took ${ 
                    (endTime - beginTime).toFixed(3) 
                    } milliseconds.`,
            )
        })
        .catch(() => Error('Call to AsyncTest fail'))
}

/**
 * Parsing N number of jokes synchronously (using sync-request library).
 *
 * @param num - Number of requests
 */
function RunSyncTest(num = 5): void {
    beginTime = now()

    for (let i = 1; i <= num; i++) {
        const res: any = request('GET', jokesUrl)
        const data = JSON.parse(res.getBody())

        joke.ShowJoke(data, i)
    }

    endTime = now()
    console.log(
        `Call to SyncTest took ${ 
            (endTime - beginTime).toFixed(3) 
            } milliseconds.`,
    )
}

const test: { as: (num: number) => void; sy: (num: number) => void } = {
    as: RunAsyncTest,
    sy: RunSyncTest,
}
export default { test }
