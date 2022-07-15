import axios from "axios";
import cheerio from "cheerio";

let headers = { "User-Agent": "Chrome 1.2.0" };

const snykParser = async (url: string) => {
  try {
    const response = await axios.get(url, { headers: headers });
    const html = response.data;
    const $ = cheerio.load(html);
    return $("main > div > div > table > tbody > tr > td").length / 4;
  } catch (error) {
    return 0;
  }
};

export default snykParser;

// https://snyk.io/vuln/npm:next@12.1.5
