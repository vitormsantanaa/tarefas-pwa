<script setup>
import { onMounted, watch } from 'vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { useReverseGeocode } from '@/composables/useReverseGeocode'
import { buildLocationPayload } from '@/utils/location.js'

const emit = defineEmits(['captured'])
const { address, loadingAddress, addressError, fetchAddress } = useReverseGeocode()

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

watch(location, async (newLocation) => {
  if (!newLocation) {
    emit('captured', buildLocationPayload(null))
    return
  }

  // Busca o endereço no Nominatim / Cache antes de emitir
  await fetchAddress(newLocation.latitude, newLocation.longitude)

  // Monta o payload padronizado com coordenadas e rótulo do endereço
  const payload = buildLocationPayload({
    latitude: newLocation.latitude,
    longitude: newLocation.longitude,
    accuracy: newLocation.accuracy,
    timestamp: newLocation.timestamp,
    label: address.value,
  })

  emit('captured', payload)
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

      <p v-if="loadingAddress" class="location-loading">Buscando endereço...</p>
      <div v-else-if="address">
        <p class="location-address">{{ address }}</p>
        <small class="location-hint">* Endereço aproximado</small>
      </div>
    </div>

    <p v-if="addressError" class="location-error">
      {{ addressError }}
    </p>

    <p v-if="!isSupported" class="location-warning">
      Este dispositivo não oferece suporte à geolocalização.
    </p>
  </div>
</template>

<style scoped>
.location-capture {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.location-capture button[type='button'] {
  align-self: flex-start;
  padding: 0.55rem 1.1rem;
  background-color: #4a90d9;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.location-capture button[type='button']:hover:not(:disabled) {
  background-color: #3a7bc0;
}

.location-capture button[type='button']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.location-error {
  margin: 0;
  padding: 0.5rem 0.75rem;
  background-color: #fdecea;
  color: #c0392b;
  border-left: 3px solid #c0392b;
  border-radius: 4px;
  font-size: 0.85rem;
}

.location-warning {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.85rem;
  font-style: italic;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #334155;
}

.location-info p {
  margin: 0;
}

.location-address {
  font-weight: 500;
  color: #1e293b;
}

.location-loading {
  font-style: italic;
  color: #64748b;
}

.location-hint {
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
}
</style>