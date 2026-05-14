import { createFileRoute } from "@tanstack/react-router";
import { IrrigationHMI } from "@/components/irrigation/IrrigationHMI";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garden Control HMI - Sterowanie nawadnianiem" },
      {
        name: "description",
        content:
          "Panel operatorski systemu nawadniania ogrodu — strefy, harmonogram, diagnostyka i integracja Node-RED / PLC.",
      },
      { property: "og:title", content: "Garden Control HMI" },
      {
        property: "og:description",
        content: "Profesjonalny panel HMI do sterowania nawadnianiem ogrodu.",
      },
    ],
  }),
  component: IrrigationHMI,
});
