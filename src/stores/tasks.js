import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import tasksApi from '../api/tasksApi.js'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  const pendingTasks = computed(() => tasks.value.filter((t) => !t.done))
  const completedTasks = computed(() => tasks.value.filter((t) => t.done))

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const response = await tasksApi.getAll()
      tasks.value = response.data
    } catch (err) {
      error.value = 'Erro ao carregar tarefas.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addTask(payload) {
    if (!payload.title?.trim()) return
    error.value = null
    try {
      // Mapeia os dados garantindo a chave correta para o backend
      const taskData = {
        title: payload.title.trim(),
        img_attachment_key: payload.imgAttachmentKey ?? null,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        geolocation_accuracy: payload.geolocation_accuracy ?? null,
        geolocation_timestamp: payload.geolocation_timestamp ?? null,
        location_label: payload.location_label ?? null,
      }

      const response = await tasksApi.create(taskData)
      tasks.value.push(response.data)
    } catch (err) {
      error.value = 'Erro ao adicionar tarefa.'
      console.error(err)
    }
  }

  async function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    error.value = null
    try {
      const response = await tasksApi.update(id, { done: !task.done })
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) tasks.value[index] = response.data
    } catch (err) {
      error.value = 'Erro ao atualizar tarefa.'
      console.error(err)
    }
  }

  async function removeTask(id) {
    error.value = null
    try {
      await tasksApi.remove(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (err) {
      error.value = 'Erro ao remover tarefa.'
      console.error(err)
    }
  }

  async function updateTask(id, payload = {}) {
    if (payload.title !== undefined && !payload.title.trim()) return
    error.value = null

    const dataToUpdate = {}
    if (payload.title !== undefined) dataToUpdate.title = payload.title.trim()
    if (payload.imgAttachmentKey !== undefined) dataToUpdate.img_attachment_key = payload.imgAttachmentKey
    if (payload.latitude !== undefined) dataToUpdate.latitude = payload.latitude
    if (payload.longitude !== undefined) dataToUpdate.longitude = payload.longitude
    if (payload.geolocation_accuracy !== undefined) dataToUpdate.geolocation_accuracy = payload.geolocation_accuracy
    if (payload.geolocation_timestamp !== undefined) dataToUpdate.geolocation_timestamp = payload.geolocation_timestamp
    if (payload.location_label !== undefined) dataToUpdate.location_label = payload.location_label

    try {
      const response = await tasksApi.update(id, dataToUpdate)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) tasks.value[index] = response.data
    } catch (err) {
      error.value = 'Erro ao editar tarefa.'
      console.error(err)
    }
  }

  return {
    tasks,
    loading,
    error,
    pendingTasks,
    completedTasks,
    fetchTasks,
    addTask,
    toggleTask,
    removeTask,
    updateTask,
  }
})