import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});



export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
  title
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);
  formData.append("title", title);

  const response = await api.post("/api/interview/", formData);

  return response.data;
};

export const generateInterviewReportById = async (interviewId) => {
   
  const response = await api.get(`/api/interview/report/${interviewId}/`);

  return response.data;
};



export const getAllReports = async () => {
   
  const response = await api.get(`/api/interview/report/all`);

  return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}