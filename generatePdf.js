const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:3000/'; // 替换为您的网站URL
  const docsUrl = `${baseUrl}/documents_tros/`; // 替换为您的文档页面URL
  
  await page.goto(docsUrl, { waitUntil: 'networkidle0' });

  const docs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    return links.map((link) => link.href);
  });

  const pdfOptions = {
    format: 'A4',
    printBackground: true,
  };

  for (const docUrl of docs) {
    await page.goto(docUrl, { waitUntil: 'networkidle0' });
    const title = await page.title();
    pdfOptions.path = `${title}.pdf`; // 根据文档的标题设置PDF文件名
    await page.pdf(pdfOptions);
  }

  await browser.close();

  console.log('PDF生成成功！');
})();