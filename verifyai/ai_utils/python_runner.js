const { spawn } = require('child_process');

exports.runPythonDetection = (filePath, ext) => {
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['--version']);

    process.stdout.on('data', data => {
      console.log(`Python version used by Node: ${data}`);
    });

    process.on('close', () => {
      const py = spawn('python3', ['ai_utils/python_runner.py', filePath, ext]);

      let output = '';
      py.stdout.on('data', data => output += data);
      py.stderr.on('data', err => console.error(`stderr: ${err}`));

      py.on('close', code => {
        if (code === 0) {
          resolve(JSON.parse(output));
        } else {
          reject(new Error('Python script failed'));
        }
      });
    });
  });
};
