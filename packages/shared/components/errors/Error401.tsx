import { useTranslation } from "react-i18next";
import ErrorContainer from "../error-container/ErrorContainer";

const Error401 = () => {
  const { t } = useTranslation("Common");

  return <ErrorContainer headerText={t("Error401Text")} />;
};

export default Error401;
