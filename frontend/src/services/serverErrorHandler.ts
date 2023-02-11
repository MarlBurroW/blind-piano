import { toast } from "react-toastify";
import i18n from "./i18n";

export default function (error: any) {
  switch (error.code) {
    case 422:
      toast.error(i18n.t("server_error_messages.validation_error"));
      break;
    default:
      console.error(error);
      toast.error(i18n.t("server_error_messages.unknown_error"));
  }
}
