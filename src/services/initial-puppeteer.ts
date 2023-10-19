import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

// Interface
import { IPayloadArray } from 'interfaces/TypesArrayPayload';
import { IService } from 'interfaces/ServiceInteface';

class InitialPuppeteer {
  constructor() {}

  public async startService(url: IService): Promise<Page> {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      const allPages = await browser.pages();
      allPages[0].close();

      await page.goto(url);

      if (!page) return reject(' Ocorreu algum erro ao exibir essa página ');

      return resolve(page);
    });
  }

  public GenerateFile(payload: Array<IPayloadArray>, file: string) {
    const pathTemp = 'tmp';

    if (!fs.existsSync(path.resolve(pathTemp))) {
      fs.mkdirSync(path.resolve(pathTemp));
      console.log('pasta criada! ');
    }

    const csv = payload.map((p: IPayloadArray) => {
      return `${p.link};${p.title};${p.data}`
    })

    const csvHeader = `Link;Titulo;Data\n`;
    const csvContent = `${csvHeader}${csv.join('\n')}`

    console.log(csvContent)

    try{

      fs.writeFileSync(`${path.resolve(pathTemp , file)}.csv` , csvContent);
      console.log(" Arquivo criado com sucesso! ");

    }catch(err){
       throw new Error(' Ocorreu um erro ao criar o arquivo! ')
    }
  }


}

export const StarServicePage = new InitialPuppeteer();
