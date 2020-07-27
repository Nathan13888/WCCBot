export namespace Utils {
    export function getRandCode(): string {
        let code: string = ""; const LETTERS = "ABCDE";
        code += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        code += Math.floor(Math.random() * 100) + 1;
        return code;
    }
}