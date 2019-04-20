/*Login Screen and UserInformation Screen*/
import React from "react";
import { Item,Thumbnail,Form,Container, Header, Title, Left, Icon, Right,
  Button, Body, Content,Text, Card, CardItem, Input,List,ListItem,Badge ,Footer, FooterTab,  } from "native-base";
import { AsyncStorage,ImageBackground,View,TouchableOpacity  } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Col, Row, Grid } from "react-native-easy-grid";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

var db = openDatabase({name: 'users.db', createFromLocation: '~Database.db'})
export default class Home extends React.Component {
    state = {
      email:'',
      name:'',
      last_name:'',
    };/*set state */

    _loadInitialState = async () => {
        try {
          let value = await AsyncStorage.getItem('email');
          if (value  !== null){
            this.setState({email: value});
            let  Email  = this.state.email; 
            db.transaction(tx => { /*คำสั่ง query จาก SQLiteDatabase  */
                tx.executeSql(
                  'SELECT * FROM users Where user_email=?',[Email],
                  (tx, results) => {
                    var len = results.rows.length;
                    if(len > 0) {
                      var row = results.rows.item(0);
                      if(row){
                          this.setState({ /*หาก login สำเร็จ State login จะเปลี่ยนเป็น true เพื่อเปลี่ยนจากหน้า login เป็น หน้า UserInfomation  */
                            name:row.user_name,
                            last_name:row.user_last_name
                          });
            
                          };
                    } else {
                      alert('No user found');
                    }
                  }
                );
              });
          } else {
            this.setState({email: '', 
          });
          }
        } catch (error) {
          this.setState({email: '', 
        });
        }
      };
      componentDidMount() {
        this._loadInitialState().done();
      }

  render() {
     return (
    <Container> 
    <HeaderImageScrollView
      maxHeight={200}
      minHeight={100}
      headerImage={require("../images/header.png")}
      renderForeground={() => (
              <List>
                    <ListItem avatar>
                        <Left> 
                          <Thumbnail source={require('../images/user.png')} />
                        </Left>
                        <Body>
                          <Text style={{color: '#ffff', fontSize:20  }} >สวัสดี {this.state.name} {this.state.last_name}</Text>
                          <Text  note>email :{this.state.email}</Text>
                        </Body>
                        <Right>
                        <Button iconLeft transparent warning style={{alignSelf: 'flex-end',}} onPress={this._signOutAsync}>
                            <Icon   name='md-log-out' />
                        </Button>  
                        </Right>
                      </ListItem>
                </List> )}>
            <Content >
               <Grid>
                <Col onPress={() => this.props.navigation.navigate("ShowTask")} style={{ backgroundColor: '#ffbb33', height: 150,border:30 }}>
                <Left></Left>
                  <Body> 
                  <Thumbnail source={require('../images/task.png')} />
                  </Body>
                  <Right></Right>
                        <Text style={{justifyContent: 'center'}}>
                         งานใหม่
                        </Text>
                </Col>
                <Col onPress={() => this.props.navigation.navigate("MyTask")} 
                style={{ backgroundColor: '#ffcc66', height: 150,border:30,borderRadius: 4,  borderWidth: 0.5,borderColor: '#000000' }}>
                <Left></Left>
                  <Body> 
                  <Thumbnail source={require('../images/mytask.png')} />
                  </Body>
                  <Right></Right>
                        <Text style={{justifyContent: 'center'}}>
                        งานของฉัน
                        </Text>           
                </Col>
                <Col onPress={() => this.props.navigation.navigate("History")} 
                style={{ backgroundColor: '#ffe6b3', height: 150,border:30,borderRadius: 4, borderWidth: 0.5,borderColor: '#000000' }}>
                <Left></Left>
                  <Body> 
                  <Thumbnail source={require('../images/history.png')} />
                  </Body>
                  <Right></Right>
                        <Text style={{justifyContent: 'center'}}>
                        ประวัติการทำงาน
                        </Text>           
                </Col>
              </Grid>
              <Grid>
                <Col style={{ backgroundColor: '#ffff', height: 500,border:30,borderRadius: 4, borderWidth: 0.5,borderColor: '#000000' }}>
                   <Text>content here</Text>
                </Col>
              </Grid>
            </Content>
          
            </HeaderImageScrollView>
            <Footer>
          <FooterTab>
            <Button badge vertical>
              <Badge><Text>2</Text></Badge>
              <Icon name="apps" />
            </Button>
            <Button active badge vertical>
              <Badge ><Text>51</Text></Badge>
              <Icon active name="md-notifications" />
            </Button>
            <Button vertical >
              <Icon name="menu" />
            </Button>
          </FooterTab>
        </Footer>
    </Container>
    );
  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  }
 