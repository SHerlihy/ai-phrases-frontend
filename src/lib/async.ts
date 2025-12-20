export async function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
    return promise
        .then(data => {
            return [undefined, data] as [undefined, T]
        })
        .catch(error => {
            return [error]
        })
}

export function allSettledToCatchError<T>(settled: PromiseSettledResult<[Error] | [undefined, T]>[]): Array<[undefined, T] | [Error]> {
    return settled.map((settledRes) => {
        if (settledRes.status === "rejected") {
            return [new Error(settledRes.reason.message)]
        }

        return settledRes.value
    })
}

export async function handleGET<TRes = any>(uri: string, abortSignal?: AbortSignal): Promise<[undefined, TRes] | [Error]> {
    const [error, response] = await catchError(fetch(uri, { signal: abortSignal }))

    if (error !== undefined) {
        console.error(error.message)
        return [error]
    }

    return [error, await response.json()]
}


type Resolve = (value: string) => void
type Reject = (value: Error) => void
type WithResolversRet = {
    promise: Promise<unknown>;
    resolve: Resolve;
    reject: Reject;
}

export function withResolvers(): WithResolversRet {
    let resolve: Resolve;
    let reject: Reject;

    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })

    // @ts-ignore
    if (!resolve || !reject) {
        throw new Error("from withResolvers")
    }

    return { promise, resolve, reject }
}

