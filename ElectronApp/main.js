const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
const fs = require("fs");
const filename = "./config/config.json";
const configurationPath = path.join(__dirname, filename);
const logFilePath = "./config/log.txt";
const logMessage = (message) => {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  win.loadFile("index.html");
};
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
//Send-Receive Data

const sendEmail2 = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        logMessage(JSON.stringify(info));
        resolve(info);
      }
    });
  });
};
const data = fs.readFileSync(configurationPath, "utf8");
const config = JSON.parse(data);
let subject = config.subject;
let text = config.text;
let transporter = nodemailer.createTransport({
  service: config.service,
  auth: { user: config.auth.user, pass: config.auth.pass },
  pool: true,
  maxConnections: 5,
  maxMessages: Infinity,
});

ipcMain.on("file-Data", async (event, fileData) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheetdata = await workbook.xlsx.load(fileData.data);
    const worksheet = sheetdata.worksheets[0];
    const emailRowData = [];

    worksheet.eachRow((row, rowNumers) => {
      if (rowNumers > 1) {
        let amount = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(row.getCell(2).text);
        let newsubject = subject.split("{amount}").join(amount);
        let name = row.getCell(1).text;
        let date = row.getCell(4).value.toLocaleDateString("en-IN");
        let textv1 = text.split("{name}").join(name);
        let textv2 = textv1.split("{amount}").join(amount);
        let textv3 = textv2.split("{date}").join(date);
        emailRowData.push({
          from: config.auth.user,
          to: row.getCell(3).text,
          cc: config.cc,
          subject: newsubject,
          text: textv3,
        });
      }
    });
    emailRowData.forEach((data) => {
      sendEmail2(data);
    });
    event.reply("response-Data", emailRowData);
  } catch (error) {
    console.log(error);
  }
});
