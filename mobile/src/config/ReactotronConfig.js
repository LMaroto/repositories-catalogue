import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: '100.80.6.158' })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
