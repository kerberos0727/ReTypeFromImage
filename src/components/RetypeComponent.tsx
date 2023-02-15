import React, { useState } from "react";
import retypeImg from "../Assets/images/retype.jpg";
import { createWorker } from "tesseract.js";
import Pdf from "react-to-pdf";
import { LegacyRef } from "react";

const RetypeComponent = () => {
    const ref: LegacyRef<HTMLDivElement> | undefined = React.createRef();
    const [isExtractedText, setIsExtractedText] = useState(false);
    const worker = createWorker({
        logger: (m) => {
            // console.log(m);
        },
    });

    const options = {
        unit: 'in',
        format: [8.5, 11]
    };

    const [textTitle, setTextTitle] = useState("");
    const [textChapterTitle, setTextChapterTitle] = useState("");
    const [textSubTitle, setTextSubTitle] = useState("");
    const [textContent, setTextContent] = useState("");

    const onExtract = async () => {
        if (!retypeImg) return;
        const workerInstance = await worker;
        await workerInstance.load();
        await workerInstance.loadLanguage("eng");
        await workerInstance.initialize("eng");
        const {
            data: { text },
        } = await workerInstance.recognize(retypeImg);
        const textArrStr = text.split("\n");

        setTextTitle(textArrStr[0] + " " + textArrStr[1]);
        setTextChapterTitle(textArrStr[2]);
        setTextSubTitle(textArrStr[3]);
        var content = "";
        for (let index = 4; index < textArrStr.length - 2; index++) {
            content += textArrStr[index] + " ";
        }
        setTextContent(content);
        setIsExtractedText(true);
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-[20px]">
            <div className="relative w-[500px]">
                <img src={retypeImg} className="w-full" alt="logo"></img>
                <div ref={ref} className="absolute top-0 z-[-1] flex flex-col pt-[30px]">
                    <div className="flex  justify-center">
                        <h1>{textTitle}</h1>
                    </div>
                    <div className="flex  justify-center">
                        <h2>{textChapterTitle}</h2>
                    </div>
                    <div className="flex  justify-center">
                        <h4>{textSubTitle}</h4>
                    </div>
                    <div className="w-[500px] text-[17px]">
                        {textContent}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[10px] justify-center">
                <div className="flex justify-center">
                    <button className="w-[100px] h-[40px] cursor-pointer"
                        onClick={() => {
                            onExtract();
                        }}
                    >
                        Extract
                    </button>
                </div>
                <div>
                    <textarea className="p-[10px] w-[500px] h-[500px] text-[16px]"
                        value={textContent}
                        onChange={(e) => {
                            if (isExtractedText) {
                                setTextContent(e.target.value);
                            }
                        }}
                    />
                </div>
                <Pdf targetRef={ref} filename="retyped.pdf" options={options} x={0.5} y={.5} scale={1.4}>
                    {({ toPdf }: any) =>
                        <div className="flex justify-center mt-[30px]">
                            <button className="w-[100px] h-[40px] cursor-pointer"
                                onClick={toPdf}
                            >
                                Submit
                            </button>
                        </div>
                    }
                </Pdf>

            </div>
        </div >
    )
}

export default RetypeComponent;