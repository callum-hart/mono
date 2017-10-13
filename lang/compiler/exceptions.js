class CSSException {
  constructor(message) {
    this.message = message;
  }
}

class ParserException {
  constructor(message) {
    this.message = message;
  }
}

class TypeException {
  constructor(message) {
    this.message = message;
  }
}

class ModifierException {
  constructor(message) {
    this.message = message;
  }
}

class MotiveException {
  constructor(message) {
    this.message = message;
  }
}

module.exports = {
  CSSException,
  ParserException,
  TypeException,
  ModifierException,
  MotiveException
}