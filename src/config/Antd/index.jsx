import azAz from "antd/locale/az_AZ";
import enUS from "antd/locale/en_US";
import ruRu from "antd/locale/ru_RU";

const themeToken = {
  colorPrimary: "#12579e",
};

const locale = {
  az: azAz,
  en: enUS,
  ru: ruRu,
};

const getCustomLocale = () => {
  const language = localStorage.getItem("language") || "az";
  const trs = locale[language];

  if (language === "az") {
    return {
      ...trs,
      DatePicker: {
        lang: {
          ...trs.DatePicker.lang,
          shortMonths: [
            "Yan", "Fev", "Mar", "Apr", "May", "İyun",
            "İyul", "Avq", "Sen", "Okt", "Noy", "Dek"
          ],
          shortWeekDays: ["B.", "B.E.", "Ç.A.", "Ç.", "C.A.", "C.", "Ş."],
        },
      },
    };
  }

  return trs;
};

// Override default antd components
const components = {
  Popover: {
    innerPadding: 0,
  },
};

export {
  themeToken,
  components,
  getCustomLocale,
};
