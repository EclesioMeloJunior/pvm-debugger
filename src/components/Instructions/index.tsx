import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table.tsx";
import { mapInstructionsArgsByType, valueToNumeralSystem } from "./utils";
import classNames from "classnames";
import { InstructionMode } from "@/components/Instructions/types.ts";
import { NumeralSystemContext } from "@/context/NumeralSystem.tsx";
import { useContext } from "react";
import { isEqual, omit } from "lodash";
import { CurrentInstruction } from "@/types/pvm";

export const Instructions = ({
  programPreviewResult,
  currentInstruction,
  instructionMode,
}: {
  programPreviewResult: CurrentInstruction[] | undefined;
  currentInstruction: CurrentInstruction | undefined;
  instructionMode: InstructionMode;
}) => {
  const { numeralSystem } = useContext(NumeralSystemContext);
  console.log(numeralSystem);
  const isActive = (programRow: CurrentInstruction) => {
    if (!currentInstruction) {
      return false;
    }

    if ("error" in programRow && "error" in currentInstruction) {
      return (
        programRow.name === currentInstruction.name && programRow.instructionCode === currentInstruction.instructionCode
      );
    }

    // Remove error instructions from type
    if ("error" in programRow || "error" in currentInstruction) {
      return false;
    }

    return isEqual(
      omit(currentInstruction, ["args.immediateDecoder", "instructionBytes"]),
      omit(programRow, ["args.immediateDecoder", "instructionBytes"]),
    );
  };

  return (
    <div className="font-mono overflow-auto scroll-auto border-2 rounded-md min-h-[450px] h-[70vh]">
      <Table>
        <TableBody>
          {!!programPreviewResult?.length &&
            programPreviewResult.map((programRow, i) => (
              <TableRow className={classNames("hover:bg-gray-300", { "bg-[#55B3F3]": isActive(programRow) })} key={i}>
                {instructionMode === InstructionMode.BYTECODE && (
                  <TableCell className="p-1.5">
                    {programRow.instructionBytes && (
                      <span className="text-gray-500">
                        {[...programRow.instructionBytes]
                          ?.map((byte) =>
                            valueToNumeralSystem(byte, numeralSystem).padStart(numeralSystem ? 2 : 3, "0"),
                          )
                          .join(" ")}
                      </span>
                    )}
                  </TableCell>
                )}
                {instructionMode === InstructionMode.ASM && (
                  <>
                    <TableCell className="p-1.5">
                      <span className="uppercase font-bold">{programRow.name}</span>
                    </TableCell>
                    <TableCell className="p-1.5">
                      <span className="">
                        {"args" in programRow && mapInstructionsArgsByType(programRow.args, numeralSystem)}
                      </span>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
