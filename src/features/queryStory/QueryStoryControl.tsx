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
        params.append("authKey", param)

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
        return await this.markStoryRequestProd(story, params)
    }


    markStoryRequestProd = async (story: string, params: URLSearchParams) => {

        return await fetch(`${this.postUrl}?${params}`, {
            method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            mode: "cors",
            signal: this.controller.signal,
            body: story
        })
    }
}

export default QueryStoryControl
