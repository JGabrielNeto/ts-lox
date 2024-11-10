import { readFileSync } from "fs";
import { Scanner } from "./scanner";
import { Token, token } from "./tokenType";


let hadError = false;

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
    if (hadError) process.exit(65);
}

function runFile(path: string) {
    const source = readFileSync(path, { encoding: "utf-8" });
    run(source);
}

async function runPrompt() {
    const prompt = '\n> ';
    process.stdout.write(prompt);
    for await (const line of console) {
        run(line);
        hadError = false;
        process.stdout.write(prompt);
    }
}

function run(source: string) {
    const scanner = new Scanner(source);

    const tokens: Token[] = scanner.scanTokens();
    tokens.forEach((token) => {
        console.log(`line ${token.line}: ${token.toString()}`);
    });
}

export function loxError(line: number, message: string) {
    report(line, "", message);
}

function report(line: number, where: string, message: string) {
    process.stderr.write(`[line ${line}] ERROR ${where}: ${message}`);
    hadError = true;
}

main(process.argv.slice(2));