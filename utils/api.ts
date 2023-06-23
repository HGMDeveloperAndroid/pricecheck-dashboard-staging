
import axios from 'axios';
import { baseURL } from './baseUrl';

export default axios.create({
  baseURL,
  //timeout: 1000
})