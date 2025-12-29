import { useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button";
import { NoteSidebarSummary } from "./components/NoteSidebarSummary";
import { NoteGenerateCard } from "./components/NoteGenerateCard";
import { NoteEditorCard } from "./components/NoteEditorCard";

import { useLocation, useNavigate } from "react-router-dom";

export function AINoteSummaryScreen() {
  const location = useLocation();
  const collectedSessionData = location?.state?.sessionData;

  const navigate = useNavigate();

  const [onManual, setOnManual] = useState(false);
  const [onGenerate, setOnGenrate] = useState(false);

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-3 gap-6">
          <NoteSidebarSummary sessionData={collectedSessionData} />

          <div className="col-span-2 space-y-4">
            {onManual || onGenerate ? (
              <NoteEditorCard onGenerate={onGenerate} />
            ) : (
              <NoteGenerateCard
                setOnGenrat={setOnGenrate}
                setOnManual={setOnManual}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
