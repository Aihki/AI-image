import {ErrorResponse} from '../types/MessageTypes';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // console.log('fetching data from url: ', url);
  console.log('fetching data from url: ', url)
  const response = await fetch(url, options);
  const json = await response.json();
  console.log('response', response);
  if (!response.ok) {
    // kokeile joskus: throw response;
    const errorJson = json as unknown as ErrorResponse;
    // console.log('errorJson', errorJson);
    if (errorJson.message) {
      throw new Error(errorJson.message);
    }
    throw new Error(`Error ${response.status} occured`);
  }
  console.log('json', json);
  return json;
};

export default fetchData;
