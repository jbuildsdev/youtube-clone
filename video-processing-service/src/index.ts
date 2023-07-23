import express from "express";
import Ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    res
      .status(400)
      .send(
        `inputFilePath: ${inputFilePath}, outputFilePath: ${outputFilePath}`
      );
    return;
  }

  const logger = {
    debug: console.log, // Log debug messages to the console
    info: console.log,
    warn: console.warn,
    error: console.error,
  };

  const ffmpegCommand = Ffmpeg(inputFilePath, { logger })
    .outputOptions("-vf", "scale=-1:360") //360p
    .on("end", () => {
      res.status(200).send("Video processing started");
    })
    .on("error", (err, stdout, stderr) => {
      console.log(`An error occurred: ${err.message}`);
      console.log(`ffmpeg stdout: ${stdout}`);
      console.log(`ffmpeg stderr: ${stderr}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    });

  ffmpegCommand.save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video processing service running on ${port}`);
});
