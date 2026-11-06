import {
  generateInterviewReport,
  getAllReports,
  generateInterviewReportById, generateResumePdf
} from "../services/interview.ai";

import { useContext, useEffect, useCallback } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router-dom";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error(
      "useInterview must be used within the InterviewProvider"
    );
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
  } = context;

  // Generate a new interview report
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
    title,
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
        title,
      });

      const interviewReport = response?.interviewReport ?? null;

      if (interviewReport) {
        setReport(interviewReport);
      }

      return interviewReport;
    } catch (error) {
      console.error(
        "Error generating interview report:",
        error.response?.data?.message || error.message
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get one report by ID
  const getReportById = useCallback(async (id) => {
    if (!id) return null;

    setLoading(true);

    try {
      const response = await generateInterviewReportById(id);

      console.log("Single Report Response:", response);

      const interviewReport = response?.interviewReport ?? null;

      setReport(interviewReport);

      return interviewReport;
    } catch (error) {
      console.error(
        "Error fetching interview report:",
        error.response?.data?.message || error.message
      );

      setReport(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReport]);

  // Get all reports
  const getReports = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getAllReports();

      console.log("All Reports Response:", response);

      // Backend response mein reports ki actual property verify karein
      const allReports =
        response?.interviewReports ??
        response?.reports ??
        [];

      setReports(Array.isArray(allReports) ? allReports : []);

      return Array.isArray(allReports) ? allReports : [];
    } catch (error) {
      console.error(
        "Error fetching all reports:",
        error.response?.data?.message || error.message
      );

      setReports([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReports]);

  // create resume pdf
  // Success par null, fail hone par error message return karta hai
  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      return null;
    } catch (error) {
      // responseType "blob" hai, is liye error ka JSON bhi blob mein aata hai
      let message = "Could not download the resume PDF. Please try again.";
      const data = error.response?.data;
      try {
        if (data instanceof Blob) {
          const parsed = JSON.parse(await data.text());
          if (parsed?.message) message = parsed.message;
        } else if (data?.message) {
          message = data.message;
        }
      } catch (_) {
        if (error.response?.status === 504) {
          message = "PDF generation timed out. Please try again.";
        }
      }
      console.error("Resume PDF error:", message);
      return message;
    } finally {
      setLoading(false);
    }
  };
  // Automatically fetch report based on URL
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId, getReportById, getReports]);

  return {
    loading,
    report,
    reports,
    getReports,
    getReportById,
    generateReport,
    getResumePdf
  };
};