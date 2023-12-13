const badWords = {
  1: [
    "Fuck you",
    "Fuck you",
    "Damn",
    "Shit",
    "Asshole",
    "Bitch",
    "Bitch",
    "Stupid",
    "Asshole",
    "Son of a Bitch",
    "Motherfucker",
    "Fuck you",
    "Faggot",
    "Scumbag",
    "Bastard",
  ], // INGLES
  2: [
    "Púdrete",
    "Jódete",
    "Maldición",
    "Mierda",
    "Gilipollas",
    "Perra",
    "Puta",
    "Estúpido",
    "Imbécil",
    "Hijo de Puta",
    "Hijo de Perra",
    "Vete a la mierda",
    "Maricón",
    "Basura",
    "Bastardo",
  ], // ESPAÑOL

  3: [
    "去你妈的",
    "去你妈的",
    "该死",
    "妈的",
    "混蛋",
    "婊子",
    "贱人",
    "蠢货",
    "混蛋",
    "狗娘养的",
    "狗娘养的",
    "操你妈",
    "基佬",
    "人渣",
    "混蛋",
  ], // CHINO
  4: [
    "Пошел ты",
    "Пошел ты.",
    "Проклятье",
    "Дерьмо",
    "Мудак",
    "Сука",
    "Сука",
    "Тупой",
    "Мудак",
    "Сукин сын",
    "Ублюдок",
    "Ебать тебя",
    "Пидор",
    "Отморозок",
    "Ублюдок",
  ], // RUSO
  5: [
    "تعفن",
    "اللعنة عليك",
    "لعنة",
    "القرف",
    "دوشباج",
    "عاهرة",
    "عاهرة",
    "غبي",
    "أحمق",
    "موظر",
    "نذل",
    "اللعنة قبالة",
    "شاذ جنسيا",
    "نفاية",
    "نذل",
  ], // ÁRABE
  6: [
    "ismuy",
    "joder qanwan",
    "Ñakasqa",
    "Mierda",
    "Douchebag nisqa",
    "Perra",
    "Perra",
    "Qanra",
    "Upa",
    "Mama chuchu",
    "Llulla",
    "Joder off",
    "Fagot sutiyuq",
    "Qupa",
    "Llulla",
  ], // QUECHUA
  7: [
    "ファック・ユー",
    "くたばれ",
    "畜生",
    "クソ",
    "クソ野郎",
    "ビッチ",
    "クソ女",
    "バカ",
    "ろくでなし",
    "クソ野郎",
    "マザーファッカー",
    "ファック・ユー",
    "ホモ野郎",
    "クズ野郎",
    "ろくでなし",
  ], // JAPONES
  8: [
    "Foda-se",
    "Foda-se",
    "Porra",
    "Merda",
    "Cretino",
    "Puta",
    "Puta",
    "Estúpido",
    "Parvalhão",
    "Filho da puta",
    "Filho da puta",
    "Foda-se",
    "Paneleiro",
    "Puta",
    "Cabrão",
  ], // PORTUGUES
  9: [
    "Baise-toi",
    "Je t'emmerde",
    "Merde",
    "Merde",
    "Trou du cul",
    "Salope",
    "Salope",
    "Stupide",
    "Trou du cul",
    "Fils de pute",
    "Enculé",
    "Fuck you",
    "Pédé",
    "Ordure",
    "Bâtard",
  ], // FRANCES
  10: [
    "썩음",
    "엿 먹어라",
    "저주",
    "똥",
    "두쉬백",
    "암캐",
    "암캐",
    "바보",
    "바보",
    "개자식아",
    "새끼",
    "꺼져",
    "동성애자",
    "쓰레기",
    "새끼",
  ], // COREANO
};

const linkTerms = ["http", "https", "www"];

//PENDIENTE MENSAJE EN DIFERENTE IDIOMA
const messageToast = {};

const normalizeString = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const verifyMessage = (idLanguage, message, isAdmin) => {
  if (isAdmin) {
    const normalizedMessage = normalizeString(message);

    for (const badWord of badWords[idLanguage]) {
      const normalizedBadWord = normalizeString(badWord);

      if (normalizedMessage.includes(normalizedBadWord)) {
        return true; // La cadena contiene al menos una palabra ofensiva
      }
    }
  } else {
    const normalizedMessage = normalizeString(message);

    for (const badWord of badWords[idLanguage]) {
      const normalizedBadWord = normalizeString(badWord);

      if (normalizedMessage.includes(normalizedBadWord)) {
        return true; // La cadena contiene al menos una palabra ofensiva
      }
    }
    const hasLink = linkTerms.some((term) => normalizedMessage.includes(term));
    return hasLink;
  }
};

// Ejemplo de uso:
const languageId = 1;
const userMessage = "WWW";

if (verifyMessage(languageId, userMessage)) {
  console.log("Mensaje ofensivo o contiene enlace detectado.");
} else {
  console.log("El mensaje es aceptable.");
}
