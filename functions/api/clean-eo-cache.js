// 边缘函数 - 腾讯云 EdgeOne 缓存清理
async function qcloudV3Post(secretId, secretKey, service, bodyArray, headersArray) {
  const HTTPRequestMethod = "POST";
  const CanonicalURI = "/";
  const CanonicalQueryString = "";

  // 按 ASCII 升序排序
  const sortHeadersArray = Object.keys(headersArray)
    .sort()
    .reduce((obj, key) => {
      obj[key] = headersArray[key];
      return obj;
    }, {});

  let SignedHeaders = "";
  let CanonicalHeaders = "";

  // 拼接键
  for (const key in sortHeadersArray) {
    SignedHeaders += key.toLowerCase() + ';';
  }
  SignedHeaders = SignedHeaders.slice(0, -1);

  // 拼接键和值
  for (const key in sortHeadersArray) {
    CanonicalHeaders += `${key.toLowerCase()}:${sortHeadersArray[key].toLowerCase()}\n`;
  }

  const HashedRequestPayload = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(bodyArray))
  ).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));

  const CanonicalRequest =
    `${HTTPRequestMethod}\n${CanonicalURI}\n${CanonicalQueryString}\n${CanonicalHeaders}\n${SignedHeaders}\n${HashedRequestPayload}`;

  // 时间戳
  const RequestTimestamp = Math.floor(Date.now() / 1000);
  const formattedDate = new Date(RequestTimestamp * 1000).toISOString().split('T')[0];
  const Algorithm = "TC3-HMAC-SHA256";
  const CredentialScope = `${formattedDate}/${service}/tc3_request`;
  
  const HashedCanonicalRequest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(CanonicalRequest)
  ).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));

  const StringToSign =
    `${Algorithm}\n${RequestTimestamp}\n${CredentialScope}\n${HashedCanonicalRequest}`;

  // HMAC-SHA256 签名计算
  async function hmac(key, string) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      typeof key === 'string' ? new TextEncoder().encode(key) : key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      new TextEncoder().encode(string)
    );
    return new Uint8Array(signature);
  }

  const SecretDate = await hmac("TC3" + secretKey, formattedDate);
  const SecretService = await hmac(SecretDate, service);
  const SecretSigning = await hmac(SecretService, "tc3_request");
  
  const Signature = Array.from(
    new Uint8Array(
      await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey(
          'raw',
          SecretSigning,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        ),
        new TextEncoder().encode(StringToSign)
      )
    )
  ).map(b => b.toString(16).padStart(2, '0')).join('');

  const Authorization =
    `${Algorithm} Credential=${secretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`;

  headersArray["X-TC-Timestamp"] = RequestTimestamp.toString();
  headersArray["Authorization"] = Authorization;

  return headersArray;
}

export default async function handler(request) {
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  try {
    const data = await request.json();
    const { secretId, secretKey, zoneId, type, targets, method = 'invalidate' } = data;

    const service = "teo";
    const host = "teo.tencentcloudapi.com";
    
    const payload = {
      ZoneId: zoneId,
      Type: type,
      Targets: targets
    };

    const headersPending = {
      'Host': host,
      'Content-Type': 'application/json',
      'X-TC-Action': 'CreatePurgeTask',
      'X-TC-Version': '2022-09-01',
      'X-TC-Region': 'ap-guangzhou',
    };

    const headers = await qcloudV3Post(secretId, secretKey, service, payload, headersPending);

    const response = await fetch(`https://${host}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
