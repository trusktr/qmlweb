function QMLQAbstractState(meta) {
  var self = this;
  QMLItem.call(this, meta);

  createSimpleProperty("bool", this, "active", "ro");

  this.entered = Signal();
  this.exited = Signal();

  this.activeChanged.connect(function() {
    if (self.active == true)
      self.entered();
    else
      self.exited();
  });
}

registerQmlType({
  module: 'QtQml.StateMachine',
  name: 'State',
  versions: /^1/,
  constructor: function(meta) {
    var self = this;

    QMLQAbstractState.call(this, meta);

    this.QState = {
      ExclusiveState: 0,
      ParallelState: 1
    };

    createSimpleProperty("enum", this, "childMode");
    createSimpleProperty("variant", this, "initialState");
    createSimpleProperty("variant", this, "errorState");

    this.finished = Signal();

    this.childMode = this.QState.ExclusiveState;

    function enterState(state) {
      if (typeof state != 'undefined' && state != null) {
        state.entered();
      }
      return false;
    }

    this.entered.connect(function() {
      if (self.childMode == self.QState.ExclusiveState) {
        if (!(enterState(self.initialState)))
          enterState(self.errorState);
      }
      else {
        for (var child in self.children) {
          if (!(enterState(child))) {
            enterState(self.errorState);
            break ;
          }
        }
      }
    });
  }
});

registerQmlType({
  module: 'QtQml.StateMachine',
  name: 'FinalState',
  versions: /^1/,
  constructor: function(meta) {
    var self = this;
    var inherits = getConstructor('QtQml.StateMachine', '1.0', 'State');
    inherits.call(this, meta);

    this.entered.connect(function() {
      if (typeof self.parent.finished == "function")
        self.parent.finished();
    });
  }
});

registerQmlType({
  module: 'QtQml.StateMachine',
  name: 'StateMachine',
  versions: /^1/,
  constructor: function(meta) {
    var inherits = getConstructor('QtQml.StateMachine', '1.0', 'State');

    inherits.call(this, meta);

    createSimpleProperty("string", this, "errorString", "ro");
    createSimpleProperty("enum", this, "globalRestorePolicy");
    createSimpleProperty("bool", this, "running");

    this.started = Signal();
    this.stopped = Signal();

    this.start = function() {
    }

    this.stop = function() {
    }
  }
});
