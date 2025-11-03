import { api } from '@/services/api'

export const endPointService = {
  async getAll(endPoint: string) {
    const { data } = await api.get(endPoint)
    return data
  },

  async getById(endPoint: string, id: number) {
    const { data } = await api.get(`${endPoint}/${id}`)
    return data
  },

  async create<T>(endPoint: string, payload: T) {
    const { data } = await api.post(endPoint, payload)
    return data
  },

  async update<T>(endPoint: string, id: number, payload: T) {
    const { data } = await api.patch(`${endPoint}/${id}`, payload)
    return data
  },

  async remove(endPoint: string, id: number) {
    const { data } = await api.delete(`${endPoint}/${id}`)
    return data
  },
}
