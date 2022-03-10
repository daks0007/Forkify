import { async } from 'regenerator-runtime';
import { timeOutSeconds } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
//Reciving the Recipe form the Api
export const GetJson = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(timeOutSeconds)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${data.status}`);
    return data;
    // console.log(data);
  } catch (err) {
    throw err;
  }
};
export const SendJson = async function (url, UploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(UploadData),
    });
    const res = await Promise.race([fetchPro, timeout(timeOutSeconds)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${data.status}`);
    return data;
    // console.log(data);
  } catch (err) {
    throw err;
  }
};
