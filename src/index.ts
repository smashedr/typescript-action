import * as core from '@actions/core'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GitHub } from './github.js'
import { Inputs } from './types.js'

async function main() {
    const version: string = process.env.GITHUB_ACTION_REF
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

    // Debug Path
    const __filename = fileURLToPath(import.meta.url)
    core.debug(`__filename: ${__filename}`)
    const __dirname = path.dirname(__filename)
    core.debug(`__dirname: ${__dirname}`)
    const src = path.resolve(__dirname, '../src')
    console.log(`src: ${src}`)

    // Inputs
    const inputs = {
        tag: core.getInput('tag'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token'),
    } as Inputs
    console.log(inputs)

    // Variables
    const sha = process.env.GITHUB_SHA ?? ''
    core.info(`Target SHA: \u001b[33;1m${sha}`)
    if (!sha) return core.setFailed('Unknown GITHUB_SHA')
    core.info(`Target Tag: \u001b[33;1m${inputs.tag}`)
    const api = new GitHub(inputs.token)

    // Processing
    core.startGroup(`Processing tag: "${inputs.tag}"`)
    let result: string
    const reference = await api.getRef(inputs.tag)
    // console.log('reference:', reference)
    if (reference) {
        core.info(`current sha: ${reference.object.sha}`)
        if (sha === reference.object.sha) {
            core.info(`\u001b[36mTag "${inputs.tag}" already points to: ${sha}`)
            result = 'Not Changed'
        } else {
            core.info(`\u001b[35mUpdating tag "${inputs.tag}" to: ${sha}`)
            await api.updateRef(inputs.tag, sha, true)
            result = 'Updated'
        }
    } else {
        core.info(`\u001b[33mCreating new tag "${inputs.tag}" to: ${sha}`)
        await api.createRef(inputs.tag, sha)
        result = 'Created'
    }
    core.endGroup() // Processing

    console.log('result:', result)

    // Summary
    if (inputs.summary) {
        core.info('📝 Writing Job Summary')
        try {
            await addSummary(inputs, result, sha)
        } catch (e) {
            console.log(e)
            if (e instanceof Error) core.error(`Error writing Job Summary ${e.message}`)
        }
    }

    // Outputs
    core.setOutput('sha', sha)

    core.info(`\u001b[32;1mFinished Success`)
}

async function addSummary(inputs: Inputs, result: string, sha: string) {
    core.summary.addRaw('## JavaScript Action\n')

    const url = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/releases/tag/${inputs.tag}`
    core.summary.addRaw(`${result}: [${inputs.tag}](${url}) :arrow_right: \`${sha}\`\n`)

    const cleanInputs = Object.fromEntries(
        Object.entries(inputs).filter(([key]) => key !== 'token')
    )
    const yaml = Object.entries(cleanInputs)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/smashedr/javascript-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

try {
    await main()
} catch (e) {
    console.log(e)
    if (e instanceof Error) core.setFailed(e.message)
}
