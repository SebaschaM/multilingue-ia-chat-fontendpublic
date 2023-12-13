const malasPalabras = {
  es: ["puta", "mierda"],
  en: ["fucjk"],
  fr: [],
};

export const verifyCodeLanguage = (codeLanguange, message) => {
  if (codeLanguange === "es") {
    if (malasPalabras.es.includes(message)) {
      return true;
    } else {
      return false;
    }
  }

  if (codeLanguange === "en") {
    if (malasPalabras.en.includes(message)) {
      return true;
    }
  }

  if (codeLanguange === "fr") {
    if (malasPalabras.fr.includes(message)) {
      return true;
    }
  }
};
