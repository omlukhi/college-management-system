const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure upload/charts directory exists
const ensureReportDirs = () => {
  const chartsDir = path.join(__dirname, '..', 'uploads', 'charts');
  const pdfsDir = path.join(__dirname, '..', 'uploads', 'reports');
  if (!fs.existsSync(chartsDir)) fs.mkdirSync(chartsDir, { recursive: true });
  if (!fs.existsSync(pdfsDir)) fs.mkdirSync(pdfsDir, { recursive: true });
};

// Utility to run a Python script
const runPythonScript = (scriptName, args = []) => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, '..', '..', 'python', scriptName);
    const cmdArgs = args.join(' ');
    
    // Command: python path/to/script.py arg1 arg2
    const command = `python "${pythonPath}" ${cmdArgs}`;
    console.log(`Executing python command: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Python execution error: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        return reject({ message: error.message, details: stderr });
      }
      
      try {
        // Scripts will print a JSON string as their last line of stdout
        const lines = stdout.trim().split('\n');
        const jsonResult = JSON.parse(lines[lines.length - 1]);
        resolve(jsonResult);
      } catch (parseError) {
        resolve({ rawStdout: stdout, message: 'Script completed but did not return standard JSON.' });
      }
    });
  });
};

// 1. Get Python-generated Attendance Analysis
exports.getAttendanceAnalysis = async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) {
    return res.status(400).json({ success: false, message: 'Student ID is required.' });
  }

  ensureReportDirs();
  try {
    const result = await runPythonScript('attendance.py', [studentId]);
    res.json({ success: true, analysis: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to run python attendance analysis.', error });
  }
};

// 2. Get Python-generated Academic Marks Results Analysis
exports.getResultAnalysis = async (req, res) => {
  const { courseId, semester } = req.query;
  if (!courseId || !semester) {
    return res.status(400).json({ success: false, message: 'Course ID and Semester are required.' });
  }

  ensureReportDirs();
  try {
    const result = await runPythonScript('result.py', [courseId, semester]);
    res.json({ success: true, analysis: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to run python result analysis.', error });
  }
};

// 3. Trigger CSV/Excel Export (returns file path/download)
exports.exportCSV = async (req, res) => {
  const { table } = req.query; // e.g. "students", "teachers", "results"
  ensureReportDirs();
  try {
    const result = await runPythonScript('analytics.py', ['export', table || 'students']);
    res.json({ success: true, message: 'Export completed successfully.', fileUrl: result.fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Export failed.', error });
  }
};

// 4. Trigger PDF Report Generation (returns report card or general report file url)
exports.generatePDF = async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) {
    return res.status(400).json({ success: false, message: 'Student ID is required for generating report card PDF.' });
  }

  ensureReportDirs();
  try {
    const result = await runPythonScript('report.py', [studentId]);
    res.json({ success: true, message: 'PDF generated successfully.', fileUrl: result.fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'PDF Generation failed.', error });
  }
};
