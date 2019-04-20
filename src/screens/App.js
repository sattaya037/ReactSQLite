import AuthLoadingScreen from "./Auth"
import Home from "./Home"
import Login from "./Login"
import ShowTask from "./ShowTask"
import MyTask from "./MyTask"
import DoTask from "./DoTask"
import History from "./History"
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
const AppStack = createStackNavigator({ Home: Home,ShowTask:ShowTask,MyTask:MyTask,DoTask:DoTask,History:History});
const AuthStack = createStackNavigator({ Login: Login });

const MyApp2 = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
export default MyApp2;