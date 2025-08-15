import puppeteer from "puppeteer";

async function screenShotScrapper(url) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait and click cookie button
    const cookieButton = await page.waitForSelector(".cmplz-btn.cmplz-accept", { visible: true });
    await cookieButton.click();
    console.log("cookie showed up and clicked ");


    const bannerButton = await page.waitForSelector(".dialog-close-button", { visible: true });
    await bannerButton.click();
    console.log("banner showed up and clicked ");

    await page.waitForSelector(".joinchat__button", { visible: true });
    console.log("chat showed up");

    await page.evaluate(() => {
        window.scrollTo(0, 300);
    });


    setTimeout(async () => {
        await page.evaluate(() => {
            window.scrollTo(300, 0);
        });
        await page.waitForFunction(() => {
            const images = Array.from(document.querySelectorAll("ul.products img"));
            return images.length > 0 && images.every(img =>
                img.complete &&
                img.naturalHeight !== 0 &&
                window.getComputedStyle(img).visibility !== "hidden" &&
                window.getComputedStyle(img).display !== "none"
            );
        }, { timeout: 10000 });

        await page.screenshot({ path: "fullpage.png", fullPage: true });
        await browser.close()
        console.log("Screenshots taken");
    }, 3000)
}

screenShotScrapper("https://www.fangofood.com/");
