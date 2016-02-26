describe('QtQml.StateMachine', function() {
  var loader = prefixedQmlLoader('QtQml.StateMachine/qml/Basic');
  var div;

  afterEach(function() {
    div.remove();
  });

  it('should trigger finished when a final state is reached', function() {
    div = loader('Sample');
    var qml = div.qml;

    var foo = { dummy: function() {} }
    spyOn(foo, 'dummy')

    qml.children[0].finished.connect(foo.dummy);
    qml.enterFinalState();

    expect(foo.dummy).toHaveBeenCalled();
  });

  describe('SignalTransition', function() {
    var qml, foo;

    beforeEach(function() {
      div = loader('Sample');
      qml = div.qml;
      foo = { dummy: function() {} };
      spyOn(foo, 'dummy');
    });

    it('should enter the targetState when the signal is triggered', function() {
      qml.children[0].finished.connect(foo.dummy);
      qml.signalTrigger();
      expect(foo.dummy).toHaveBeenCalled();
    });

    it('should not enter the targetState if the guard property evaluates to false', function() {
      qml.blocked = false;
      qml.children[0].finished.connect(foo.dummy);
      qml.signalTrigger();
      expect(foo.dummy).not.toHaveBeenCalled();
    });

    it('should not enter the targetState if the parent State isn\'t active', function() {
      qml.children[0].finished.connect(foo.dummy);
      qml.children[0].children[0].exited();
      qml.signalTrigger();
      expect(foo.dummy).not.toHaveBeenCalled();
    });
  });
});
