import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

//GET TERMS BY LANGUAGE
export const getTermsByLanguage = (language) => {
  const response = axios.get(`${apiUrl}/terms/${language}/all`);
  return response;
};

//GET ALL LANGUAGES
export const getAllLanguages =async () => {
  const response =await axios.get(`${apiUrl}/languages`);
  return response;
};
