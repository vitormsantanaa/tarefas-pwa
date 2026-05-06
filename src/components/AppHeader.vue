<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="app-header">
    <h1>Tarefas</h1>

    <nav>
      <router-link to="/">Início</router-link>
      <router-link to="/about">Sobre</router-link>

      <span
        v-if="authStore.userEmail"
        class="user-email"
      >
        {{ authStore.userEmail }}
      </span>


      <button
        v-if="authStore.isAuthenticated"
        class="logout-btn"
        @click="handleLogout"
      >
        Sair
      </button>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 2px solid #4a90d9;
  margin-bottom: 24px;
}

.app-header h1 {
  font-size: 1.4rem;
  color: #4a90d9;
}

nav {
  display: flex;
  gap: 16px;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

nav a.router-link-active {
  color: #4a90d9;
}


.user-email {
  font-size: 0.85rem;
  color: #333;
}

/* botão */
.logout-btn {
  padding: 6px 10px;
  border: none;
  background: #4a90d9;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
</style>
