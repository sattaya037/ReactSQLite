import React from "react";
import {
  AsyncStorage,
} from 'react-native';
import { Container, Content, Text, List, ListItem ,Left,Body,Thumbnail,Button} from "native-base";
const routes = ["UserInfo", "ShowTask","MyTaskList"];
export default class SideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      getValue: '',
      //to set the value on Text
    };
  }

  pages = (data) => {
    this.props.navigation.navigate(data);
  }


  render() {
    return (
      <Container>
        <Content>

          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={_ => this.pages(data)}>
                  <Text>{data}</Text>
                </ListItem>
              );
            }}
          />
          
        </Content>
      </Container>
    );
  }
}