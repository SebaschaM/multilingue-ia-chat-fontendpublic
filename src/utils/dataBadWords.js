const badWords = {
  1: ["fuck"], // INGLES
  2: ["maldición", "mierda", "puto"], // ESPAÑOL
  3: ["你妈"], // CHINO
  4: ["блядь"], // RUSO
  5: ["اللعنة"], // ÁRABE
  6: ["maldición"], // QUECHUA
  7: ["クソ"], // JAPONES
  8: ["merda"], // PORTUGUES
  9: ["merde"], // FRANCES
  10: ["씨발"], // COREANO
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
