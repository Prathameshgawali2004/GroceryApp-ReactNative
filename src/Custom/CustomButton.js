import React, { useContext } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ThemeContext } from '../ThemeContext';

const CustomButton = ({ onPress, title, bgColor, textColor }) => {

  const { isDark } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor
          ? bgColor
          : isDark
            ? '#333'
            : '#000',

        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        width: '90%',
        height: 50,
        borderRadius: 10,
        marginTop: 50,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: textColor
            ? textColor
            : isDark
              ? '#fff'
              : '#fff',
          fontWeight: '600'
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;