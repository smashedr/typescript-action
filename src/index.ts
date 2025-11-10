import * as core from '@actions/core'
import * as github from '@actions/github'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { wait } from './wait.js'

async function main() {
    const version = process.env.GITHUB_ACTION_REF
        ? `\u001b[35;1m${process.env.GITHUB_ACTION_REF}`
        : '\u001b[33;1mSource'
    core.info(`🏳️ Starting Test Action - ${version}`)

    // // Debug
    // core.startGroup('Debug: github.context')
    // console.log(github.context)
    // core.endGroup() // Debug github.context
    // core.startGroup('Debug: process.env')
    // console.log(process.env)
    // core.endGroup() // Debug process.env

    // Inputs
    const ms: string = core.getInput('milliseconds', { required: true })
    core.info(`ms: ${ms}`)

    // Path
    const __filename = fileURLToPath(import.meta.url)
    core.debug(`__filename: ${__filename}`)
    const __dirname = path.dirname(__filename)
    core.debug(`__dirname: ${__dirname}`)
    const src = path.resolve(__dirname, '../src')
    console.log(`src: ${src}`)

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
}

try {
    await main()
} catch (e) {
    console.log(e)
    if (e instanceof Error) core.setFailed(e.message)
}
