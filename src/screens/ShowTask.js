import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,List,ListItem,Card,CardItem } from "native-base";
import {   AsyncStorage,ImageBackground ,NetInfo,RefreshControl,ActivityIndicator,ListView,View,FlatList} from 'react-native';
import localhost from "../components/localhost";

export default class ShowTask extends React.Component {
  constructor(props) {
    super(props);
    
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      title: '',
      detail: '',
      email:'',
      isLoading: true,
     };


  }

_loadInitialState = async () => {
    try {
      let value = await AsyncStorage.getItem('email');
      if (value  !== null){
        this.setState({email: value});
        const { email } = this.state;
        alert(email);
          fetch('http://'+localhost+'/GProject/viewtask.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email : email,
      })

      }).then((response) => response.json())
          .then((responseJson) => {
         let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        });
       }).catch((error) => {
            alert(error);
      });
      } else {
        this.setState({email: ''});
      }
    } catch (error) {
      this.setState({email: ''});
    }
  };
  componentWillMount() {
    this._loadInitialState().done();
  }


  showTask = (rowData) => {
    const { email } = this.state;
    this.props.navigation.navigate('TaskDetail', {
      taskID: rowData.task_id,
      taskTitle: rowData.title,
      taskDetail: rowData.detail,
      userEmail: email

    });

  }


  render() {
    const{isLoading} = this.state;
    if(isLoading == false){
      screen=    
      <View >
      <ListView
        dataSource={this.state.dataSource}
        renderSeparator={this.ListViewItemSeparator}
        renderRow={rowData => (
          <Card>
            <CardItem>
              <ListItem>
                <Text>หัวข้องาน:</Text>
                <Text> {rowData.title} </Text>   
            
              </ListItem>
              </CardItem>
              <CardItem>
              <Button success onPress={_ => this.showTask(rowData)}>
                <Text>ดูรายละเอียด</Text>
                <Icon active name="md-add" />
              </Button>
              </CardItem>
          
            </Card>

        )}
      />
    </View>
    }else{
      screen = <Text>No</Text>
    }
    return (
        <Container>
          <ImageBackground
              style={{ flex: 1 }}
              //We are using online image to set background
              source={require('../images/BG.jpg')  
              }

              >
        <Header>
        <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("UserInfo")}>
              
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>งาน </Title>
          </Body>
          <Right>
            <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
        <Content padder> 
         {screen} 
      
        </Content>
        </ImageBackground>
      </Container>
    );
  }
}
