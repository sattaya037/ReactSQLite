/*Login Screen and UserInformation Screen*/
import React from "react";
import { Item,Thumbnail,Form,Container, Header, Title, Left, Icon, Right,
  Button, Body, Content,Text, Card, CardItem, Input,List,ListItem,Badge ,Footer, FooterTab,  } from "native-base";
import { AsyncStorage,ImageBackground,View,TouchableOpacity  } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
/*link library*/
var db = openDatabase({name: 'users.db', createFromLocation: '~Database.db'})/*ประกาศตัวแปร SQLite ให้สามารถเรียกใช้ได้*/
export default class Login extends React.Component {

    state = {
      login:false,/*กำหนด state login เป็น false เพื่อให้ App แสดงหน้า login */
      Email:'',/*Email state */
      Password:'',/*Password state */
      email:'',
      name:'',
      last_name:'',
    };/*set state */


    _signInAsync = async () => {/*Login Function */
  let Email = this.state.Email; /*ประกาศตัวแปร Email รับ state value มาจาก email state*/
  let  Password  = this.state.Password; /*ประกาศตัวแปร Password รับ state value มาจาก Password state*/
  db.transaction(tx => { /*คำสั่ง query จาก SQLiteDatabase  */
    tx.executeSql(
      'SELECT * FROM users Where user_email=? AND user_password=? ',/*คำสั่ง query ดูว่ามี Email กับ Password ตรงกับ ใน Sqlite หรือไหม */
      [Email,Password],
      (tx, results) => {
        var len = results.rows.length;
        if(len > 0) {
          var row = results.rows.item(0);
          if(row){
              AsyncStorage.setItem('email',row.user_email);
              this.props.navigation.navigate('App');
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
  render() {
    return (
    <Container>
    <ImageBackground
        style={{ flex: 1 }}
        source={require('../images/BG.jpg')  
        }>   
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
                onPress={this._signInAsync}>
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
           </ImageBackground>
          </Container>
    );
  }
  }

 