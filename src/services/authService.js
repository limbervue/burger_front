import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
//////////////////////////////////////////////////////cambiar contraseña
export const updatePassword = async (actualPassword, newPassword, token) => {
    try {
        const response = await axios.put(
            `${apiUrl}/update-password`,
            { actualPassword, newPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error)
        throw error // Propaga el error para manejarlo en el componente
    }
}
