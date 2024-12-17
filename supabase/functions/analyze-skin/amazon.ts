import { AmazonProduct } from './types.ts';

export async function searchAmazonProducts(keywords: string): Promise<AmazonProduct[]> {
  const accessKeyId = Deno.env.get("AMAZON_ACCESS_KEY_ID");
  const secretKey = Deno.env.get("AMAZON_SECRET_ACCESS_KEY");
  const partnerTag = Deno.env.get("AMAZON_PARTNER_TAG");
  
  if (!accessKeyId || !secretKey || !partnerTag) {
    console.error('Missing Amazon API credentials');
    throw new Error('Amazon API credentials not configured');
  }

  const endpoint = "webservices.amazon.com";
  const uri = "/paapi5/searchitems";
  const region = "us-east-1";
  const service = "ProductAdvertisingAPI";

  const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.substring(0, 8);

  const payload = {
    "Keywords": keywords,
    "Resources": [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "ItemInfo.Features"
    ],
    "PartnerTag": partnerTag,
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.com",
    "Operation": "SearchItems"
  };

  const canonicalHeaders = [
    `content-encoding:amz-1.0`,
    `content-type:application/json; charset=utf-8`,
    `host:${endpoint}`,
    `x-amz-date:${timestamp}`,
    `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems`,
  ].join('\n');

  const canonicalRequest = [
    'POST',
    uri,
    '',
    canonicalHeaders,
    '',
    'content-encoding;content-type;host;x-amz-date;x-amz-target',
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(payload))
    ).then(hash => Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')),
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${date}/${region}/${service}/aws4_request`,
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(canonicalRequest)
    ).then(hash => Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')),
  ].join('\n');

  async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
    const kDate = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(`AWS4${key}`),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const kRegion = await crypto.subtle.importKey(
      "raw",
      await crypto.subtle.sign(
        "HMAC",
        kDate,
        new TextEncoder().encode(dateStamp)
      ),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const kService = await crypto.subtle.importKey(
      "raw",
      await crypto.subtle.sign(
        "HMAC",
        kRegion,
        new TextEncoder().encode(regionName)
      ),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    return await crypto.subtle.sign(
      "HMAC",
      kService,
      new TextEncoder().encode("aws4_request")
    );
  }

  const signatureKey = await getSignatureKey(secretKey, date, region, service);
  const signature = Array.from(new Uint8Array(signatureKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const headers = {
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=utf-8',
    'x-amz-date': timestamp,
    'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
    'authorization': `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${date}/${region}/${service}/aws4_request, SignedHeaders=content-encoding;content-type;host;x-amz-date;x-amz-target, Signature=${signature}`,
  };

  try {
    const response = await fetch(`https://${endpoint}${uri}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Amazon API error:', await response.text());
      throw new Error('Failed to fetch Amazon products');
    }

    const data = await response.json();
    return data.SearchResult?.Items || [];
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    throw error;
  }
}