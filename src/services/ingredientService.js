import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
export const getIngredientService = async (token) => {
    try {
        const response = await axios.get(`${apiUrl}/ingredients`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error fethcing ingredients:', error)
        throw error
    }
}
export const updateIngredientService = async (id, data, token) => {
    try {
        const response = await axios.put(`${apiUrl}/ingredient/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error updated ingredient:', error)
        throw error
    }
}
