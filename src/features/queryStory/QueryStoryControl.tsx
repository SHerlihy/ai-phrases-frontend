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


        const response = await this.markStoryRequest(story, params)

        if (response.status !== 200) {
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

    markStoryRequest = async (story: string, params: URLSearchParams) => {
        if (import.meta.env.DEV) {
            return await this.markStoryRequestDev()
        }

        return await this.markStoryRequestProd(story, params)
    }


    markStoryRequestProd = async (story: string, params: URLSearchParams) => {

        return await fetch(`${this.postUrl}?${params}`, {
            method: "POST",
            mode: "cors",
            signal: this.controller.signal,
            body: story
        })
    }

    markStoryRequestDev = async (): Promise<Response> => {

        await new Promise(r => setTimeout(r, 2000));

        const failOpts = {
            status: 400,
            statusText: "Error"
        }

        const successOpts = {
            status: 200,
            satusText: "Upload complete"
        }

        const failResponse = new Response("", failOpts)

        const successResponse = new Response("marked story", successOpts)

        const rnd = Math.random()

        if (rnd > 0.5) {
            return failResponse
        }

        return successResponse
    }
}

export default QueryStoryControl
