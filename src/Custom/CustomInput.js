import React from 'react';
import { TextInput,View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const CustomInput = ({
    placeholder,
    secureTextEntry,
    value,
    onChangeText,
    iconName,
}) => {


    return (
          <View style={styles.container}>       
        <Icon
        name={iconName}
        size={24}
        color="gray"
        style={styles.icon}
      />

        <TextInput
            placeholder={placeholder}
            placeholderTextColor='gray'
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
        />
</View>


    )

}

const styles = StyleSheet.create({


  container: {
  width: '90%',
  height: 50,
  borderWidth: 1,
  borderRadius: 10,
  alignSelf: 'center',
  marginTop: 12,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
},

input: {
  flex: 1,
  color: 'black',

    },
    icon: {
    marginRight: 10,
  },



})

export default CustomInput;