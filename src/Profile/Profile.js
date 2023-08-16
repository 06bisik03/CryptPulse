import Login from "./Login";
import SignUp from "./SignUp";
import React from "react";
import { redirect } from "react-router";
const { MongoClient } = require("mongodb");
import { useSearchParams } from "react-router-dom";
import UserForm from "./UserForm";
const uri = "mongodb+srv://shredderbaris:shred@crypt.kpdeoil.mongodb.net/";
const client = new MongoClient(uri);

const Profile = () => {
  return <UserForm />;
};

export default Profile;
export async function action() {
  return redirect("/");
}
