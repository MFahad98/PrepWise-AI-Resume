import axios from "axios";
 
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export default api;




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

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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