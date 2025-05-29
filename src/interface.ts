export interface GlobalConfig {
    info: {
        version: string,
        description: string,
        author: string
    },
    data: {
        servers: Server[]
    }
}

export interface Server {
    enable: boolean,
    url: string
}

export interface Music {
    id: string,
    name: string,
    qm?: string,
    ne?: string,
    kg?: string,
    qs?: string,
    am?: string,
    img: {
        type: ImgType,
        data: string,
    }
}

export type ImgType = "url" | "base64" | "qm" | "kw" | "ne" | "qm";