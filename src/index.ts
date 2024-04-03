import { readFileSync } from "fs";

type token = `${string}`;

class Scanner {
    source: string;
    constructor(source: string) {
        this.source = source;
    }

    scanTokens() {
        return this.source.split(' ');
    }
}

function main(args: string[]) {
    if (args.length > 1) {
        process.stdout.write("Usage: jlox [script]");
        process.exit(64);
    }
    if (args.length == 1) {
        runFile(args[0]);
    }
    if (args.length == 0) {
        runPrompt();
    }
}

function runFile(path: string) {
    const source = readFileSync(path, { encoding: "utf-8" });
    run(source);
}

async function runPrompt() {
    while (1) {
        const prompt = '> '
        process.stdout.write(prompt);
        for await (const line of console) {
            if (!line) break;
            run(line);
        }
    }
}

function run(source: string) {
    const scanner = new Scanner(source);

    const tokens: token[] = scanner.scanTokens();
    tokens.forEach((token) => {
        process.stdout.write(token)
    })
}

main(process.argv.slice(2));