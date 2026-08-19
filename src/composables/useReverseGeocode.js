import { ref } from 'vue'
import geocodingApi from '@/api/geocodingApi.js'

export function useReverseGeocode() {
  const address = ref(null)
  const loadingAddress = ref(false)
  const addressError = ref(null)

  async function fetchAddress(latitude, longitude) {
    loadingAddress.value = true
    addressError.value = null
    try {
      const result = await geocodingApi.reverse(latitude, longitude)
      address.value = result?.label ?? null
    } catch (err) {
      addressError.value = 'Não foi possível obter o endereço.'
      console.error(err)
    } finally {
      loadingAddress.value = false
    }
  }

  return { address, loadingAddress, addressError, fetchAddress }
}