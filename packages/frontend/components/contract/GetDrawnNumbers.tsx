import { useContext, useEffect, useState } from "react";
import { useProvider } from "wagmi";
import DrawnNumbersTable from "@/components/DrawnNumbersTable";
import { useBingoContract } from "@/hooks/useBingoContract";
import { BigNumber, Event, Contract } from "ethers";
import { toast } from "react-toastify";
import { errorSlicing, toastOptions } from "@/utils/utils";
import { NetworkContext } from "@/components/Layout";

type GetDrawnNumbersProps = {};

export const GetDrawnNumbers = (props: GetDrawnNumbersProps) => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [loading, setLoading] = useState("Loading...");

  const networkState: boolean = useContext(NetworkContext);

  const provider = useProvider();
  const contract: Contract | undefined = useBingoContract(provider);

  useEffect(() => {
    if (!networkState) {
      setDrawnNumbers((prev) => []);
      setInitialFetchCompleted(false);
      setLoading("Please switch network!");
      return;
    }
    const getDrawnNumbers = async () => {
      setLoading("Loading...");
      try {
        const drawnNumbers: BigNumber[] = await contract!.getDrawnNumbers();
        if (drawnNumbers.length === 0) {
          setLoading("No numbers drawn yet.");
          return;
        } else {
          setLoading("");
        }
        const drawnNumbersAsNumber: number[] = drawnNumbers.map((number) =>
          number.toNumber()
        );
        return drawnNumbersAsNumber;
      } catch (err: any) {
        toast.error(`${errorSlicing(err.reason)}!`, toastOptions);
        setLoading("");
        return [];
      }
    };
    if (contract && !initialFetchCompleted) {
      getDrawnNumbers().then((drawnNumbersAsNumber) => {
        if (drawnNumbersAsNumber === undefined) return;
        setDrawnNumbers(drawnNumbersAsNumber);
        setInitialFetchCompleted(true); // [1]
      });
      return;
    }
    toast.error(`Unexpected Error!`, toastOptions);
  }, [networkState]);

  useEffect(() => {
    if (contract && initialFetchCompleted) {
      contract.on("DrawNumber", eventHandler);
    }
    return () => {
      if (contract) {
        contract.off("DrawNumber", eventHandler);
      }
    };
  }, [initialFetchCompleted]);

  const eventHandler = async (number: BigNumber, event: Event) => {
    const luckyNumber = number.toNumber();
    if (!drawnNumbers.includes(luckyNumber)) {
      setDrawnNumbers((prev) => [...prev, luckyNumber]);
      toast.info(`New number drawn: ${luckyNumber}`, toastOptions);
    }
  };

  return (
    <>
      {drawnNumbers.length === 0 && (
        <div className="text-xl m-20 font-semibold">{loading}</div>
      )}
      {drawnNumbers.length > 0 && (
        <DrawnNumbersTable drawnNumbers={drawnNumbers}></DrawnNumbersTable>
      )}
    </>
  );
};
