import * as core from '@actions/core'
import * as github from '@actions/github'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { wait } from './wait.js'

// main
;(async () => {
    try {
        // console.log('github.context:', github.context)
        // console.log('process.env:', process.env)

        const __filename = fileURLToPath(import.meta.url)
        core.debug(`__filename: ${__filename}`)
        const __dirname = path.dirname(__filename)
        core.debug(`__dirname: ${__dirname}`)
        const src = path.resolve(__dirname, '../src')
        console.log(`src: ${src}`)

        const ms: string = core.getInput('milliseconds', { required: true })
        core.info(`ms: ${ms}`)

        // Example GitHub Context
        const { owner, repo } = github.context.repo
        console.log('owner:', owner)
        console.log('repo:', repo)

        // Log the current timestamp, wait, then log the new timestamp
        core.info(new Date().toTimeString())
        const result: string = await wait(parseInt(ms, 10))
        console.log('result:', result)

        // Set outputs for other workflow steps to use
        core.setOutput('time', result)

        core.info(`\u001b[32;1mFinished Success`)
    } catch (e) {
        console.log(e)
        if (e instanceof Error) core.setFailed(e.message)
        // const msg = e instanceof Error ? e.message : String(e)
        // core.info(msg)
        // core.setFailed(msg)
    }
})()
