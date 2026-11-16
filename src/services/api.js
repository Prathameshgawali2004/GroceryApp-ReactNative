import AsyncStorage from '@react-native-async-storage/async-storage';



const BASE_URL = 'http://192.168.1.3:3000';

// Common API Function
const apiRequest = async(endpoint, method = 'GET',body = null) => {
        try{
            const token = await AsyncStorage.getItem('TOKEN');
            const headers = {
                'Content-Type': 'application/json',
            };
            if(token){
                headers.Authorization =`Bearer ${token}`;
            }

            const options = {
             method,
            headers,
        };
        if(body !== null){
            options.body = JSON.stringify(body);
        } 
        const response = await fetch(`${BASE_URL}${endpoint}`,options);

        const data = await response.json();
        
        if(!response.ok){
            throw new Error(data.message ||'API request failed')
        }
        return data;
    } catch (err){
                console.log(`${method} API ERROR:`,err.message);
                throw err;
        }
};

          




// GET ADDRESS

export const getData = async () => {
    return await apiRequest('/address','GET');
};


// ADD ADDRESS

export const postData = async (body) => {
 return await apiRequest('/address','POST',body);   
}


// UPDATE ADDRESS

export const updateData = async (id, body) => {
return await apiRequest(`/address/${id}`,'PUT',body);   
};


// DELETE ADDRESS
export const deleteData = async (id) => {
return await apiRequest(`/address/${id}`,'DELETE');
};


