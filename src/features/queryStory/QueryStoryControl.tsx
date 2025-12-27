type QueryResponse = Response

interface IQueryStoryControl {
    postQuery: (story: string) => Promise<[undefined, QueryResponse] | [Error]>
    demarshall: (res: QueryResponse) => Promise<string>
    abortQuery: (reason?: any) => void
}

class QueryStoryControl implements IQueryStoryControl {
    controller = new AbortController()

    postUrl: string;
    getParam: () => string;

    constructor(postUrl: string, getParam: () => string) {
        this.postUrl = postUrl
        this.getParam = getParam
    }

    async postQuery(story: string): Promise<[undefined, QueryResponse] | [Error]> {
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

        return [undefined, response]
    }

    async demarshall(queryRes: QueryResponse) {
        return await queryRes.text()
    }

    abortQuery(reason?: any) {
        this.controller.abort(reason)
    }
}

export default QueryStoryControl
