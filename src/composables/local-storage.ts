/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { helper } from "../utils/helper";

class BrowserAPI {
  public add<T>(key: string, data: T) {
    const item = helper.stringifyData(data);   
    localStorage.setItem(key, item);
  }

  public get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item) return helper.jsonParseValue<T>(item);
    return null;
  }
  
  public remove(key: string) {
    localStorage.removeItem(key)
  }
  
  public clear() {
    localStorage.clear()
  }
};
export const browserAPI = new BrowserAPI();