import { Entry, Keys } from '/project/shared'
import * as datefns from 'date-fns'

export const sortLargeToSmall = <T>(option?: T extends object ? { by: keyof T } : undefined) => {
  const by = option ? option.by : undefined
  return (a:T,b:T):number => {
    return by ? (+a[by] > +b[by] ? -1: 0)
              : (+a > +b ? -1 : 0)
  }
}
export const sortSmallToLarge = <T>(option?: T extends object ? { by: keyof T } : undefined ) => {
  const by = option ? option.by : undefined
  return (a:T,b:T):number => {
    return by ? (+a[by] > +b[by] ? 1 : 0 )
              : (+a > +b ? 1 : 0)
  }
}

export function makeid(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
  return result;
}

export function normalizeString(str: string) {
  // remove accents
  var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (let i=0, l=from.length ; i < l ; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-\s]/g, '-')
        .replace(/-+/g, '-');

  return str;
}


const convert_to_set_lists = <T>(object_request: Partial<T>) => Object.keys(object_request).filter(x => x !== undefined && x !== null).map((x) => `${x}="${object_request[x as keyof T]}"`).join(',')

export function Capitalize(_string: string) {
  return _string
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .join(' ')
}

export const global_constants = {
  helpers: {
    dayArrays: (from: Date | number, to: Date | number) => {
      const _days: Date[] = []
      let _start = datefns.startOfDay(from)
      while (_start <= to) {
        _days.push(_start)
        _start = datefns.addDays(_start, 1)
      }
      return _days
    },
    /**return [surname, givenname, longsurname]*/
    retrive_first_last: (text: string) => {
      const name_array = text.split(' ');
      const surname = name_array[0]
      const givenName = name_array.pop()!
      return [surname, givenName, name_array.join(' ')]
    },
    gen_pass: (pass: string) => Buffer.from(`"${pass}"`, 'utf16le').toString(),
    convert_to_set_lists,
    Capitalize,
    isEmpty: (obj: any) => {
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] != null)
          return false;
      }
      return true;
    },
    entries: <T>(ent: T) => Object.entries(ent) as Entry<T>,
    keys: <T>(obj: T) => Object.keys(obj) as Keys<T>
  },
}