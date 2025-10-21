import client from './client'


const register  = (user,pushToken) => client.patch('/users/'+ user + '/',{expoPushToken: pushToken});



export default {
    register
}