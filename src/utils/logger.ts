export namespace Logger {
    export function log(msg: string) {
        console.log(msg);
        this.api.channels.get(process.env.LOG).send();
    }
}
