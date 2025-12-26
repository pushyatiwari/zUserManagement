jest.mock('react-native/Libraries/Animated/AnimatedImplementation', () => {
  const Actual = jest.requireActual(
    'react-native/Libraries/Animated/AnimatedImplementation',
  );

  function Value(this: any, v: any) {
    this._value = v;
    this.setValue = jest.fn();
    this.addListener = jest.fn(() => '1');
    this.removeListener = jest.fn();
    this.removeAllListeners = jest.fn();
    this.stopAnimation = jest.fn();
    this.resetAnimation = jest.fn();
    this.interpolate = jest.fn(() => 0);
  }

  const add = jest.fn(() => ({
    interpolate: jest.fn(() => 0),
  }));

  const event = jest.fn(() => jest.fn());

  const timing = jest.fn(() => ({
    start: jest.fn(),
  }));

  const createAnimatedComponent = jest.fn((Comp: any) => Comp);

  return {
    ...Actual,
    Value,
    add,
    event,
    timing,
    createAnimatedComponent,
  };
});
