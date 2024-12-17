import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL

export const getIngredientsInvService = async (token) => {
    try {
        const response = await axios.get(`${apiUrl}/inventory`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error fetching ingredients:', error)
        throw error
    }
}

export const resetInventoryService = async (token) => {
    try {
        const response = await axios.put(
            `${apiUrl}/reset-inventory/`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error('Error reset inventory:', error)
        throw error
    }
}
