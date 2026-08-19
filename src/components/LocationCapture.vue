<script setup>
import { onMounted, watch } from 'vue'
import { useGeolocation } from '@/composables/useGeolocation'

const emit = defineEmits(['captured'])

const {
  isSupported,
  loadingLocation,
  locationError,
  location,
  readPermissionState,
  requestCurrentLocation,
} = useGeolocation()

onMounted(() => {
  readPermissionState()
})

watch(location, (newLocation) => {
  emit('captured', newLocation)
})

async function handleCapture() {
  await requestCurrentLocation()
}
</script>

<template>
    <div class="location-capture">
        <button
            type="button"
            :disabled="loadingLocation"
            @click="handleCapture"
        >
            {{ loadingLocation ? 'Obtendo localização...' : 'Capturar localização' }}
        </button>

        <p v-if="locationError" class="location-error">
            {{ locationError }}
        </p>

        <div v-if="location" class="location-info">
            <p>Latitude: {{ location.latitude.toFixed(6) }}</p>
            <p>Longitude: {{ location.longitude.toFixed(6) }}</p>
            <p v-if="location.accuracy">Precisão: {{ Math.round(location.accuracy) }} m</p>
        </div>

        <p v-if="!isSupported" class="location-warning">
            Este dispositivo não oferece suporte à geolocalização.
        </p>
    </div>
</template>

<style scoped>
.location{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.location-error {
    color: #c0392b;
}
.location-warning {
    color: #7f8c8d;
    font-size: 0.9rem;
}
</style>