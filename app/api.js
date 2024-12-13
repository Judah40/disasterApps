import axios from "axios";

const apiUrl = "https://drr.southafricanorth.cloudapp.azure.com/api/v1";

//GET TERMS BY LANGUAGE
export const getTermsByLanguage = (language) => {
  const response = axios.get(`${apiUrl}/terms/${language}/all`);
  return response;
};

//GET ALL LANGUAGES
export const getAllLanguages = async () => {
  console.log(apiUrl);
  const response = axios.get(`${apiUrl}/languages/`);
  return response;
};

//DOWNLOAD ALL LANGUAGES
export const downloadAllLanguages = async (language) => {
  const response = await axios.get(
    `${apiUrl}/terms/${language}/download-texts`
  );
  return response;
};
