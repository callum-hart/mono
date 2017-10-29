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

class AbstractNotionException {
  constructor(message, offender, log) {
    this.message = message;
    this.offender = offender;
    this.log = log;
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

class SelectorException {
  constructor(message, offender, log) {
    this.message = message;
    this.offender = offender;
    this.log = log;
  }
}

module.exports = {
  CSSException,
  ParserException,
  AbstractNotionException,
  TypeException,
  ModifierException,
  MotiveException,
  SelectorException
}