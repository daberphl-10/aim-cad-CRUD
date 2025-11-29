<template>
    <div>
      <h2>All Items</h2>
      <table class="table table-bordered table-striped table-hover">
        <tbody>
        <tr v-for="item in items" :key="item.id">
            <td>{{ item.brand }}</td>
            <td>
                <button type="button" class="btn btn-warning" @click="editItem(item)">Edit</button> |
                <button type="button" class="btn btn-danger" @click="deleteItem(item.id)">Delete</button>
            </td>
        </tr>
    </tbody>
      </table>
    </div>
  </template>
  
  <script>
  
  import axios from 'axios'

  export default {
    data() {
      return {
        items: [],
      };
    },
    methods: {
      editItem() {
        // Implement edit functionality
      },
      deleteItem() {
        // Implement delete functionality
      },
    },
    mounted() {
        axios.get('http://127.0.0.1:8000/api/computer').then(
            response => { 
                this.items = response.data; 
            }
        ).catch(error => {
             console.error('Error fetching data:', error);
        });
    },
  };
  </script>
  