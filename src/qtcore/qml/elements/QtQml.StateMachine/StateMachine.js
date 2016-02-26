function QMLQAbstractState(meta) {
  var self = this;
  var signalLock = false;
  QMLItem.call(this, meta);

  createSimpleProperty("bool", this, "active", "ro");

  this.entered = Signal();
  this.exited = Signal();

  this.activeChanged.connect(function() {
    if (signalLock == false) {
      if (self.active == true)
        self.entered();
      else
        self.exited();
    }
  });

  this.entered.connect(function() {
    signalLock = self.$canEditReadOnlyProperties = true;
    self.active = true;
    signalLock = self.$canEditReadOnlyProperties = false;
  });

  this.exited.connect(function() {
    signalLock = self.$canEditReadOnlyProperties = true;
    self.active = false;
    signalLock = self.$canEditReadOnlyProperties = false;
  });
}

function QMLQAbstractTransition(meta) {
  var self = this;
  QMLItem.call(this, meta);

  createSimpleProperty("bool", this, "sourceState", "ro");
  createSimpleProperty("variant", this, "targetState");
  // TODO implement multiple target states
  //createSimpleProperty("list", this, "targetStates");

  this.triggered = Signal();

  this.triggered.connect(function() {
    if (typeof self.targetState != 'undefined' && self.targetState != null) {
      self.targetState.entered();
    }
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
  name: 'TimeoutTransition',
  versions: /^1/,
  constructor: function(meta) {
    var self = this;
    QMLQAbstractTransition.call(this, meta);

    createSimpleProperty("Component", this, "targetState");
    createSimpleProperty("int", this, "timeout");

    meta.parent.entered.connect(function() {
      setTimeout(this.finished, self.timeout);
    });
  }
});

registerQmlType({
  module: 'QtQml.StateMachine',
  name: 'SignalTransition',
  versions: /^1/,
  constructor: function(meta) {
    var self = this;
    var lastConnectedSignal = null;
    QMLQAbstractTransition.call(this, meta);

    createSimpleProperty("bool", this, "guard");
    createSimpleProperty("variant", this, "signal");

    this.signalCallback = function() {
      if (self.parent.active === true && (self.guard === true || typeof self.guard == 'undefined')) {
        self.triggered();
      }
    }

    function initializeSignal() {
      if (typeof self.signal == 'function') {
        if (typeof lastConnectedSignal == 'function') {
          lastConnectedSignal.disconnect(self, 'signalCallback');
        }
        self.signal.connect(self, 'signalCallback');
        lastConnectedSignal = self.signal;
      }
    }

    this.signalChanged.connect(initializeSignal);
    initializeSignal();
  }
});

registerQmlType({
  module: 'QtQml.StateMachine',
  name: 'StateMachine',
  versions: /^1/,
  constructor: function(meta) {
    var self = this;
    var is_running = false;
    var inherits = getConstructor('QtQml.StateMachine', '1.0', 'State');

    inherits.call(this, meta);

    createSimpleProperty("string", this, "errorString", "ro");
    createSimpleProperty("enum", this, "globalRestorePolicy");
    createSimpleProperty("bool", this, "running");

    this.running = false;
    this.started = Signal();
    this.stopped = Signal();

    this.start = function() {
      if (self.initialState != null && typeof self.initialState != 'undefined' && typeof self.initialState.entered == 'function') {
        self.running = is_running = true;
        self.initialState.entered();
        self.started();
      }
    }

    this.stop = function() {
      self.running = is_running = false;
      self.stopped();
    }

    this.runningChanged.connect(function() {
      if (is_running && !self.running)
        self.stop();
      else if (!is_running && self.running)
        self.start();
    });

    this.initialStateChanged.connect(function() {
      if (self.running && !is_running)
        self.start();
    });
  }
});
