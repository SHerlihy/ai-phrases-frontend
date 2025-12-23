import { PostMarkStory } from './QueryStoryModel'
import { catchError } from '@/lib/async'

interface IQueryStoryControl {
    postQuery: PostMarkStory
    abortQuery: (reason?: any) => void
}

class QueryStoryControl implements IQueryStoryControl {
    postUrl = ""
    controller = new AbortController()

    getParam: () => string;

    constructor(getParam: () => string) {
        this.getParam = getParam
    }

    async postQuery(story: string): Promise<[undefined, string] | [Error]> {
        const param = this.getParam()
        const params = new URLSearchParams();
        params.append("key", param)

        const response = await fetch(`${this.postUrl}?${params}`, {
            method: "POST",
            mode: "cors",
            signal: this.controller.signal,
            body: story
        })

        if (!response.ok) {
            return [new Error(`Query story status: ${response.status}`)]
        }

        const [error, marked] = await catchError(response.text())

        if (error) {
            return [error]
        }

        return [undefined, marked]
    }

    abortQuery(reason?: any) {
        this.controller.abort(reason)
    }
}

export default QueryStoryControl
