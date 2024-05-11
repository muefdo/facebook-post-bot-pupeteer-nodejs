const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

(async () => {
  try {
    let sentenceList = ['TEST POST AUTOMATED BY MUEFDO by bradi.tech'];
    const imageUrl =
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    const browser = await puppeteer.launch({
      // headless: false,
      slowMo: 20,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000000);
    await page.setViewport({ width: 1000, height: 600 });
    await page.goto('https://www.facebook.com');
    console.log('Loggining in...');

    await page.waitForSelector('#email');
    await page.type('#email', 'mail@gmail.com');
    await page.type('#pass', 'YOURPASSWORD');
    await page.click(`[type="submit"]`);

    await page.waitForNavigation();

    const viewport = await page.viewport();
    console.log('Login sucess');

    // Calculate the middle coordinates of the viewport
    const middleX = viewport.width / 2;
    const middleY = viewport.height / 2;

    // Click on the middle of the screen
    await page.mouse.click(middleX, middleY);
    await page.mouse.click(middleX, middleY);

    console.log('Clicked for avoiding black layer.');
    // Wait for the element to be visible

    await page.waitForSelector('div[aria-label="Bir gönderi oluştur"]');

    // Click on the span inside the div
    await page.click('div[aria-label="Bir gönderi oluştur"] span');

    console.log('Clicked for pop up.');

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Wait for the image to be visible on the page

    for (let j = 0; j < sentenceList.length; j++) {
      let sentence = sentenceList[j];
      for (let i = 0; i < sentence.length; i++) {
        await page.keyboard.press(sentence[i]);
        if (i === sentence.length - 1) {
          await page.keyboard.down('Control');
          await page.keyboard.press(String.fromCharCode(13)); // character code for enter is 13
          await page.keyboard.up('Control');

          console.log('Text written.');
        }
      }
    }

    // Click on the image
    await page.waitForSelector('div[aria-label="Fotoğraf/video"]');
    await page.click('div[aria-label="Fotoğraf/video"]');

    // Download image to a file
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const imagePath = 'temp_image.jpg';
    fs.writeFileSync(imagePath, response.data);

    // Select the file input element
    // const fileInput = await page.$('input[type=file]');

    const divElement = await page.$(
      '.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xurb0ha.x1sxyh0.x1gslohp.x12nagc.xzboxd6.x14l7nz5'
    );

    // Find the input inside the div
    await page.waitForSelector('input[type=file]');
    const inputElement = await divElement.$('input[type=file]');

    // Upload the file
    let res = await inputElement.uploadFile(imagePath);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await page.waitForSelector('div[aria-label="Paylaş"]');

    await page.click(`[aria-label="Paylaş"]`);

    console.log('Successfully Posted.');

    fs.unlinkSync(imagePath);
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
