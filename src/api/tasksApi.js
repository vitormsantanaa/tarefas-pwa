import apiClient from './config.js'

const tasksApi = {
  getAll() {
    return apiClient.get('/tasks')
  },

  create(data) {
    return apiClient.post('/tasks', {
      title: typeof data === 'string' ? data : data.title,
      img_attachment_key: data?.imgAttachmentKey || null,
    })
  },

update(id, data) {
  return apiClient.patch(`/tasks/${id}`, {
    title: data.title,
    img_attachment_key: data.imgAttachmentKey,
  })
  },

  remove(id) {
    return apiClient.delete(`/tasks/${id}`)
  },

  uploadImage(file, description = '') {
    const formData = new FormData()
    formData.append('file', file)
    if (description) formData.append('description', description)
    return apiClient.post('/uploads/images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default tasksApi