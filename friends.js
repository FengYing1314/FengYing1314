const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 创建一个通用函数，用于读取本地头像图片并转换为base64
function getAvatarImageUrl(username) {
  const localImagePath = path.join(__dirname, 'Friend_avatar', `${username}.png`);
  const githubFallbackUrl = `https://github.com/${username}.png`;

  try {
    // 检查本地图片是否存在
    if (fs.existsSync(localImagePath)) {
      const imageBuffer = fs.readFileSync(localImagePath);
      return `data:image/png;base64,${imageBuffer.toString('base64')}`;
    } else {
      console.log(`本地图片不存在: ${localImagePath}，使用GitHub头像`);
      return githubFallbackUrl;
    }
  } catch (error) {
    console.error(`读取图片出错: ${error.message}`);
    return githubFallbackUrl;
  }
}

(async () => {
  // 从配置文件加载友链信息
  const friendsConfigPath = path.join(__dirname, 'friends.json');
  const friends = JSON.parse(fs.readFileSync(friendsConfigPath, 'utf-8'));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 930, height: 480 });

  // 动态生成HTML内容
  const friendsHtml = friends.map(friend => `
    <div class="friend-card">
      <div class="avatar-container">
        <a href="${friend.githubUrl}">
          <img class="avatar" src="${getAvatarImageUrl(friend.username)}" alt="${friend.name}">
        </a>
      </div>
      <div class="info">
        <h3 class="name">${friend.name}</h3>
        <p class="bio">${friend.bio}</p>
      </div>
      <div class="tag">${friend.relationship}</div>
    </div>
  `).join('');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
        
        body {
          font-family: 'Noto Sans SC', sans-serif;
          background: #ffffff;
          margin: 0;
          padding: 20px 10px; 
        }
        
        .container {
          display: flex;
          flex-wrap: wrap;
          gap: 45px; 
          justify-content: center;
          align-items: center;
          min-height: 400px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .friend-card {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 28px;
          padding: 24px;
          width: 320px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          position: relative;
          overflow: hidden;
        }
        
        .friend-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(to bottom, #ff8ba7, #ffc2d1);
          border-top-left-radius: 28px;
          border-bottom-left-radius: 28px;
        }
        
        .friend-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(255, 166, 183, 0.2);
        }
        
        .friend-card .tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background:rgba(255, 107, 137, 0.75);
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 5px 10px;
          border-radius: 12px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .avatar-container {
          margin-right: 22px;
          margin-left: 8px;
          position: relative;
          overflow: hidden;
        }
        
        .avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 5px 15px rgba(255, 182, 193, 0.2);
          transition: all 0.3s ease;
        }
        
        .friend-card:hover .avatar {
          transform: scale(1.05);
          border-color: #ff9eb5;
          box-shadow: 0 5px 15px rgba(255, 150, 170, 0.3); 
        }
        
        .info {
          text-align: left;
        }
        
        .name {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #ff6b88;
          position: relative;
          display: inline-block;
        }
        
        .bio {
          margin: 10px 0;
          color: #777;
          font-size: 15px;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${friendsHtml}
      </div>
    </body>
    </html>
  `);

  // 等待内容加载完成
  await page.evaluate(() => {
    document.fonts.ready;
  });

  // 获取页面内容的实际尺寸
  const boundingBox = await page.evaluate(() => {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  });

  const padding = 20;
  await page.setViewport({
    width: Math.ceil(boundingBox.width) + padding * 2,
    height: Math.ceil(boundingBox.height) + padding * 2
  });

  await page.screenshot({
    path: 'friends_layout.png',
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(boundingBox.width) + padding * 2,
      height: Math.ceil(boundingBox.height) + padding * 2
    }
  });

  await browser.close();
})();