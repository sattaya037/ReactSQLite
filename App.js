import React, { Component } from "react";
import ShowTask from "./src/screens/ShowTask";

import CustomerInfo from "./src/screens/CustomerInfo";
import TakePhoto from "./src/screens/TakePhoto";
import SideBar from "./src/components/SideBar";
import TaskDetail from "./src/screens/TaskDetail";
import MyTaskList from "./src/screens/MyTaskList";
import MyTaskDetail from "./src/screens/MyTaskDetail"
import Send from "./src/screens/Send";
import UserInfo from "./src/screens/UserInfo";
import {
    createDrawerNavigator,
    createAppContainer,
  } from 'react-navigation';

const HomeScreenRouter = createDrawerNavigator(
  {
    UserInfo:{screen:UserInfo},
    ShowTask: { screen: ShowTask },
    CustomerInfo : { screen: CustomerInfo},
    TakePhoto:{screen:TakePhoto},
    TaskDetail :{screen:TaskDetail},
    MyTaskList:{screen:MyTaskList},
    MyTaskDetail:{screen:MyTaskDetail},
    Send:{screen:Send},
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);


const MyApp = createAppContainer(HomeScreenRouter);

export default MyApp;