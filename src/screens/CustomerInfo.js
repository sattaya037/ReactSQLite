import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Input,Text,Item, Card, CardItem } from "native-base";
import {   Alert ,NetInfo} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({name: 'customer.db', createFromLocation: '~Database.db'})

export default class Screen2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_name: '',
      customer_contact: '',
      customer_address: '',
    };
  }
 
  register_user = () => {
    const { customer_name } = this.state;
    const { customer_contact } = this.state;
    const { customer_address } = this.state;
    var taskID = this.props.navigation.state.params.MyTaskID;
    var that = this;
    alert(customer_name, customer_contact, customer_address);
    if (customer_name) {
      if (customer_contact) {
        if (customer_address) {
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO customer (task_id, customer_name, customer_contact, customer_address ) VALUES (?,?,?,?)',
              [taskID,customer_name, customer_contact, customer_address],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'You are registered successfully',
                    [
               
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('MyTaskDetail',
                          {
                            TaskInfo:true,
                          }),
                          

                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  alert('Registration Failed');
                }
              }
            );
          });
        } else {
          alert('Please fill Address');
        }
      } else {
        alert('Please fill Contact Number');
      }
    } else {
      alert('Please fill Name');
    }
  };
 
  render() {
    return (
        <Container>
        <Header>
        <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("MyTaskDetail")}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Customer Information</Title>
          </Body>
          <Right>
            <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Right>       
        </Header>
        <Content padder>

        <Item regular>
            <Input placeholder='Name' 
              onChangeText={customer_name => this.setState({ customer_name })}

            />
          </Item>
          <Item regular>
            <Input placeholder='Enter Contact No"' 
              onChangeText={customer_contact => this.setState({ customer_contact })}
              maxLength={10}
              keyboardType="numeric"
            />

          </Item>

          <Item regular>
            <Input placeholder='Enter Address' 
              onChangeText={customer_address => this.setState({ customer_address })}
              maxLength={225}
              numberOfLines={5}
              keyboardType="numeric"
            />
            
          </Item>
        
          <Button block light 
          onPress={this.register_user.bind(this)}>
            <Text>Submit
            </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
