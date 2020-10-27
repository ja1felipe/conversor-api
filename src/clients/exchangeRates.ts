import { InternalError } from '../utils/errors/internal-error';
import config, { IConfig } from 'config';
import axios from 'axios';
import logger from '../logger';
export interface ExchangeRatesResponseRates {
  [key: string]: number;
  CAD: number;
  HKD: number;
  ISK: number;
  PHP: number;
  DKK: number;
  HUF: number;
  CZK: number;
  GBP: number;
  RON: number;
  SEK: number;
  IDR: number;
  INR: number;
  BRL: number;
  RUB: number;
  HRK: number;
  JPY: number;
  THB: number;
  CHF: number;
  EUR: number;
  MYR: number;
  BGN: number;
  TRY: number;
  CNY: number;
  NOK: number;
  NZD: number;
  ZAR: number;
  USD: number;
  MXN: number;
  SGD: number;
  AUD: number;
  ILS: number;
  KRW: number;
  PLN: number;
}

export interface ExchangeRatesResponse {
  readonly rates: ExchangeRatesResponseRates;
  readonly base: string;
  readonly date: string;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to comunicates with ExchangeRates`;
    super(`${internalMessage}: ${message}`);
  }
}

export class ExchangeRatesError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error throw by ExchangeRatesAPI`;
    super(`${internalMessage}: ${message}`);
  }
}

const exchangeRatesConfig: IConfig = config.get('App.resources.exchangeRates');
export class ExchangeRates {
  constructor(protected request = axios) {}

  public async fetchRates(currency: string): Promise<ExchangeRatesResponse> {
    try {
      const response = await this.request.get<ExchangeRatesResponse>(
        `${exchangeRatesConfig.get('apiURI')}/latest?base=${currency}`
      );
      return response.data;
    } catch (error) {
      logger.error(error);
      if (error.response && error.response.status) {
        throw new ExchangeRatesError(
          `Error: ${error.message.data} Code: ${error.response.status}`
        );
      }
      throw new ClientRequestError(error.message);
    }
  }
}
