import { Camera, Tag, Wallet } from "lucide-react";
import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

export default function WorkFlow({
    title,
    subTitle,
    flowArray,
    type,
}: {
    title: string;
    subTitle: string;
    type: "BUY" | "SELL";
    flowArray: { step: string; title: string; description: string; icon: React.JSX.Element }[];
}) {
    if (type === "BUY") {
        return (
            <div className="py-12">
                <div className="mb-4 overflow-hidden px-4">
                    <h2 className="md:text-2xl text-xl font-semibold text-center">{title}</h2>
                    <p className="text-center text-muted-foreground my-2">{subTitle}</p>
                </div>
                <div className="md:flex flex-col md:flex-row gap-4 space-y-7 md:px-[3rem] px-[2rem] mt-8">
                    {flowArray.map((item, index) => (
                        <Card
                            key={index}
                            className="md:w-1/3 w-full bg-gradient-to-r to-blue-900 from-blue-400 h-[16rem]"
                        >
                            <CardContent className="flex flex-col gap-8">
                                <div className="flex justify-start w-full">
                                    <p className="bg-white px-2 rounded-full">{item.step}</p>
                                </div>
                                <div className="w-full flex justify-center">{item.icon}</div>
                                <div className="flex flex-col gap-4 ">
                                    <CardTitle className="text-center">{item.title}</CardTitle>
                                    <CardDescription className="text-xs text-center text-gray-200">
                                        {item.description}
                                    </CardDescription>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="my-12">
                <div className="mb-4 overflow-hidden px-4">
                    <h2 className="md:text-2xl text-xl font-semibold text-center">{title}</h2>
                    <p className="text-center text-muted-foreground my-2">{subTitle}</p>
                </div>
                <div className="md:flex flex-col md:flex-row gap-4 space-y-7 md:px-[3rem] px-[2rem] mt-8">
                    {flowArray.map((item, index) => (
                        <Card key={index} className="md:w-1/3 w-full h-[16rem]">
                            <CardContent className="flex flex-col gap-8">
                                <div className="flex justify-start w-full">
                                    <p className="bg-orange-400 px-2 rounded-full">{item.step}</p>
                                </div>
                                <div className="w-full flex justify-center">{item.icon}</div>
                                <div className="flex flex-col gap-4 ">
                                    <CardTitle className="text-center">{item.title}</CardTitle>
                                    <CardDescription className="text-xs text-center">
                                        {item.description}
                                    </CardDescription>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
}
