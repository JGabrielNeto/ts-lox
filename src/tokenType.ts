enum tokenType {
    LEFT_PAREN,
    RIGHT_PAREN,
    LEFT_BRACE,
    RIGHT_BRACE,
    COMMA,
    DOT,
    MINUS,
    PLUS,
    SEMICOLON,
    SLASH,
    STAR,
    BANG,
    BANG_EQUAL,
    EQUAL,
    EQUAL_EQUAL,
    GREATER,
    GREATER_EQUAL,
    LESS,
    LESS_EQUAL,
    INDENTIFIER,
    STRING,
    NUMBER,
    AND,
    CLASS,
    ELSE,
    FALSE,
    FUN,
    FOR,
    IF,
    NIL,
    OR,
    PRINT,
    RETURN,
    SUPER,
    THIS,
    TRUE,
    VAR,
    WHILE,
    EOF,
}

type token = `${string}`;
type literal = string | number;

const keywords = {
    and: tokenType.AND,
    class: tokenType.CLASS,
    else: tokenType.ELSE,
    false: tokenType.FALSE,
    for: tokenType.FOR,
    fun: tokenType.FUN,
    if: tokenType.IF,
    nil: tokenType.NIL,
    or: tokenType.OR,
    print: tokenType.PRINT,
    return: tokenType.RETURN,
    super: tokenType.SUPER,
    this: tokenType.THIS,
    true: tokenType.TRUE,
    var: tokenType.VAR,
    while: tokenType.WHILE,
};

class Token {
    type: tokenType;
    lexeme: string;
    literal: literal;
    line: number;

    constructor(type: tokenType, lexeme: string, literal: literal, line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString(): string {
        return `TOKEN: ${tokenType[this.type]}: ${this.lexeme}`;
    }
}

export { tokenType, token, Token, literal, keywords };
