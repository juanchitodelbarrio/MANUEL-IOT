import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Amplify, { API, graphqlOperation, Auth, button, JS } from 'aws-amplify';
import { useEffect, useState } from 'react';

import { myDevices } from '../grapgQL/querys'

export default function TabOneScreen() {

  const [devices, setDevices] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {

      let user = await Auth.currentAuthenticatedUser();
      const allTodos = await API.graphql({
        query: myDevices(user.username),
      });

      console.log(allTodos.data.listMyModelTypes.items[0])
      setDevices(allTodos.data.listMyModelTypes.items[0])
      setIsLoading(true)
      //alert(JSON.stringify(devices.device))
    })();
  }, [])

  return (
    <View>
      {isLoading && <View>
        {devices.device && Array.from(devices.device).map(d => {
          const dataIrControl = JSON.parse(d);
          console.log('===>', dataIrControl)
          return (
            <View>
              <Text>*************************</Text>
              <Text>{dataIrControl.irRemoteName}</Text>
              {dataIrControl.buttons && Array.from(dataIrControl.buttons).map(button => {
                return (<Button
                  title={button.buttonName}
                />);
              })}
            </View>
          );
        }

        )
        }
      </View>}
    </View>

  );
}