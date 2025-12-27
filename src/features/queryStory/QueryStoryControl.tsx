type QueryResponse = Response

interface IQueryStoryControl {
    postQuery: (story: string) => Promise<QueryResponse>
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

    postQuery = async (story: string): Promise<QueryResponse> => {

        this.controller = new AbortController()

        const param = this.getParam()
        const params = new URLSearchParams();
        params.append("key", param)

        const response = await this.markStoryRequest(story, params)

        if (response.status !== 200) {
            throw Error(`Query story status: ${response.status}`)
        }

        return response
    }

    demarshall = async (queryRes: QueryResponse) => {
        return await queryRes.text()
    }

    abortQuery = (reason?: any) => {
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

        await Promise.race([
            new Promise(resolve => setTimeout(resolve, 2000)),
            new Promise((_, reject) =>
                this.controller.signal.onabort = () => {
                    reject(new Error("Upload aborted"))
                }
            ),
        ])

        const failOpts = {
            status: 400,
            statusText: "Error"
        }

        const successOpts = {
            status: 200,
            satusText: "Upload complete"
        }

        const failResponse = new Response("Query failed", failOpts)

        const successResponse = new Response("marked story", successOpts)

        const rnd = Math.random()

        if (rnd > 0.5) {
            return failResponse
        }

        return successResponse
    }
}

export default QueryStoryControl
