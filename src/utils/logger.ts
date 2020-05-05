
export namespace Logger {
    export async function log(msg: string) {
        console.log(msg);
        // TODO: fix this, its broken for whatever reason
        // let channel = Bot.api.channels.cache.get(process.env.LOG);
        // if(channel.type == "text")
            // channel.send(msg);
    }
}
