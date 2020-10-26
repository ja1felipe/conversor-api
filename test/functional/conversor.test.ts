import { Conversion } from '../../src/models/conversion';
import nock from 'nock';
import exchangeRates_base_BRL from '../fixtures/exchangeRates_base_BRL.json';
import exchangeRates_base_USD from '../fixtures/exchangeRates_base_USD.json';
describe('Beach conversor functional tests', () => {
  beforeAll(async () => await Conversion.deleteMany({}));

  it('should create a conversion with sucess', async () => {
    nock('https://api.exchangeratesapi.io:443', {
      encodedQueryParams: true
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/latest')
      .query({ base: 'BRL' })
      .reply(200, exchangeRates_base_BRL);

    const { body, status } = await global.testRequest.post('/converter').send({
      user: 1,
      convert_from_type: 'BRL',
      convert_from_value: 12,
      convert_to_type: 'USD'
    });
    const expectResponse = {
      user: 1,
      convert_from_type: 'BRL',
      convert_from_value: 12,
      convert_to_type: 'USD',
      convert_to_value: 2.15,
      conversion_rate: 0.1794949434
    };
    expect(status).toBe(201);
    expect(body).toEqual(expect.objectContaining(expectResponse));
  });

  it('should return 422 when there is a validation error', async () => {
    nock('https://api.exchangeratesapi.io:443', {
      encodedQueryParams: true
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/latest')
      .query({ base: 'BRL' })
      .reply(200, exchangeRates_base_BRL);

    const { body, status } = await global.testRequest.post('/converter').send({
      user: 1,
      convert_from_type: 'BRL',
      convert_from_value: 'invalid_string',
      convert_to_type: 'USD'
    });

    expect(status).toBe(422);
    expect(body).toEqual({
      error:
        'Conversion validation failed: convert_from_value: Cast to Number failed for value "invalid_string" at path "convert_from_value"'
    });
  });

  it('should return 500', async () => {
    nock('https://api.exchangeratesapi.io:443', {
      encodedQueryParams: true
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/latest')
      .query({ base: 'BRL' })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.post('/converter').send({
      user: 1,
      convert_from_type: 'BRL',
      convert_from_value: 'invalid_string',
      convert_to_type: 'USD'
    });

    expect(status).toBe(500);
  });

  it('should return a array of conversions of a user', async () => {
    nock('https://api.exchangeratesapi.io:443', {
      encodedQueryParams: true
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/latest')
      .query({ base: 'USD' })
      .reply(200, exchangeRates_base_USD);

    await global.testRequest.post('/converter').send({
      user: 1,
      convert_from_type: 'USD',
      convert_from_value: 12,
      convert_to_type: 'BRL'
    });

    const { body, status } = await global.testRequest.get('/converter/1');

    const expectResponse = [
      {
        user: 1,
        convert_from_type: 'BRL',
        convert_from_value: 12,
        convert_to_type: 'USD',
        conversion_rate: 0.1794949434
      },
      {
        convert_from_type: 'USD',
        convert_from_value: 12,
        convert_to_type: 'BRL',
        conversion_rate: 5.6446399865,
        user: 1
      }
    ];

    expect(status).toBe(200);
    expect(body).toEqual(expect.objectContaining(expectResponse));
  });

  it('should return a empty array when user does not ave any conversion', async () => {
    const { body, status } = await global.testRequest.get('/converter/2');

    expect(status).toBe(200);
    expect(body).toEqual([]);
  });
});
