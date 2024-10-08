import { Args, InitialState, Pvm as InternalPvm, Status } from "@/types/pvm";
// The only files we need from PVM repo:
import { ProgramDecoder } from "../../packages/pvm/pvm/program-decoder/program-decoder";
import { ArgsDecoder } from "../../packages/pvm/pvm/args-decoder/args-decoder";
import { byteToOpCodeMap } from "../../packages/pvm/pvm/assemblify";
import { Pvm as InternalPvmInstance } from "@typeberry/pvm";

export const initPvm = (program: number[], initialState: InitialState) => {
  const pvm = new InternalPvmInstance(new Uint8Array(program), initialState);

  return pvm;
};

export const runAllInstructions = (pvm: InternalPvm, program: number[]) => {
  const programPreviewResult = [];

  do {
    const pc = pvm.getPC();
    const result = nextInstruction(pc, program);
    programPreviewResult.push(result);
  } while (pvm.nextStep() === Status.OK);

  return {
    programRunResult: {
      pc: pvm.getPC(),
      regs: Array.from(pvm.getRegisters()),
      gas: pvm.getGas(),
      pageMap: pvm.getMemory(),
      memory: pvm.getMemory(),
      status: pvm.getStatus(),
    },
    programPreviewResult,
  };
};

export const nextInstruction = (programCounter: number, program: number[]) => {
  const programDecoder = new ProgramDecoder(new Uint8Array(program));
  const code = programDecoder.getCode();
  const mask = programDecoder.getMask();
  const argsDecoder = new ArgsDecoder(code, mask);
  const currentInstruction = code[programCounter];

  let args;

  try {
    args = argsDecoder.getArgs(programCounter) as Args;

    const currentInstructionDebug = {
      instructionCode: currentInstruction,
      ...byteToOpCodeMap[currentInstruction],
      args: {
        ...args,
        immediate: "immediateDecoder" in args ? args.immediateDecoder?.getUnsigned() : undefined,
      },
    };
    return currentInstructionDebug;
  } catch (e) {
    // The last iteration goes here since there's no instruction to proces and we didn't check if there's a next operation
    return null;
  }
};
