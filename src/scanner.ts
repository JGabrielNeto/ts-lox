import { loxError } from ".";
import { Token, keywords, literal, tokenType } from "./tokenType";

export class Scanner {
  source: string;
  tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private addToken(type: tokenType, literal: literal = ""): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  // this method only consumes the token if the next is the one we expected
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;
    this.current += 1;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  private string(): void {
    // console.log('Checking char: ', this.peek(), 'is at EOF? ', this.isAtEnd())
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      loxError(this.line, "Unterminated string.\n");
      return;
    }

    this.advance();

    const value: string = this.source.substring(
      this.start + 1,
      this.current - 1,
    );
    this.addToken(tokenType.STRING, value);
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private number(): void {
    while (this.isDigit(this.peek())) this.advance();
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      tokenType.NUMBER,
      Number(this.source.substring(this.start, this.current)),
    );
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text: string = this.source.substring(this.start, this.current);
    let type: tokenType = keywords[text];
    if (typeof type == "undefined") type = tokenType.INDENTIFIER;
    this.addToken(type);
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(tokenType.EOF, "", "", this.line));
    return this.tokens;
  }

  scanToken() {
    const c = this.advance();
    switch (c) {
      case "(":
        this.addToken(tokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(tokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(tokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(tokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(tokenType.COMMA);
        break;
      case ".":
        this.addToken(tokenType.DOT);
        break;
      case "-":
        this.addToken(tokenType.MINUS);
        break;
      case "+":
        this.addToken(tokenType.PLUS);
        break;
      case ";":
        this.addToken(tokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(tokenType.STAR);
        break;
      case "!":
        this.addToken(this.match("=") ? tokenType.BANG_EQUAL : tokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? tokenType.EQUAL_EQUAL : tokenType.EQUAL,
        );
        break;
      case "<":
        this.addToken(this.match("=") ? tokenType.LESS_EQUAL : tokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? tokenType.GREATER_EQUAL : tokenType.GREATER,
        );
        break;
      case "/":
        // this is checking if its comments
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(tokenType.SLASH);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          loxError(this.line, "Unexpected character.");
        }
        break;
    }
  }
}
