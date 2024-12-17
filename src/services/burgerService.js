import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
////////////////////////////////////////////obtener las hamburguesas
export const getBurgersService = async (token) => {
    try {
        const response = await axios.get(`${apiUrl}/burgers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error fetching burgers:', error)
        throw error
    }
}
///////////////////////////////////guardar precio de las hamburguesas
export const updateBurgersService = async (id, price, token) => {
    try {
        const response = await axios.put(
            `${apiUrl}/burger/${id}`,
            { precio: price },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error('Error update price burger:', error)
        throw error
    }
}
