import { useTranslation } from "react-i18next";

import { PlayerList } from "../components/PlayerList";
import { Panel } from "./Panel";

export function LeftPanel() {
  const { t } = useTranslation();

  return (
    <Panel padding={0} className={`h-full flex flex-col `}>
      <div className="flex justify-center items-center p-5 bg-shade-300 text-center text-2xl rounded-t-3xl">
        {t("generic.players")}
      </div>
      <div className="grow p-5">
        <PlayerList />
      </div>
    </Panel>
  );
}

export default LeftPanel;
