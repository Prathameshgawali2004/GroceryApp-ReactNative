import {TouchableOpacity,Text} from 'react-native';


const CustomButton = ({onPress,title,bgColor,textColor}) => {
    return(

        <TouchableOpacity style={{
        backgroundColor: bgColor,
        justifyContent:'center', 
        alignSelf:'center',
        alignItems:'center',
        width:'90%',
        height:50,
        borderRadius:10,
        marginTop:50,
        }}
               onPress={() => {
                onPress();
}}           
>
    
    <Text style={{color:textColor,}}>{title}</Text>

    </TouchableOpacity>

      
    )
}

export default CustomButton;