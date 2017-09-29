class ParserException {
  constructor(message) {
    this.message = message;
  }
}

class CSSException {
  constructor(message) {
    this.message = message;
  }
}

module.exports = {
  CSSException,
  ParserException
}