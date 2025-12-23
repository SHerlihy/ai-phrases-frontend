interface IParamStore {
    setParam: (k: string, v: string) => void
    getParam: (k: string) => string
}

class ParamStore implements IParamStore {
    store: Record<string,string> = {};
    constructor() {}

    setParam = (key: string, value: string) => {
        this.store[key] = value
    }
    getParam = (key: string) => {
        return this.store[key]
    }
}

export default ParamStore
