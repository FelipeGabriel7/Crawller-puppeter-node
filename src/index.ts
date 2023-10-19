import { CrawlerCorinthians } from 'controller/controller-corinthians.controller';
import { CrawlerPalmeiras } from 'controller/controller-palmeiras.controller';

class Initial {
  constructor() {
    this._init();
  }

  private _init() {
    console.log(' Fui iniciado com sucesso ! ');
    // new CrawlerPalmeiras().init();
    new CrawlerCorinthians().initial();
    new CrawlerPalmeiras().init();
  }
}

new Initial();
