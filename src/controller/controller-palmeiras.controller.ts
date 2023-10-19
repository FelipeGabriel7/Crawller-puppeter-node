import { StarServicePage } from 'services/initial-puppeteer';

// Interfaces
import { IPayloadArray } from 'interfaces/TypesArrayPayload';

export class CrawlerPalmeiras {
  constructor() {}

  public async init() {
    try {
      const page = await StarServicePage.startService(
        'https://www.palmeiras.com.br/central-de-midia/noticias/',
      );

      const selector = '.central-de-midia-container .items-central';
      await page.waitForSelector(selector);

      const nodesSelector = await page.$$(selector);
      const payload: Array<IPayloadArray> = [];

      for (let node of nodesSelector) {
        const link = await page.evaluate((el: Element) => {
          return el.querySelector('a')?.getAttribute('href');
        }, node);

        const title = await page.evaluate((el: Element) => {
          return el.querySelector('.items-central-txt h4')?.innerText;
        }, node);

        const data = await page.evaluate((el: Element) => {
          return el.querySelector('.items-central-date')?.innerText;
        }, node);

        if (!link || !data || !title)
          return new Error('Ocorreu um erro ao buscar essas informações');

        payload.push({
          link,
          title,
          data,
        });
      }

      StarServicePage.GenerateFile(payload, '_PalmeirasCrawler');
      page.close();
    } catch (error) {
      console.log(error);
    }
    // 'https://www.palmeiras.com.br/central-de-midia/noticias/'
  }
}
