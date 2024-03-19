import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HotelHomeScreen from './screens/HomeScreen';
import MainMenuScreen from "./screens/MainMenuScreen";
import MapScreen from "./screens/Map";
import SavedScreen from "./screens/SavedScreen";
import CompareScreen from "./screens/CompareScreen";


const Stack = createNativeStackNavigator();
console.disableYellowBox=true;
console.error = () => {};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    options={{ headerTitle: "", headerBackVisible: false }}
                    name="Login"
                    component={LoginScreen}
                />
                <Stack.Screen
                    options={{ headerTitle: "", headerBackVisible: false }}
                    name="Home"
                    component={HotelHomeScreen}
                />
                <Stack.Screen
                    options={{ headerTitle: "", headerBackVisible: false }}
                    name="Map"
                    component={MapScreen}
                />
                <Stack.Screen
                    options={{ headerTitle: "", headerBackVisible: false }}
                    name="Compare"
                    component={CompareScreen}
                />
                <Stack.Screen
                    options={{ headerTitle: "", headerBackVisible: false }}
                    name="Saved"
                    component={SavedScreen}
                />    
                <Stack.Screen
                    options={{ headerTitle: "", headerBackVisible: false }}
                    name="MainMenu" // Add Main Menu Screen to the navigator
                    component={MainMenuScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
