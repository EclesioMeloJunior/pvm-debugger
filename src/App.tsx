import "./App.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea.tsx";
import { InitialState, Pvm } from "@/pvm-packages/pvm/pvm.ts";
import { useState } from "react";

function App() {
  const [program, setProgram] = useState([0, 0, 3, 8, 135, 9, 249]);
  const [initialState, setInitialState] = useState<InitialState>({
    regs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    pc: 0,
    pageMap: [],
    memory: [],
    gas: 10000,
  });
  const [programInput, setProgramInput] = useState("[0, 0, 3, 8, 135, 9, 249]");
  const [registersInput, setRegistersInput] = useState("[0,0,0,0,0,0,0,0,0,0,0,0,0]");
  const [isInvalidProgram, setIsInvalidProgram] = useState(false);
  const [isInvalidRegisterTable, setIsInvalidRegisterTable] = useState(false);
  const [programPreviewResult, setProgramPreviewResult] = useState<unknown>();
  const [programRunResult, setProgramRunResult] = useState<unknown>();
  // const program = [0, 0, 3, 8, 135, 9, 249]

  const handleClick = () => {
    const pvm = new Pvm(new Uint8Array(program), initialState);
    // console.log(pvm.printProgram())
    pvm.runProgram();
    // console.log(pvm.getState())

    setProgramPreviewResult(pvm.printProgram());

    setProgramRunResult(pvm.getState());
  };

  return (
    <>
      <Textarea
        placeholder="Paste initial registers as an array of numbers"
        value={registersInput}
        onChange={(e) => {
          console.log(e.target.value);
          try {
            setRegistersInput(e.target.value);
            JSON.parse(e.target.value);
            setInitialState((prevState) => ({
              ...prevState,
              regs: JSON.parse(e.target.value),
            }));
            setIsInvalidRegisterTable(false);
          } catch (e) {
            console.log("wrong json");
            setIsInvalidRegisterTable(true);
          }
        }}
      />
      {isInvalidRegisterTable && <div>Registers are not a valid JSON array</div>}

      <Textarea
        placeholder="Paste program as an array of numbers"
        value={programInput}
        onChange={(e) => {
          console.log(e.target.value);
          try {
            setProgramInput(e.target.value);
            JSON.parse(e.target.value);
            setProgram(JSON.parse(e.target.value));
            setIsInvalidProgram(false);
          } catch (e) {
            console.log("wrong json");
            setIsInvalidProgram(true);
          }
        }}
      />
      {isInvalidProgram && <div>Program is not a valid JSON array</div>}
      <Button onClick={handleClick}>Check program</Button>

      <pre>
        <code>Program preview: {JSON.stringify(programPreviewResult)}</code>
      </pre>

      <pre>
        <code>Program run result: {JSON.stringify(programRunResult)}</code>
      </pre>
    </>
  );
}

export default App;
