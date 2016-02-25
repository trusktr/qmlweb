describe('QtQml.StateMachine', function() {
  var loader = prefixedQmlLoader('QtQml.StateMachine/qml/Basic');

  it('should trigger finished when a final state is reached', function() {
    var div = loader('Sample');
    var qml = div.qml;

    var foo = { dummy: function() {} }
    spyOn(foo, 'dummy')

    qml.children[0].finished.connect(foo.dummy);
    qml.enterFinalState();

    expect(foo.dummy).toHaveBeenCalled();
    div.remove();
  });
});
