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
  constructor(message, offender, log) {
    this.message = message;
    this.offender = offender;
    this.log = log;
  }
}

class ModifierException {
  constructor(message, offender, log) {
    this.message = message;
    this.offender = offender;
    this.log = log;
  }
}

class MotiveException {
  constructor(message, offender, log) {
    this.message = message;
    this.offender = offender;
    this.log = log;
  }
}

module.exports = {
  CSSException,
  ParserException,
  TypeException,
  ModifierException,
  MotiveException
}