import { ExchangeRates } from '../../clients/exchangeRates';
import exchangeRateBaseBRL from '../../../test/fixtures/exchangeRates_base_BRL.json';
import { Converter, ConverterProcessingError } from '../converter';
jest.mock('../../clients/exchangeRates');

describe('exchangeRates Client', () => {
  const mockedExchangeRatesClient = new ExchangeRates() as jest.Mocked<
    ExchangeRates
  >;
  it('should return the currency converted', async () => {
    const convert_from_type = 'BRL';
    const convert_from_value = 12;
    const convert_to_type = 'USD';

    mockedExchangeRatesClient.fetchRates.mockResolvedValue(exchangeRateBaseBRL);

    const converter = new Converter(mockedExchangeRatesClient);
    const conversion = await converter.convert(
      convert_from_type,
      convert_from_value,
      convert_to_type
    );

    const expectedResponse = {
      convert_from_type: 'BRL',
      convert_from_value: 12,
      convert_to_type: 'USD',
      convert_to_value: 2.15,
      conversion_rate: 0.1794949434
    };
    expect(conversion).toEqual(expect.objectContaining(expectedResponse));
  });

  it('should throw internal error when something go wrong', async () => {
    const convert_from_type = 'BRR';
    const convert_from_value = 12;
    const convert_to_type = 'USD';

    mockedExchangeRatesClient.fetchRates.mockRejectedValue(
      'Error when fetching data'
    );

    const converter = new Converter(mockedExchangeRatesClient);
    await expect(
      converter.convert(convert_from_type, convert_from_value, convert_to_type)
    ).rejects.toThrow(ConverterProcessingError);
  });
});
