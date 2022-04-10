import { useEffect, useState } from 'react';
import { Button, StyleSheet, Alert } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import {
  SafeAreaView,
  ScrollView, StatusBar, Modal,
  Pressable, TextInput, ActivityIndicator,
  PermissionsAndroid
} from 'react-native';

//import WifiManager from "react-native-wifi-reborn";
import NetInfo from '@react-native-community/netinfo';


export default function TabThreecreen() {

  const [nets, setNets] = useState<string[]>();
  const [currentNet, setCurrentNet] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState<string>("");
  const [isErrorConection, setIsErrorConection] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingConnect, setIsLoadingConnect] = useState<boolean>(false);


  useEffect(() => {

    askForUserPermissions()
  }, [])

  const askForUserPermissions = async () => {
    console.log("SOLICITAR PERMISOS")
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        /*{
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks'
        }*/
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const callEsp8266 = async () => {
    /*
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.details);
      console.log('Is connected?', state.isConnected);
    });
    */
    const netDetails = await NetInfo.fetch();
    const ssid: any = netDetails!.details!.ssid;
    console.log('Connection type', ssid);
    console.log("***************")

    setNets([]);
    setIsErrorConection(false);
    //if(state.details.ssid)
    console.log("AQUI VAMOS A LISTAR TODAS LAS REDES")
    if (ssid == "iotManuel") {
      setIsLoading(true);

      fetch("http://192.168.4.1")
        .then((response) => {
          return response.text();
        })
        .then(data => {
          console.log('-->data', data);
          const netsFromEsp: string[] = data.split(",");
          netsFromEsp.pop()
          setNets(netsFromEsp);
          setIsLoading(false);
        }).catch(error => {
          console.log('-->error', error);
          setNets([]);
          setIsErrorConection(true);
          setIsLoading(false);
        })
    } else {
      Alert.alert('Recuerda que debes estar conectado a la red iotManuel,\nactualmente estas en la red ' + ssid)

    }
  }

  const sendWifiCOnfiguration = (ssid: string, pass: string) => {

    //setting?ssid=xxxx&pass=xxxx
    //Alert.alert("-->" + ssid + "--" + pass);
    setIsLoadingConnect(true);
    fetch(`http://192.168.4.1/setting?ssid=${ssid}&pass=${pass}`)
      .then((response) => { })
      .then(data => { })
      .catch(error => { setModalVisible(false); setIsLoadingConnect(false); })
    //setModalVisible(false);
  }

  const openModal = (n: string) => {
    setCurrentNet(n);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{"\n"}Redes{"\n"}</Text>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {isLoading && <ActivityIndicator size="large" color="#00ff00" />}
          {nets && Array.from(nets).map(n => {
            return <View>
              <Button
                title={n}
                color="#1a237e"
                onPress={() => openModal(n)}
              />
              <Text>{"\n"}</Text>
            </View>
          })}
          {isErrorConection && <Text style={{ color: 'red', textAlign: 'center', fontSize: 30 }}>AL PARECER OCURRIO UN ERROR,
            RECUERDA QUE DEBES ESTAR CONECTADO A LA RED iotManuel</Text>}
        </ScrollView>

      </SafeAreaView>
      <View
        style={{ padding: 55 }}
      >
        <Button
          title="Solicitar Redes"
          color="#f194ff"
          onPress={callEsp8266}
        />

      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Desea conectar el dispositivo a la red {currentNet}</Text>
            <Text style={styles.modalText}>Ingrese la contraseña</Text>
            <TextInput style={styles.input} onChangeText={onChangeText} value={text} />
            {isLoadingConnect && <ActivityIndicator size="large" color="#00ff00" />}

            <View style={styles.containerButton}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => sendWifiCOnfiguration(currentNet, text)}>
                <Text style={styles.textStyle}>Conectar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  scrollView: {
    //backgroundColor: 'pink',
    marginHorizontal: 20,
    height: '90%'
  },
  text: {
    fontSize: 42,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  containerButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
