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
  const payload = {}
  if (data.title !== undefined) payload.title = data.title
  if (data.imgAttachmentKey !== undefined) payload.img_attachment_key = data.imgAttachmentKey
  if (data.done !== undefined) payload.done = data.done

  return apiClient.patch(`/tasks/${id}`, payload)
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