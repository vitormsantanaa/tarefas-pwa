<template>
  <button
    v-if="installEvent"
    @click="installPwa"
    class="install-btn"
  >
    📥 Instalar Aplicativo
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const installEvent = ref(null);

// Escuta o evento do navegador que avisa que o app pode ser instalado
const handleBeforeInstallPrompt = (e) => {
  e.preventDefault(); // Impede o popup padrão do navegador imediatamente
  installEvent.value = e; // Salva o evento para disparar no clique do botão
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

// Função que é chamada ao clicar no botão
const installPwa = async () => {
  if (!installEvent.value) return;

  // Mostra o prompt de instalação do navegador
  installEvent.value.prompt();

  // Espera a escolha do usuário (se aceitou ou recusou)
  const { outcome } = await installEvent.value.userChoice;
  console.log(`Usuário respondeu à instalação: ${outcome}`);

  // Limpa o evento para o botão sumir após a escolha
  installEvent.value = null;
};
</script>

<style scoped>
.install-btn {
  background-color: #4a90d9;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: block;
  margin: 15px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.install-btn:hover {
  background-color: #357abd;
}

.install-btn:active {
  transform: scale(0.98);
}
</style>
