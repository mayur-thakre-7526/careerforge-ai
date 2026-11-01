const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewReport.model.js");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterViewReportController(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription?.trim()) {
      return res.status(400).json({
        message: "Job description is required.",
      });
    }

    if (!req.file && !selfDescription?.trim()) {
      return res.status(400).json({
        message: "Please upload a resume or provide a self-description.",
      });
    }

    let resumeText = "";

    if (req.file) {
      // 1. Validate file type
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Please upload a valid PDF resume.",
        });
      }

      // 2. Validate file buffer
      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({
          message: "Uploaded resume file is empty or invalid.",
        });
      }

      // 3. Extract text from PDF
      const pdfParser = new pdfParse.PDFParse({
        data: new Uint8Array(req.file.buffer),
      });

      try {
        const parsedPdf = await pdfParser.getText();
        resumeText = parsedPdf.text || "";
      } finally {
        await pdfParser.destroy();
      }

      // 4. Validate extracted text
      if (!resumeText.trim()) {
        return res.status(400).json({
          message:
            "Could not extract text from the uploaded PDF. Please upload a text-based PDF.",
        });
      }
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    return res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Generate interview report error:", error);

    return res.status(500).json({
      message: "Failed to generate interview report.",
    });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
