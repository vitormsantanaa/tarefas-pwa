<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/authApi'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleRegister = async () => {
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem'
    return
  }

  try {
    await register(email.value, password.value)

    router.push('/login?registered=true')
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail || 'Erro ao cadastrar'
  }
}
</script>

<template>
  <div>
    <h2>Criar conta</h2>

    <form @submit.prevent="handleRegister">
      <input v-model="email" type="email" placeholder="Email" required />

      <input v-model="password" type="password" placeholder="Senha" required />

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirmar senha"
        required
      />

      <p v-if="errorMessage">{{ errorMessage }}</p>

      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>
