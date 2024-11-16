/* eslint-disable */

import { FarmCategories, InvestmentRiskLevel } from '../schemas';

interface WebhookRequestBody {
  headers: {
    'content-transfer-encoding': string;
    'user-agent': string;
    accept: string;
    'postman-token': string;
    host: string;
    'accept-encoding': string;
    connection: string;
    'content-type': string;
    'content-length': string;
  };
  params: Record<string, never>;
  query: Record<string, never>;
  body: {
    category: any[];
    risk: string;
    amount: string;
    timeframe: string;
  };
  webhookUrl: string;
  executionMode: string;
}

const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const MAX_TIMEOUT = 20 * 60 * 1000; // 20 minutes

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number }
) {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function retryFetch(
  url: string,
  options: RequestInit,
  retryCount = 0
): Promise<Response> {
  try {
    const timeout = Math.min(
      INITIAL_TIMEOUT * Math.pow(2, retryCount),
      MAX_TIMEOUT
    );
    console.log(`Attempt ${retryCount + 1} with timeout ${timeout}ms`);

    const response = await fetchWithTimeout(url, { ...options, timeout });

    if (!response.ok && retryCount < MAX_RETRIES) {
      console.log(`Request failed with status ${response.status}. Retrying...`);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, retryCount))
      ); // Exponential backoff
      return retryFetch(url, options, retryCount + 1);
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request timed out');
      if (retryCount < MAX_RETRIES) {
        console.log('Retrying...');
        return retryFetch(url, options, retryCount + 1);
      }
    }
    throw error;
  }
}

export async function generateInvestmentAdviceWebhook({
  categories,
  risk,
  amount,
  time,
}: {
  categories: FarmCategories[];
  risk: InvestmentRiskLevel;
  amount: number;
  time: number;
}) {
  // Convert risk level to a numeric value
  const riskValue = (() => {
    switch (risk) {
      case 'Low Risk':
        return '20';
      case 'Average Risk':
        return '40';
      case 'Medium Risk':
        return '60';
      case 'Hight Risk':
        return '80';
      case 'Degen Risk':
        return '100';
      default:
        return '50';
    }
  })();

  const webhookPayload: WebhookRequestBody[] = [
    {
      headers: {
        'content-transfer-encoding': 'application/json',
        'user-agent': 'PostmanRuntime/7.42.0',
        accept: '*/*',
        'postman-token': '034e79cf-ed58-4808-b6be-f5790bcaab16',
        host: 'rag.defibuilder.com:5678',
        'accept-encoding': 'gzip, deflate, br',
        connection: 'keep-alive',
        'content-type':
          'multipart/form-data; boundary=--------------------------164951995062469606115444',
        'content-length': '532',
      },
      params: {},
      query: {},
      body: {
        category: categories,
        risk: riskValue,
        amount: amount.toString(),
        timeframe: `${time} months`,
      },
      webhookUrl:
        process.env.WEBHOOK_URL ??
        'http://rag.defibuilder.com:5678/webhook/8f7267c6-a958-4b5a-8252-ab3d87f7ba79',
      executionMode: 'test',
    },
  ];

  try {
    console.log(
      'Sending webhook request with payload:',
      JSON.stringify(webhookPayload, null, 2)
    );

    if (!webhookPayload[0] || !webhookPayload[0].webhookUrl) {
      throw new Error('Webhook URL is undefined');
    }

    const response = await retryFetch(webhookPayload[0].webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Webhook response received');
    const data = await response.json();
    console.log('Parsed response:', JSON.stringify(data, null, 2));

    // If the response is empty or doesn't contain investments, return a default structure
    // Using optional chaining for better readability
    if (!data?.investments?.length) {
      console.log('Invalid response format, using fallback data');
      return [
        {
          chain: 'ethereum',
          protocol: 'Aave',
          pool: 'USDC Lending',
          APR: 5.5,
          amount: amount * 0.5,
        },
        {
          chain: 'polygon',
          protocol: 'Curve',
          pool: '3pool',
          APR: 4.2,
          amount: amount * 0.5,
        },
      ];
    }
    return data.investments.map((investment: any) => ({
      chain: investment.chain || 'ethereum',
      protocol: investment.protocol || 'Unknown Protocol',
      pool: investment.pool || 'Default Pool',
      APR: Number(investment.apr) || 0,
      amount: (Number(investment.allocation) || 0.5) * amount,
    }));
  } catch (error) {
    console.error('Error calling webhook:', error);
    // Return fallback data in case of error
    console.log('Error occurred, using fallback data');
    return [
      {
        chain: 'ethereum',
        protocol: 'Aave',
        pool: 'USDC Lending',
        APR: 5.5,
        amount: amount * 0.5,
      },
      {
        chain: 'polygon',
        protocol: 'Curve',
        pool: '3pool',
        APR: 4.2,
        amount: amount * 0.5,
      },
    ];
  }
}
