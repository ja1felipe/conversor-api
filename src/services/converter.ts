import { InternalError } from '../utils/errors/internal-error';
import { ExchangeRates } from '../clients/exchangeRates';
import logger from '../logger';

interface ConvertedInfos {
  convert_from_type: string;
  convert_from_value: number;
  convert_to_type: string;
  convert_to_value: number;
  conversion_rate: number;
}

export class ConverterProcessingError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error when processing converter: ${message}`);
  }
}
export class Converter {
  constructor(protected exchangeRates = new ExchangeRates()) {}

  public async convert(
    convert_from_type: string,
    convert_from_value: number,
    convert_to_type: string
  ): Promise<ConvertedInfos> {
    try {
      logger.info(`Fetching rates to currency: ${convert_from_type}`);
      const response = await this.exchangeRates.fetchRates(convert_from_type);
      const conversion_rate = response.rates[convert_to_type];
      const convert_to_value = Number(
        (convert_from_value * conversion_rate).toFixed(2)
      );
      return {
        convert_from_type,
        convert_from_value,
        convert_to_type,
        convert_to_value,
        conversion_rate
      };
    } catch (error) {
      logger.error(error);
      throw new ConverterProcessingError(error.message);
    }
  }
}
