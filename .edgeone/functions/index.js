
      let global = globalThis;

      class MessageChannel {
        constructor() {
          this.port1 = new MessagePort();
          this.port2 = new MessagePort();
        }
      }
      class MessagePort {
        constructor() {
          this.onmessage = null;
        }
        postMessage(data) {
          if (this.onmessage) {
            setTimeout(() => this.onmessage({ data }), 0);
          }
        }
      }
      global.MessageChannel = MessageChannel;

      async function handleRequest(context){
        let routeParams = {};
        let pagesFunctionResponse = null;
        const request = context.request;
        const urlInfo = new URL(request.url);

        if (urlInfo.pathname !== '/' && urlInfo.pathname.endsWith('/')) {
          urlInfo.pathname = urlInfo.pathname.slice(0, -1);
        }

        let matchedFunc = false;
        
          if('/api/clean-eo-cache' === urlInfo.pathname) {
            matchedFunc = true;
              (() => {
  // functions/api/clean-eo-cache.js
  async function qcloudV3Post(secretId, secretKey, service, bodyArray, headersArray) {
    const HTTPRequestMethod = "POST";
    const CanonicalURI = "/";
    const CanonicalQueryString = "";
    const sortHeadersArray = Object.keys(headersArray).sort().reduce((obj, key) => {
      obj[key] = headersArray[key];
      return obj;
    }, {});
    let SignedHeaders = "";
    let CanonicalHeaders = "";
    for (const key in sortHeadersArray) {
      SignedHeaders += key.toLowerCase() + ";";
    }
    SignedHeaders = SignedHeaders.slice(0, -1);
    for (const key in sortHeadersArray) {
      CanonicalHeaders += `${key.toLowerCase()}:${sortHeadersArray[key].toLowerCase()}
`;
    }
    const HashedRequestPayload = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(bodyArray))
    ).then((hash) => Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    const CanonicalRequest = `${HTTPRequestMethod}
${CanonicalURI}
${CanonicalQueryString}
${CanonicalHeaders}
${SignedHeaders}
${HashedRequestPayload}`;
    const RequestTimestamp = Math.floor(Date.now() / 1e3);
    const formattedDate = new Date(RequestTimestamp * 1e3).toISOString().split("T")[0];
    const Algorithm = "TC3-HMAC-SHA256";
    const CredentialScope = `${formattedDate}/${service}/tc3_request`;
    const HashedCanonicalRequest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(CanonicalRequest)
    ).then((hash) => Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    const StringToSign = `${Algorithm}
${RequestTimestamp}
${CredentialScope}
${HashedCanonicalRequest}`;
    async function hmac(key, string) {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        typeof key === "string" ? new TextEncoder().encode(key) : key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
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
          "HMAC",
          await crypto.subtle.importKey(
            "raw",
            SecretSigning,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
          ),
          new TextEncoder().encode(StringToSign)
        )
      )
    ).map((b) => b.toString(16).padStart(2, "0")).join("");
    const Authorization = `${Algorithm} Credential=${secretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`;
    headersArray["X-TC-Timestamp"] = RequestTimestamp.toString();
    headersArray["Authorization"] = Authorization;
    return headersArray;
  }
  function onRequestOptions(context) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  async function onRequestPost(context) {
    try {
      const data = await context.request.json();
      const { secretId, secretKey, zoneId, type, targets } = data;
      const service = "teo";
      const host = "teo.tencentcloudapi.com";
      const payload = {
        ZoneId: zoneId,
        Type: type,
        Targets: targets
      };
      const headersPending = {
        "Host": host,
        "Content-Type": "application/json",
        "X-TC-Action": "CreatePurgeTask",
        "X-TC-Version": "2022-09-01",
        "X-TC-Region": "ap-guangzhou"
      };
      const headers = await qcloudV3Post(secretId, secretKey, service, payload, headersPending);
      const response = await fetch(`https://${host}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
  function onRequest(context) {
    return new Response(JSON.stringify({ error: "Only POST method is allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        
            if('/api/clean-eo-cache' === urlInfo.pathname && request.method === 'POST') {
              matchedFunc = true;
                (() => {
  // functions/api/clean-eo-cache.js
  async function qcloudV3Post(secretId, secretKey, service, bodyArray, headersArray) {
    const HTTPRequestMethod = "POST";
    const CanonicalURI = "/";
    const CanonicalQueryString = "";
    const sortHeadersArray = Object.keys(headersArray).sort().reduce((obj, key) => {
      obj[key] = headersArray[key];
      return obj;
    }, {});
    let SignedHeaders = "";
    let CanonicalHeaders = "";
    for (const key in sortHeadersArray) {
      SignedHeaders += key.toLowerCase() + ";";
    }
    SignedHeaders = SignedHeaders.slice(0, -1);
    for (const key in sortHeadersArray) {
      CanonicalHeaders += `${key.toLowerCase()}:${sortHeadersArray[key].toLowerCase()}
`;
    }
    const HashedRequestPayload = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(bodyArray))
    ).then((hash) => Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    const CanonicalRequest = `${HTTPRequestMethod}
${CanonicalURI}
${CanonicalQueryString}
${CanonicalHeaders}
${SignedHeaders}
${HashedRequestPayload}`;
    const RequestTimestamp = Math.floor(Date.now() / 1e3);
    const formattedDate = new Date(RequestTimestamp * 1e3).toISOString().split("T")[0];
    const Algorithm = "TC3-HMAC-SHA256";
    const CredentialScope = `${formattedDate}/${service}/tc3_request`;
    const HashedCanonicalRequest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(CanonicalRequest)
    ).then((hash) => Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    const StringToSign = `${Algorithm}
${RequestTimestamp}
${CredentialScope}
${HashedCanonicalRequest}`;
    async function hmac(key, string) {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        typeof key === "string" ? new TextEncoder().encode(key) : key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
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
          "HMAC",
          await crypto.subtle.importKey(
            "raw",
            SecretSigning,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
          ),
          new TextEncoder().encode(StringToSign)
        )
      )
    ).map((b) => b.toString(16).padStart(2, "0")).join("");
    const Authorization = `${Algorithm} Credential=${secretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`;
    headersArray["X-TC-Timestamp"] = RequestTimestamp.toString();
    headersArray["Authorization"] = Authorization;
    return headersArray;
  }
  function onRequestOptions(context) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  async function onRequestPost(context) {
    try {
      const data = await context.request.json();
      const { secretId, secretKey, zoneId, type, targets } = data;
      const service = "teo";
      const host = "teo.tencentcloudapi.com";
      const payload = {
        ZoneId: zoneId,
        Type: type,
        Targets: targets
      };
      const headersPending = {
        "Host": host,
        "Content-Type": "application/json",
        "X-TC-Action": "CreatePurgeTask",
        "X-TC-Version": "2022-09-01",
        "X-TC-Region": "ap-guangzhou"
      };
      const headers = await qcloudV3Post(secretId, secretKey, service, payload, headersPending);
      const response = await fetch(`https://${host}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
  function onRequest(context) {
    return new Response(JSON.stringify({ error: "Only POST method is allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

          pagesFunctionResponse = onRequestPost;
        })();
            }
          
            if('/api/clean-eo-cache' === urlInfo.pathname && request.method === 'OPTIONS') {
              matchedFunc = true;
                (() => {
  // functions/api/clean-eo-cache.js
  async function qcloudV3Post(secretId, secretKey, service, bodyArray, headersArray) {
    const HTTPRequestMethod = "POST";
    const CanonicalURI = "/";
    const CanonicalQueryString = "";
    const sortHeadersArray = Object.keys(headersArray).sort().reduce((obj, key) => {
      obj[key] = headersArray[key];
      return obj;
    }, {});
    let SignedHeaders = "";
    let CanonicalHeaders = "";
    for (const key in sortHeadersArray) {
      SignedHeaders += key.toLowerCase() + ";";
    }
    SignedHeaders = SignedHeaders.slice(0, -1);
    for (const key in sortHeadersArray) {
      CanonicalHeaders += `${key.toLowerCase()}:${sortHeadersArray[key].toLowerCase()}
`;
    }
    const HashedRequestPayload = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(bodyArray))
    ).then((hash) => Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    const CanonicalRequest = `${HTTPRequestMethod}
${CanonicalURI}
${CanonicalQueryString}
${CanonicalHeaders}
${SignedHeaders}
${HashedRequestPayload}`;
    const RequestTimestamp = Math.floor(Date.now() / 1e3);
    const formattedDate = new Date(RequestTimestamp * 1e3).toISOString().split("T")[0];
    const Algorithm = "TC3-HMAC-SHA256";
    const CredentialScope = `${formattedDate}/${service}/tc3_request`;
    const HashedCanonicalRequest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(CanonicalRequest)
    ).then((hash) => Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    const StringToSign = `${Algorithm}
${RequestTimestamp}
${CredentialScope}
${HashedCanonicalRequest}`;
    async function hmac(key, string) {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        typeof key === "string" ? new TextEncoder().encode(key) : key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
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
          "HMAC",
          await crypto.subtle.importKey(
            "raw",
            SecretSigning,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
          ),
          new TextEncoder().encode(StringToSign)
        )
      )
    ).map((b) => b.toString(16).padStart(2, "0")).join("");
    const Authorization = `${Algorithm} Credential=${secretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`;
    headersArray["X-TC-Timestamp"] = RequestTimestamp.toString();
    headersArray["Authorization"] = Authorization;
    return headersArray;
  }
  function onRequestOptions(context) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  async function onRequestPost(context) {
    try {
      const data = await context.request.json();
      const { secretId, secretKey, zoneId, type, targets } = data;
      const service = "teo";
      const host = "teo.tencentcloudapi.com";
      const payload = {
        ZoneId: zoneId,
        Type: type,
        Targets: targets
      };
      const headersPending = {
        "Host": host,
        "Content-Type": "application/json",
        "X-TC-Action": "CreatePurgeTask",
        "X-TC-Version": "2022-09-01",
        "X-TC-Region": "ap-guangzhou"
      };
      const headers = await qcloudV3Post(secretId, secretKey, service, payload, headersPending);
      const response = await fetch(`https://${host}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
  function onRequest(context) {
    return new Response(JSON.stringify({ error: "Only POST method is allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

          pagesFunctionResponse = onRequestOptions;
        })();
            }
          

        const params = {};
        if (routeParams.id) {
          if (routeParams.mode === 1) {
            const value = urlInfo.pathname.match(routeParams.left);        
            for (let i = 1; i < value.length; i++) {
              params[routeParams.id[i - 1]] = value[i];
            }
          } else {
            const value = urlInfo.pathname.replace(routeParams.left, '');
            const splitedValue = value.split('/');
            if (splitedValue.length === 1) {
              params[routeParams.id] = splitedValue[0];
            } else {
              params[routeParams.id] = splitedValue;
            }
          }
          
        }
        if(!matchedFunc){
          pagesFunctionResponse = function() {
            return new Response(null, {
              status: 404,
              headers: {
                "content-type": "text/html; charset=UTF-8",
                "x-edgefunctions-test": "Welcome to use Pages Functions.",
              },
            });
          }
        }
        return pagesFunctionResponse({request, params, env: {} });
      }addEventListener('fetch',event=>{return event.respondWith(handleRequest({request:event.request,params: {}, env: {} }))});