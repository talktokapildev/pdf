const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();

var corsOptions = {
  origin: 'https://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));


app.listen(3200, () => {
  console.log('Server started!');
});



app.route('/api/pdfContent').post((req, res) => {


  (async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()


    await page.goto("data:text/html," + req.body.html, { waitUntil: 'networkidle0' });
    const buffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: '<span style="font-size: 5px; width: 100%; height: 10px; color: #F8F8F8; margin: 2px;">custom Header <span class="title" style="font-size: 10px; text-align: center;display:table;margin: auto"></span> </span>',
      footerTemplate: '<span style="font-size: 5px; width: 100%; height: 10px; color: #F8F8F8; margin: 2px;">custom Footer <span>Page </span><span class="pageNumber"></span> of <span class="totalPages"></span></span>',
      margin: {
        top: '70px',
        bottom: '200px',
        right: '10px',
        left: '10px'
      }
    });


    res.type('application/pdf')
    res.send(buffer)
    browser.close()
  })()

});


