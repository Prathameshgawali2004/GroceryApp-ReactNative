import { View, Modal, Alert, ActivityIndicator } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { lightTheme, darkTheme } from '../ThemeColors';

const Loader = ({ modalVisible, setModalVisible }) => {

  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>

      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <View style={{
          width: 100,
          height: 100,
          margin: 20,
          backgroundColor: theme.card,
          borderRadius: 20,
          padding: 35,
          alignItems: 'center',
          justifyContent: 'center',

          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>

          <ActivityIndicator
            size="large"
            color={theme.text}
          />

        </View>
      </View>
    </Modal>
  );
};

export default Loader;