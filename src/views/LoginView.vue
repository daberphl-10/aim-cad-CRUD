<template>
    <div>
        <h1>Login Page</h1>
        <input type="text" placeholder="Email" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <button type="button" @click="login()">Log in</button>
        <button type="button" @click="signUp()">Sign up</button>
    </div>
</template>

<script>

import axios from 'axios';
import { inject } from 'vue';

export default {

    data() {
        return {
            baseUrl: inject('baseUrl'),
            email: "",
            password: ""
        }
    },
    methods: {

        async login() {
            try {
                const response = await axios.post(
                    `${this.baseUrl}/login`,
                    {
                        email: this.email,
                        password: this.password
                    },
                    { headers: { Accept: 'application/json' } }
                );

                // Expecting { token, user } on success
                if (response?.data?.token) {
                    // Store both keys so other parts of the app can find the token
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('auth_token', response.data.token);
                    if (response.data.user) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        localStorage.setItem('user_id', response.data.user.id);
                    }
                    this.$router.push('/main');
                } else {
                    const msg = response?.data?.message || 'Login failed: unexpected response from server.';
                    if (this.$swal) this.$swal({ icon: 'error', title: 'Login failed', text: msg });
                    else alert(msg);
                }
            } catch (error) {
                // axios error handling — surface Laravel validation messages (422)
                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data || {};

                    if (status === 422) {
                        // Laravel validation errors are in data.errors
                        const errors = data.errors || data;
                        let message = '';
                        if (errors && typeof errors === 'object') {
                            try {
                                message = Object.values(errors)
                                    .flat()
                                    .join('\n');
                            } catch (e) {
                                message = JSON.stringify(errors);
                            }
                        } else {
                            message = data.message || 'Validation error';
                        }
                        if (this.$swal) this.$swal({ icon: 'error', title: 'Validation error', text: message });
                        else alert(message);
                    } else {
                        const msg = data.message || `Request failed with status ${status}`;
                        if (this.$swal) this.$swal({ icon: 'error', title: 'Login failed', text: msg });
                        else alert(msg);
                    }
                } else {
                    // Network / no response
                    if (this.$swal) this.$swal({ icon: 'error', title: 'Network error', text: error.message });
                    else alert(error.message);
                }
            }
        },

        signUp() {
            this.$router.push('/register');
        }
        }
    }
</script>