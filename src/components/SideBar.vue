<template>
    <div class="d-flex" id="wrapper">
      <div class="bg-light border-right" id="sidebar-wrapper">
        <div class="sidebar-heading">Bootstrap Vue Sidebar</div>
        <div class="list-group list-group-flush">
          <router-link to="/main/child1" class="list-group-item list-group-item-action bg-light">Go to Child 1</router-link>
          <router-link to="/map" class="list-group-item list-group-item-action bg-light">
            <i class="bi bi-geo-alt-fill"></i> Farm Map
          </router-link>
          <a href="#" class="list-group-item list-group-item-action bg-light">Dashboard</a>
          <a href="#" class="list-group-item list-group-item-action bg-light">Shortcuts</a>
          <a href="#" class="list-group-item list-group-item-action bg-light">Overview</a>
          <a href="#" class="list-group-item list-group-item-action bg-light">Events</a>
          <a href="#" class="list-group-item list-group-item-action bg-light">Profile</a>
          <a href="#" class="list-group-item list-group-item-action bg-light">Status</a>
        </div>
      </div>
      <div id="page-content-wrapper">

        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button class="btn btn-primary" @click="toggleSidebar">
              <i :class="iconbutton"></i>
            </button>

            
        </nav>

        <div class="container-fluid">

          <h1 class="mt-4">Simple Sidebar</h1>
          <p>This is the main content area.</p>
          <router-view/>
        </div>
      </div>
    </div>
  </template>
  
  <script>

  export default {
    name: 'SideBar',
    data(){
      return {
        iconbutton: "bi bi-window-fullscreen"
      }
    },
    methods: {
      toggleSidebar() {

        if(this.iconbutton == "bi bi-window-sidebar"){
          this.iconbutton = "bi bi-window-fullscreen";
        } else {
          this.iconbutton = "bi bi-window-sidebar";
        }

        document.getElementById('wrapper').classList.toggle('toggled');
      }
    }
  }
  </script>
  
  <style scoped>
  #wrapper {
    display: flex;
    flex-direction: row;
  }
  #sidebar-wrapper {
    min-width: 250px;
    max-width: 250px;
    transition: all 0.3s;
  }
  #page-content-wrapper {
    width: 100%;
  }
  #wrapper.toggled #sidebar-wrapper {
    margin-left: -250px;
  }
  @media (min-width: 768px) {
    #wrapper {
      flex-direction: row;
    }
    #sidebar-wrapper {
      margin-left: 0;
    }
  }
  </style>
  