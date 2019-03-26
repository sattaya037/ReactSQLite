import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,
 Accordion ,List,ListItem,Card,CardItem ,Thumbnail,CheckBox } from "native-base";
import { FlatList, View,AsyncStorage,ImageBackground } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({name: 'task.db', createFromLocation: '~Database.db'})

export default class MyTaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      FlatListItems: [],
    };

  }
  _loadInitialState = async () => {
    try {
      let value = await AsyncStorage.getItem('email');
      if (value  !== null){
        this.setState({email: value});
        const { email } = this.state;
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM task WHERE user_email=?', [email], (tx, results) => {
            var temp = [];
            if(temp){
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              this.setState({
                FlatListItems: temp,
              });
            }else{
              this.setState({
                FlatListItems:false,
              });            }
          
          });
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





  goTask = (item) => {
    this.props.navigation.navigate('MyTaskDetail', {
      MyTaskID: item.task_id,
      MyTaskTitle: item.task_title,
      MyTaskDetail: item.task_detail,
      TaskInfo:false,
      TaskPic: false,

    });

  }
  render() {
    const { FlatListItems } = this.state;
    if(FlatListItems==false){
      data = 
        <Card>
            <CardItem>
              <Icon active name="logo-googleplus" />
              <Text>คุณไม่มีงานที่รับมา</Text>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
             </CardItem>
           </Card>
    }else{
      data =  
       
      <FlatList
      data={this.state.FlatListItems}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
            <Card style={{flex: 0}}>
                 <CardItem>
              <Left>
                <Body>
                  <Text>Title:{item.task_title}</Text>
                </Body>
              </Left>
              <Right>
            
            <Button success onPress={_ => this.goTask(item)}>
                <Text>ดูรายละเอียด</Text>
                <Icon active name="md-add" />
              </Button>
          </Right>
            </CardItem>
              </Card>
      )
      }
    />
    
    }

    return (
    <Container>
       <ImageBackground
              style={{ flex: 1 }}
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
        <Title>งานของฉัน </Title>
      </Body>
      <Right>
        <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
          <Icon name='menu' />
        </Button>
      </Right>

    </Header>
    <Content padder>
 
      <View>
        {data}
      </View>
     
    </Content>
    </ImageBackground>
  </Container>
    
    );
  }
}
