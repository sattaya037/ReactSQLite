import React from "react";
import { Item,Thumbnail,Form,Container, Header, Title, Left, Icon, Right,
  Button, Body, Content,Text, Card, CardItem, Input,ListItem,List,Switch  } from "native-base";
import {   Alert , View ,AsyncStorage,ImageBackground,Image  } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({name: 'users.db', createFromLocation: '~Database.db'})

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      Email:'',
      Password:'',
      email:'',
      name:'',
      last_name:'',
    
    };

}
login (){
  let Email = this.state.Email;
  let  Password  = this.state.Password;
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users Where user_email=? AND user_password=? ',
      [Email,Password],
      (tx, results) => {
        var len = results.rows.length;
        if(len > 0) {
          var row = results.rows.item(0);
          if(row){
               AsyncStorage.multiSet([
                ['email', row.user_email],
                ['name', row.user_name],
                ['last_name', row.user_last_name]
              ])
              this.setState({login:true,
                email:row.user_email,
                name:row.user_name,
                last_name:row.user_last_name
              });

              };
        } else {
          alert('No user found');
          this.setState({
            Email: '',
            Password: ''            
          });
        }
      }
    );
  });
}
logout() {
  let keys = ['email', 'name','last_name'];
  AsyncStorage.multiRemove(keys, (err) => {
    this.setState({login:false,
      Email:'',
      Password:'',
      email:'',
      name:'',
      last_name:''
    });
  });
  alert('logout');  
}


  render() {
    var check = this.state.login;
    if(check==false){
      header=<Header>
      </Header>
      content=
      <Content padder>
     <Card>
        <CardItem style={{ justifyContent: 'center'}} >
          <Thumbnail source={require('../images/logo.png')  }/>
        </CardItem>
        <Form>
        <CardItem>
        <Item rounded>
            <Input placeholder='Email' 
              onChangeText={Email => this.setState({Email})}/>
            <Icon active name='md-at' />
          </Item>
            </CardItem>
          <CardItem>
          <Item rounded>
            <Input placeholder='Password' 
	          onChangeText={Password => this.setState({Password})}/>
            <Icon active name='md-key'/>
          </Item>
          </CardItem>
          </Form>
          <CardItem style={{ justifyContent: 'center'}}>
                <Button rounded info style={{justifyContent: 'center',width: 300, height: 40}}
                onPress={this.login.bind(this)}>
                  <Text style={{justifyContent: 'center'}}>Login
                  </Text>
                </Button>
          </CardItem>
          <CardItem style={{ justifyContent: 'center',width: 300}}>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="md-information" />
                  <Text>forgot Password</Text>
                </Button>
          </CardItem>
      </Card>

      </Content>
    }else{
      header=<Header>
      <Body>
        <Title>UserInformation</Title>
      </Body>
      <Right>
        <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
          <Icon name='menu' />
        </Button>
      </Right>
    </Header>
      content=
            <Content padder>
            
            <Card>
                <CardItem header bordered>
                  <Text>ข้อมูลพนักงาน</Text>
                </CardItem>
                <CardItem bordered>
                  <Body>
                  <Text>Email:{this.state.email}</Text>
                  <Text>ชื่อ-สกุล:{this.state.name} {this.state.last_name}</Text>

                  </Body>
                </CardItem>
          
              </Card>

              <Card>
                <CardItem header bordered>
                  <Text>menu</Text>
                </CardItem>
                  <ListItem icon>
                    <Left>
                      <Button style={{ backgroundColor: "#FF9501" }}>
                        <Icon active name="md-clipboard" />
                      </Button>
                    </Left>
                    <Body>
                      <Text>งานใหม่</Text>
                    </Body>
                    <Right>
                    <Button style={{ backgroundColor: "#3333ff" }}
                      onPress={() => this.props.navigation.navigate("ShowTask")}>
                      <Text>click</Text>
                    </Button>
                    </Right>
                  </ListItem>

                  <ListItem icon>
                    <Left>
                      <Button style={{ backgroundColor: "#FF9501" }}>
                        <Icon active name="md-filing" />
                      </Button>
                    </Left>
                    <Body>
                      <Text>งานของฉัน</Text>
                    </Body>
                    <Right>
                    <Button style={{ backgroundColor: "#b3b3ff" }}
                      onPress={() => this.props.navigation.navigate("MyTaskList")}>
                      <Text>click</Text>
                    </Button>
                    </Right>
                  </ListItem>
          
              </Card>
              <Button block light 
              onPress={this.logout.bind(this)}>
                <Text>logout
                </Text>
              </Button>
            </Content>
        }
        return (

          <Container>
           {header}
           <ImageBackground
              style={{ flex: 1 }}
              //We are using online image to set background
              source={require('../images/BG.jpg')  
              }

              >
           {content}
           </ImageBackground>

          </Container>
    );
  }
  }
