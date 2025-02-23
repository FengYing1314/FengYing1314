const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 设置视口大小，确保内容完全显示（每行两个卡片，总宽度约 710px + 边距）
  await page.setViewport({ width: 1000, height: 400 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; align-items: center; min-height: 400px;">
        <div style="display: flex; align-items: center; background: #ffffff; border-radius: 40px; padding: 20px; width: 350px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="margin-right: 20px;">
            <a href="https://github.com/YumeYuka">
              <img src="https://github.com/YumeYuka.png" alt="YumeYuka" width="100" height="100" style="border-radius: 50%;">
            </a>
          </div>
          <div style="text-align: left;">
            <h3 style="margin: 0; font-size: 20px;">YumeYuka</h3>
            <p style="margin: 10px 0; color: #666; font-size: 16px;">梦——それは现実の続き； 现実——それは梦の终わり.</p>
          </div>
        </div>

        <div style="display: flex; align-items: center; background: #ffffff; border-radius: 40px; padding: 20px; width: 350px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="margin-right: 20px;">
            <a href="https://github.com/MoWei-2077">
              <img src="https://github.com/MoWei-2077.png" alt="MoWei-2077" width="100" height="100" style="border-radius: 50%;">
            </a>
          </div>
          <div style="text-align: left;">
            <h3 style="margin: 0; font-size: 20px;">MoWei</h3>
            <p style="margin: 10px 0; color: #666; font-size: 16px;">A 16-year-old high school student.</p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `);

  // 调整截图尺寸（宽度 1000px，高度 500px）
  await page.screenshot({ path: 'friends_layout.png', width: 1000, height: 500 });
  await browser.close();
})();