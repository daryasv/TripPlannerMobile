import axios from "axios";
import { getToken } from "./security";
import { BASE_URL } from "./actionsConfig";


const CITIES_URL = BASE_URL + "/cities";

export const getCitiesToImages = async () => {
    try {
        const response = await axios.get(CITIES_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities data:', error);
        throw error;
    }
};