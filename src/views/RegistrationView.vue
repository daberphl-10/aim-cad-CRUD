<template>
  <div>
    <h1>Registration Page</h1>
    <input type="text" placeholder="Name" v-model="name">
    <input type="text" placeholder="Email" v-model="email">
    <input type="password" placeholder="Password" v-model="password">
    <button type="button" @click="save()">Sign up</button>
  </div>
</template>

<script>

import axios from 'axios';

export default {
    data(){
        return {
            name: "", email: "", password: ""
        }
    },
    methods: {
        save(){
            axios.post("http://127.0.0.1:8000/api/register", {
                name: this.name, email: this.email, password: this.password
            })
            .then((response)=> {
                if(response.status == 200){
                    console.log(response.data);
                    this.$router.push('/');
                    alert("Record has been saved!");
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    }
}
</script>