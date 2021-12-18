/**
 * Stringで受け取った値をJSONに変更する
 */
export const getArrayFromAny = <T>(jsonString: string | T[]): T => {
  let isChangeArray = false;

  /**
   * 想定している形式Stringの[]ではいっているか確認
   */
  if (typeof jsonString === 'string') {
    jsonString = jsonString.split(`'`).join(`"`); //シングルコーテションの場合を考慮
    isChangeArray = jsonString.slice(0, 1) === '[' && jsonString.slice(-1) === ']';
  }

  try {
    const result = typeof jsonString === 'string' && isChangeArray ? JSON.parse(jsonString) : jsonString;

    if (typeof result === 'object' && result.length > 0) {
      return result;
    } else {
      return undefined;
    }
  } catch (e) {
    console.error('JSON.parseに失敗しました' + e);
    return undefined;
  }
};

/**
 * Objectの型が想定したKey,Valueで入っていつかのバリデーションチェック
 * type: unknown = type of **
 */
export const validateInputArray = (items: unknown[], types: { name: string; required: boolean; type: unknown }[]): boolean => {
  if (!Array.isArray(items) || items.length === 0) {
    return true;
  }

  const hasError = items.filter(item => {
    const notBeExist = Object.keys(item).filter(key => {
      const type = types.find(t => t.name === key);

      return type === undefined;
    });

    if (notBeExist.length > 0) {
      console.error(`該当しないキー ${notBeExist} が存在しています`);
      return true;
    }

    const errorTypes = types.filter(type => {
      return type.required === true && !item.hasOwnProperty(type.name);
    });

    if (errorTypes.length > 0) {
      errorTypes.map(errorType => {
        console.error(`必須条件で該当するキー ${errorType.name} が存在していません`);
      });
      return true;
    }
  });

  return hasError.length > 0;
};
