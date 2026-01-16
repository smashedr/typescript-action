import * as github from '@actions/github'
import { RequestError } from '@octokit/request-error'
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types.js'

type Octokit = ReturnType<typeof github.getOctokit>

export type RefData = RestEndpointMethodTypes['git']['getRef']['response']['data']

export class GitHub {
    private readonly repo: { owner: string; repo: string }
    private readonly octokit: Octokit

    constructor(token: string) {
        this.repo = github.context.repo
        this.octokit = github.getOctokit(token)
    }

    async getRef(tag: string): Promise<RefData | undefined> {
        console.log(`getRef: tags/${tag}`)
        try {
            const result = await this.octokit.rest.git.getRef({
                ...this.repo,
                ref: `tags/${tag}`,
            })
            return result.data
        } catch (e) {
            if (e instanceof RequestError) {
                if (e.status === 404) {
                    return
                }
                throw new Error(e.message)
            }
            throw new Error('Unknown Error Getting Ref')
        }
    }

    async createRef(tag: string, sha: string) {
        console.log(`createRef: refs/tags/${tag}`, sha)
        return this.octokit.rest.git.createRef({
            ...this.repo,
            ref: `refs/tags/${tag}`,
            sha,
        })
    }

    async updateRef(tag: string, sha: string, force = false) {
        console.log(`updateRef: tags/${tag}`, sha, force)
        return this.octokit.rest.git.updateRef({
            ...this.repo,
            ref: `tags/${tag}`,
            sha,
            force,
        })
    }
}
