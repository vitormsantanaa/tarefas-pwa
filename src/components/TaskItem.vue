<template>
  <div class="task-item" :class="{ done: task.done }">
    <div class="task-main">
      <img
        v-if="task.img_url"
        :src="task.img_url"
        class="task-thumbnail"
        alt="Imagem da tarefa"
      />
      <label class="task-label">
        <input type="checkbox" :checked="task.done" @change="$emit('toggle', task.id)" />
        <span class="task-title">{{ task.title }}</span>
      </label>
      <div class="task-actions">
        <button class="task-edit" @click="$emit('edit', task)">Editar</button>
        <button class="task-remove" @click="$emit('remove', task.id)">Remover</button>
      </div>
    </div>

    <!-- Seção de Localização (Rótulo + Mapa Leaflet) -->
    <div v-if="task.latitude && task.longitude" class="task-location">
      <p v-if="task.location_label" class="task-location-label">
        📍 {{ task.location_label }}
      </p>

      <TaskLocationMap
        :location="{
          latitude: Number(task.latitude),
          longitude: Number(task.longitude),
          accuracy: Number(task.geolocation_accuracy ?? 0),
          label: task.location_label
        }"
      />
    </div>
  </div>
</template>

<script setup>
import TaskLocationMap from './TaskLocationMap.vue'

defineProps({
  task: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle', 'remove', 'edit'])
</script>

<style scoped>
.task-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;
  gap: 10px;
}

.task-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.task-thumbnail {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  flex-shrink: 0;
}

.task-item.done {
  opacity: 0.6;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.task-label input[type='checkbox'] {
  width: 20px;
  height: 20px;
  accent-color: #4a90d9;
}

.task-title {
  font-size: 1rem;
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.task-remove {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-remove:hover {
  text-decoration: underline;
}

.task-edit {
  background: none;
  border: none;
  color: #4a90d9;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-edit:hover {
  text-decoration: underline;
}

.task-location {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
  width: 100%;
}

.task-location-label {
  margin: 0 0 6px 0;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}
</style>