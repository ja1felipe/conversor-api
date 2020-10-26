import { ExchangeRates } from '../exchangeRates';
import axios from 'axios';
import exchangeRateBaseBRL from '../../../test/fixtures/exchangeRates_base_BRL.json';
jest.mock('axios');

describe('Exchangerates client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('should return return exchange informations from ExchageRatesApi', async () => {
    const currency = 'BRL';

    mockedAxios.get.mockResolvedValue({ data: exchangeRateBaseBRL });

    const exchangeRates = new ExchangeRates(mockedAxios);
    const response = await exchangeRates.fetchRates(currency);
    expect(response).toEqual(exchangeRateBaseBRL);
  });

  it('should return a unexpected error', async () => {
    const currency = 'BRL';

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

    const exchangeRates = new ExchangeRates(mockedAxios);

    await expect(exchangeRates.fetchRates(currency)).rejects.toThrow(
      'Unexpected error when trying to comunicates with ExchangeRates: Network Error'
    );
  });
});
