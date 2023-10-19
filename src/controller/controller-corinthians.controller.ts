import { StarServicePage } from 'services/initial-puppeteer';

// Interfaces
import { IPayloadArray } from 'interfaces/TypesArrayPayload';

export class CrawlerCorinthians {
  constructor() {}

  public async initial() {
    try {
      const page = await StarServicePage.startService(
        'https://www.corinthians.com.br/noticias',
      );

      const selectorPage = '.ct-news-list .ct-news-list-item';
      await page.waitForSelector(selectorPage);

      const nodeSelectorPage = await page.$$(selectorPage);
      const payloadItems: Array<IPayloadArray> = [];

      for (let node of nodeSelectorPage) {
        const link = await page.evaluate((el: Element) => {
          return el
            .querySelector('.ct-news-list-item-content a')
            ?.getAttribute('href');
        }, node);

        const title = await page.evaluate((el: Element) => {
          return el
            .querySelector('.ct-news-list-item-content a h4')
            ?.innerHTML.replace(/-/g, '')
            .replace(/\n/g, '')
            .replace(/<p>.*?<\/p>/g, '')
            .trim();
        }, node);

        const data = await page.evaluate((el: Element) => {
          return el
            .querySelector('.ct-news-list-item-content a h4 p')
            ?.innerHTML.replace(/<strong>.*?<\/strong>/g, '')
            .replace('-', '')
            .replace(/\n/g, '')
            .replace(/<p>.*?<\/p>/g, '')
            .trim();
        }, node);

        if (!link || !data || !title)
          return new Error(' Ocorreu um erro ao buscar essas informações');

        payloadItems.push({
          link,
          title,
          data,
        });
      }

      StarServicePage.GenerateFile(payloadItems, '_corinthiansCrawler');
      page.close();
    } catch (error) {
      console.log(error);
    }
  }
}
