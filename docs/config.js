const config =  {
    info: {
        version: "1.0.0",
        description: "快捷音乐分享",
        author: "SXFreell^Shirosu"
    },
    data: {
        servers: [
            {
                enable: true,
                url: "music.json"
            },
            {
                enable: true,
                url: "https://m.freell.top/music.json"
            }
        ]
    }
}

localStorage.setItem("config", JSON.stringify(config))