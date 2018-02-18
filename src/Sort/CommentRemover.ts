/**
 * Status of parsing
 */
enum CommentParsingStatus {
  Default,
  SingleQuotationString,
  DoubleQuatationString,
  MultilineComment,
  SinglelineComment,
}

export default class CommentRemover {
  public removedSource: string;

  private _status: CommentParsingStatus = CommentParsingStatus.Default;

  private _afterSlush = false;

  private get _isInComment(): boolean {
    return this._status === CommentParsingStatus.MultilineComment || this._status === CommentParsingStatus.SinglelineComment;
  }

  public static remove(source: string): string {
    const remover = new CommentRemover(source);
    return remover.removedSource;
  }

  constructor(public source: string) {
    this.removedSource = this._remove();
  }

  private _remove(): string {
    let text = "";
    let last = "";
    for (let i = 0; i < this.source.length; i++) {
      const c = this.source.charAt(i);
      const cn = this.source.charAt(i + 1);
      if (c === "\\") {
        this._afterSlush = true;
        i++;
        continue;
      }
      switch (this._status) {
        case CommentParsingStatus.Default:
          this._defaultParsing(c, cn);
          break;
      }
      if (!this._isInComment || c === "\n") {
        text += c;
      }
      switch (this._status) {
        case CommentParsingStatus.MultilineComment:
        case CommentParsingStatus.SinglelineComment:
          this._checkCommentEnd(last, c);
      }
      last = c;
    }
    return text;
  }

  private _defaultParsing(current: string, next: string): void {
    if (current === "'") {
      this._status = CommentParsingStatus.SingleQuotationString;
    }
    if (current === "\"") {
      this._status = CommentParsingStatus.DoubleQuatationString;
    }
    if (current === "/" && next === "/") {
      this._status = CommentParsingStatus.SinglelineComment;
    }
    if (current === "/" && next === "*") {
      this._status = CommentParsingStatus.MultilineComment;
    }
  }

  private _checkCommentEnd(last: string, current: string): void {
    if (current === "\n" && this._status === CommentParsingStatus.SinglelineComment) {
      this._status = CommentParsingStatus.Default;
      return;
    }
    if (last === "*" && current === "/" && this._status === CommentParsingStatus.MultilineComment) {
      this._status = CommentParsingStatus.Default;
      return;
    }
  }
}
