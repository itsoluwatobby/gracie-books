class Helper {
  public reduceTextLength(content: string, maxLength=20, option:('letter'|'word')='letter') {
    let responseOutput = '';
    if(option === 'letter'){
      responseOutput = content?.length > maxLength ? content?.substring(0, maxLength) +'...' : content
    }
    else if(option === 'word'){
      responseOutput = content?.split(' ')?.length > maxLength ? content?.substring(0, maxLength * 4) +'...' : content
    }
    return responseOutput
  }

  public checkCount<T>(content: T[] | T): string {
    let count = ''; 
    const length = Array.isArray(content) ? content?.length : content as number;
    if(length <= 999){
      if(Array.isArray(content)){
        if(length == 1 && content[0] == '') count = '0'
        else count = length.toString()
      }
      else count = length.toString()
    }
    else if(length > 999 && length <= 999_999)
      count = ((length / 1000).toFixed(1)).toString() + 'K'
    else if(length > 999_999 && length <= 999_999_999)
      count = ((length / 1000_000).toFixed(1)).toString() + 'M'
    else if(length > 999_999_999)
      count = ((length / 1000_000_000).toFixed(1)).toString() + 'B'
    return count
  }

  public getFirstLetters(name = 'N O') {
    const [firstName, lastName] = name.split(' ');
    return `${firstName[0].toUpperCase()}${lastName[0].toLowerCase()}`;
  }

  public getCurrentDate() {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'full'
    }).format(new Date());
  }
  
  public getFullName(user: { [x:string]: string | null, firstName: string, lastName: string }) {
    return user.firstName + ' ' + user.lastName
  }

  public formatTime(date: string, includeTime = false) {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'long',
      timeStyle: includeTime ? 'long' : undefined,
    }).format(new Date(date));
  }

  public jsonParseValue<T>(value: string): T {
    try {
      return JSON.parse(value) as T;
    } catch(err) {
      void(err);
      return value as T;
    }
  }
  
  public stringifyData<T>(data: T): string {
    try {
      return JSON.stringify(data);
    } catch(err) {
      void(err);
      return data as string;
    }
  }

  getRating(rating: Rating[]) {
    const MaxRating = 5;
    return (rating.length / MaxRating).toFixed(1);
  }

  formatPrice(price = 0, decimalPlace = 2) {
    return price.toFixed(decimalPlace).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
}
export const helper = new Helper();