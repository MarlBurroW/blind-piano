import { Panel } from "./Panel";
import { useTranslation } from "react-i18next";
import { Chat } from "./Chat";

export function RightPanel() {
  const { t } = useTranslation();

  return (
    <Panel padding={0} className="h-full flex flex-col ">
      <div className="flex justify-center items-center p-5 bg-shade-300 text-center text-2xl rounded-t-3xl">
        {t("generic.chat")}
      </div>
      <Chat />
    </Panel>
  );
}

export default RightPanel;
