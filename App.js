
import React, { Component } from "react";
import ShowTask from "./src/screens/ShowTask";
import SideBar from "./src/components/SideBar";
import MyTaskList from "./src/screens/MyTaskList";
import MyTaskDetail from "./src/screens/MyTaskDetail"
import UserInfo from "./src/screens/UserInfo";
import History from "./src/screens/History"
import {
    createDrawerNavigator,
    createAppContainer,
  } from 'react-navigation';

const HomeScreenRouter = createDrawerNavigator(
  {
    UserInfo:{screen:UserInfo},
    ShowTask: { screen: ShowTask },
    MyTaskList:{screen:MyTaskList},
    MyTaskDetail:{screen:MyTaskDetail},
    History:{screen:History}

  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);


const MyApp = createAppContainer(HomeScreenRouter);

export default MyApp;