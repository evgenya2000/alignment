import { Alert, Snackbar, Typography } from "@mui/material";
import css from "./ViewAlignment.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { colorMap } from "../mapColors";

interface ViewAlignmentProps {
    subFirst: string;
    subSecond: string;
}

const font = "16px monospace";

const ViewAlignment = ({ subFirst, subSecond }: ViewAlignmentProps) => {
    const block = useRef(null);
    const [maxWidth, setMaxWidth] = useState(0);
    const [arrStr1, setArrStr1] = useState<string[]>([]);
    const [arrStr2, setArrStr2] = useState<string[]>([]);
    const { width } = useWindowSize()
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let widthSymbol = 0;

    if (context) {
        context.font = font;
        widthSymbol = context.measureText("A").width;
    }

    useEffect(() => {
        if (block.current) {
            const computedStyles = getComputedStyle(block.current as any);
            const padding = Number(computedStyles.paddingLeft.split("px")[0]);
            const widthBlock = (block.current as HTMLDivElement).clientWidth;
            setMaxWidth(widthBlock - 2 * padding);
        }
    }, [width]);

    const getResultArrStr = useCallback((arr: string[], count: number) => {
        const arrRes = [];
        while (arr.length > count) {
            arrRes.push(arr.splice(0, Math.floor(maxWidth / widthSymbol)).join(""));
        }

        while (arr.length > 0) {
            arrRes.push(arr.splice(0, arr.length).join(""));
        }

        return arrRes;
    }, [maxWidth, widthSymbol]);

    useEffect(() => {
        if (maxWidth !== 0) {
            setArrStr1(getResultArrStr(subFirst.split(""), Math.floor(maxWidth / widthSymbol)));
            setArrStr2(getResultArrStr(subSecond.split(""), Math.floor(maxWidth / widthSymbol)));
        }
    }, [maxWidth, subFirst, subSecond]);

    const handleSelection = useCallback(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            const selectedText = selection.toString();
            navigator.clipboard.writeText(selectedText)
                .then(() => {
                    setOpenSnackbar(true);
                    setTimeout(() => setOpenSnackbar(false), 1000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    }, []);

    useEffect(() => {
        const element = block.current;
        if (element) {
            (element as HTMLDivElement).addEventListener('mouseup', handleSelection);
            return () => {
                (element as HTMLDivElement).removeEventListener('mouseup', handleSelection);
            };
        }
    }, [handleSelection]);

    return (
        <div className={css.root} ref={block}>
            {arrStr1.length > 0 && arrStr2.length > 0 && arrStr1.map((item, index) => {
                return (
                    <div key={index}>
                        <Typography fontFamily="monospace" component={"div"}>
                            {item.split('').map((char, index) => {
                                return (
                                    <span
                                        key={index}
                                        style={char !== "-" ? { backgroundColor: `var(${colorMap[char as keyof typeof colorMap]})` } : undefined}
                                    >
                                        {char}
                                    </span>
                                )
                            })}
                        </Typography>
                        <Typography fontFamily="monospace" >
                            {arrStr2[index].split('').map((char, j) => {
                                return (
                                    <span
                                        key={index}
                                        style={(char !== "-" && char !== arrStr1[index][j]) ? { backgroundColor: `var(${colorMap[char as keyof typeof colorMap]})` } : undefined}
                                    >
                                        {char}
                                    </span>
                                )
                            })}
                        </Typography>
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={1000}
                            onClose={() => setOpenSnackbar(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert severity="success" sx={{ width: '100%' }}>
                                Sequence copied to clipboard!
                            </Alert>
                        </Snackbar>
                    </div>
                )
            })}
        </div>
    )
}

export default ViewAlignment;