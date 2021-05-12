import React,{useState,useEffect} from "react"
import axios from "axios";

const UsersList = () => {

  return axios.get("http://localhost:5000/users");
}

export default {
  UsersList
};
