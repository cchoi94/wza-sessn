import axios from 'axios'
import Firebase from '../Firebase/Firebase'

const instance = axios.create({
  baseURL: 'https://wza-backend.firebaseio.com'
})

export default instance