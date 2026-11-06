import {
  generateInterviewReport,
  getAllReports,
  generateInterviewReportById, generateResumePdf
} from "../services/interview.ai";

import { useContext, useCallback } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);

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

  // Generate a new interview report -> { report, error }
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
        // List ko bhi foran update karo taake dashboard par naya report dikhe
        setReports((prev) => (Array.isArray(prev) ? [interviewReport, ...prev] : prev));
      }

      return {
        report: interviewReport,
        error: interviewReport ? null : "Report could not be generated. Please try again.",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 504
          ? "The AI took too long to respond. Please try again."
          : error.response
          ? "Report could not be generated. Please try again."
          : "Unable to reach the server. Check your connection and try again.");
      console.error("Error generating interview report:", message);
      return { report: null, error: message };
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