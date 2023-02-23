import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

const getMeishiImage = async (): Promise<Buffer | string> => {
  try {
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();

      await page.goto(`http://localhost:3000/meishi`);
      await page.waitForSelector(".meishi-frame");
      const clip = await page.evaluate((s) => {
        const clientRect = document.querySelector(s)?.getBoundingClientRect();
        if (clientRect) {
          return {
            x: clientRect.left,
            y: clientRect.top,
            width: clientRect.width,
            height: clientRect.height,
          };
        } else {
          return { x: 0, y: 0, width: 0, height: 0 };
        }
      }, ".meishi-frame");
      return await page.screenshot({
        clip: clip,
        type: "png",
        omitBackground: true,
      });
    } catch (err) {
      console.log(err);
    } finally {
      browser.close();
    }
  } catch (err) {
    console.log(err);
  }
  return "Meishi generation failed";
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const image = await getMeishiImage();
  if (typeof image === "string") {
    res.status(500);
  } else {
    res.status(200).setHeader("Content-Type", "image/png");
  }
  res.send(image);
};

export default handler;
