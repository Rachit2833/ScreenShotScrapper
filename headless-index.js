

/*
====================================================================
🚨 IMPORTANT: DO NOT USE HEADLESS MODE FOR DYNAMIC CONTENT WEBSITES
====================================================================
When capturing screenshots of websites with heavy lazy-loading, 
infinite scroll, or dynamic content (like FangoFood), ALWAYS use:

   main index.js file

This ensures Puppeteer renders and loads content exactly like a 
real user, avoiding missing images or incomplete elements.

Headless mode often skips certain animations, intersection 
observers, and lazy-loading triggers that only fire when the 
browser is visibly rendering content.
====================================================================
*/



import puppeteer from "puppeteer";

async function screenShotScrapper(url) {
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        
        try {
            const cookieButton = await page.waitForSelector(".cmplz-btn.cmplz-accept", {
                visible: true,
                timeout: 5000,
            });
            await cookieButton.click();
            console.log("✅ Cookie banner accepted.");
        } catch {
            console.log("ℹ️ No cookie banner found.");
        }

       
        try {
            const bannerButton = await page.waitForSelector(".dialog-close-button", {
                visible: true,
                timeout: 5000,
            });
            await bannerButton.click();
            console.log("✅ Promo banner closed.");
        } catch {
            console.log("ℹ️ No promo banner found.");
        }

       
        let lastHeight = await page.evaluate("document.body.scrollHeight");
        let scrollPosition = 0;
        const step = 300; // px
        console.log("⬇️ Starting slow scroll...");
        while (scrollPosition < lastHeight) {
            await page.evaluate(y => window.scrollBy(0, y), step);
            scrollPosition += step;
            await new Promise(r => setTimeout(r, 800)); 
            lastHeight = await page.evaluate("document.body.scrollHeight");
        }


        console.log("⬆️ Scrolling back up...");
        while (scrollPosition > 0) {
            await page.evaluate(y => window.scrollBy(0, -y), step);
            scrollPosition -= step;
            await new Promise(r => setTimeout(r, 500));
        }

        await page.waitForNetworkIdle({ idleTime: 1500, timeout: 10000 });
        await new Promise(r => setTimeout(r, 2000)); 


        await page.screenshot({ path: "screenshot.png", fullPage: true });
        console.log("📸 Screenshot saved with all images.");
    } catch (err) {
        console.error("❌ Error during screenshot process:", err);
    } finally {
        await browser.close();
        console.log("✅ Browser closed.");
    }
}

screenShotScrapper("https://www.fangofood.com/");
