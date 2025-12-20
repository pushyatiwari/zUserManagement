/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/Home/Home';

function App() {

  return (
    <SafeAreaProvider>
        <HomeScreen />
    </SafeAreaProvider>
  );
}


export default App;
