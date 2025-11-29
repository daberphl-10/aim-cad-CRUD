<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col-2">
        <canvas id="chart" width="40" height="20"></canvas>
      </div>
    </div>
  </div>
  <h1>Hello World!</h1>
  <button type="button" @click="logout()">Log Out</button>
  <Sidebar />
  <router-link to="/main/child1">Go to Child 1</router-link>
  <router-link to="/main/child2">Go to Child 2</router-link>
</div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import Sidebar from "@/components/SideBar.vue";

export default {
  name: "MainComponent",
  components: {
    Sidebar,
  },
  data() {
    return {
      token: "",
      user_id: "",
    };
  },
  methods: {
    logout() {
      this.$swal({
        title: "Log out",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("token");
          this.$router.push("/");
        } else if (result.dismiss === this.$swal.DismissReason.cancel) {
          this.$swal("Cancelled", "Your file is safe :)", "error");
        }
      });
    },
    getUser() {
      this.token = localStorage.getItem("token");
      this.user_id = localStorage.getItem("user_id");

      alert(this.token);

      axios
        .get("http://127.0.0.1:8000/api/users/" + this.user_id, {
          headers: { Authorization: "Bearer " + this.token },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    renderTeacherGenderChart() {
      if (this.chartInstanceTeacher) {
        this.chartInstanceTeacher.destroy();
      }
      const ctx = document.getElementById("chart").getContext("2d");
      this.chartInstanceTeacher = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Male", "Female"],
          datasets: [
            {
              label: "Sample Chart",
              data: [5, 5],
              backgroundColor: ["#C21010", "#EAD196"],
              borderColor: ["#F5F5F5", "#F5F5F5"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  family: "Arial", // Font family for legend labels
                  size: 14,
                },
              },
            },
            tooltip: {
              titleFont: {
                family: "Arial", // Font family for tooltip title
                size: 17, // Font size for tooltip title
                weight: "bold",
              },
              bodyFont: {
                family: "Arial", // Font family for tooltip body
                size: 14,
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.getUser();
    this.renderTeacherGenderChart();
  },
};
</script>
