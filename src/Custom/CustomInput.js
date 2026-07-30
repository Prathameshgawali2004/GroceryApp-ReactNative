import React, { useContext } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../ThemeContext';

const CustomInput = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  iconName,
  keyboardType,
  maxLength,
  isPassword,
  hidePassword,
  setHidePassword,
}) => {

  const { isDark } = useContext(ThemeContext);
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        borderColor: isDark ? '#444' : '#ccc'
      }
    ]}>

      <Icon
        name={iconName}
        size={24}
        color={isDark ? '#aaa' : 'gray'}
        style={styles.icon}
      />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#888' : 'gray'}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[
          styles.input,
          { color: isDark ? '#fff' : '#000' }
        ]}
      />

      {isPassword && (
        <Ionicons
          name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color={isDark ? '#aaa' : 'gray'}
          onPress={() => setHidePassword(!hidePassword)}
        />
      )}

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
  },

  icon: {
    marginRight: 10,
  },
});

export default CustomInput;